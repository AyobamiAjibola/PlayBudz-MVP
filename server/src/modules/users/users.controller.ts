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
} from '@nestjs/common';
import { UsersService } from './users.service';
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUserFirebase(dto);
  }

  @Patch('update-user/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser({
      where: { id },
      data: dto,
    });
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('update-notification')
  updateNotification(@CurrentUser() user: FirebaseUser) {
    return this.usersService.updateNotification(user);
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
    const imageUrl = file ? `/uploads/profile/${file.filename}` : '';
    return this.usersService.updateUserProfile(body, user, imageUrl);
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
}
