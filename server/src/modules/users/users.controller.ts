import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { InterestsType, UserLocation, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { FirebaseUser } from 'src/common/types/authenticated-user.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation.pipe';
import { ImageTypeValidationPipe } from 'src/common/pipes/image-type-validation.pipe';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { parseJson } from 'src/config/json';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUserFirebase(dto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('update-user-info')
  updateUser(@CurrentUser() user: FirebaseUser, @Body() body: UpdateUserDto) {
    const location = parseJson<UserLocation>(body.location, 'location');

    const interests = parseJson<InterestsType>(body.interests, 'interests');

    return this.usersService.updateUser(user, body, location, interests);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('update-user')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req, file, cb) => {
          const fileName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  updateProfile(
    @CurrentUser() user: FirebaseUser,
    @Body() body: UpdateUserDto,
    @UploadedFile(new FileSizeValidationPipe(), new ImageTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    const location = body.location
      ? (JSON.parse(body.location) as UserLocation)
      : undefined;

    const interests = body.interests
      ? (JSON.parse(body.interests) as InterestsType)
      : undefined;

    const imageUrl = file ? `/uploads/profile/${file.filename}` : '';
    return this.usersService.updateUserProfile(
      body,
      user,
      imageUrl,
      location,
      interests,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: FirebaseUser): FirebaseUser {
    return user;
  }

  @Get('get-user/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get('get-users')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser({
      where: { id },
    });
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('players')
  async findAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAllUsers(page, limit, search);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('find-players-like-you')
  async findPlayersLikeYou(
    @CurrentUser() user: FirebaseUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.findPlayersLikeYou(page, limit, user, search);
  }
}
