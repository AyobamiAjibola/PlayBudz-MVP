import { GamesService } from './games.service';
import type { StatusFilter } from './games.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { FirebaseUser } from 'src/common/types/authenticated-user.type';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { FileSizeValidationPipe } from 'src/common/pipes/file-size-validation.pipe';
import { ImageTypeValidationPipe } from 'src/common/pipes/image-type-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { parseJson } from 'src/config/json';

export interface GameLocation {
  name: string;
  latitude: number;
  longitude: number;
}

type SportType = {
  sport: string;
};

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // @UseGuards(FirebaseAuthGuard)
  @Post('create-sport-type')
  createSport(@Body() body: SportType) {
    return this.gamesService.createSpotTypes(body.sport);
  }

  @Get('sports')
  fetchSportTypes() {
    return this.gamesService.findAllSports();
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('create-game')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/games',
        filename: (req, file, cb) => {
          const fileName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  createGame(
    @CurrentUser() user: FirebaseUser,
    @Body() body: CreateGameDto,
    @UploadedFile(new FileSizeValidationPipe(), new ImageTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    const location = parseJson<GameLocation>(body.location, 'location');
    const imageUrl = file ? `/uploads/games/${file.filename}` : '';
    return this.gamesService.createGame(body, user, imageUrl, location);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('update-game')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/games',
        filename: (req, file, cb) => {
          const fileName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  updateGame(
    @CurrentUser() user: FirebaseUser,
    @Body() body: UpdateGameDto,
    @UploadedFile(new FileSizeValidationPipe(), new ImageTypeValidationPipe())
    file: Express.Multer.File,
    @Query('gameId') gameId: string,
  ) {
    const location = parseJson<GameLocation>(body.location, 'location');
    const imageUrl = file ? `/uploads/games/${file.filename}` : body.imageUri;
    return this.gamesService.updateGame(body, user, gameId, imageUrl, location);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('toggle-closed-state')
  async toggleCloseGame(
    @CurrentUser() user: FirebaseUser,
    @Query('gameId') gameId: string,
  ) {
    return this.gamesService.toggleOpenGame(gameId, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('cancel-game')
  async cancelGame(
    @CurrentUser() user: FirebaseUser,
    @Query('gameId') gameId: string,
  ) {
    return this.gamesService.cancelGame(gameId, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':gameId/leave')
  leaveGame(
    @CurrentUser() user: FirebaseUser,
    @Param('gameId') gameId: string,
  ) {
    return this.gamesService.leaveGame(gameId, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('all')
  async findGames(
    @CurrentUser() user: FirebaseUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sport') sport?: string,
    @Query('search') search?: string,
    @Query('date') date?: string,
    @Query('status') status?: StatusFilter,
  ) {
    return this.gamesService.findGames(
      page,
      limit,
      user,
      sport,
      search,
      date,
      status,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('game')
  async findGame(@Query('eventId') eventId: string) {
    return this.gamesService.findGame(eventId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('join-game')
  async joinGame(
    @Body() body: { gameId: string },
    @CurrentUser() user: FirebaseUser,
  ) {
    return this.gamesService.joinGame(body.gameId, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('save-game')
  async saveGame(@CurrentUser() user: FirebaseUser, @Body() gameId: string) {
    return this.gamesService.saveGame(user, gameId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('unsave-game')
  async unSaveGame(@CurrentUser() user: FirebaseUser, @Body() gameId: string) {
    return this.gamesService.unSaveGame(user, gameId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('recommended-games')
  async findRecommendedGames(
    @CurrentUser() user: FirebaseUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sport') sport?: string,
    @Query('date') date?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('radius') radius?: string,
  ) {
    return this.gamesService.recommendedGames(
      user,
      page,
      limit,
      search,
      date,
      sport,
      latitude,
      longitude,
      radius,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('saved-games')
  async findSavedGames(
    @CurrentUser() user: FirebaseUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.gamesService.savedGames(user, page, limit, search);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('participating-games')
  async findParticipatingGames(
    @CurrentUser() user: FirebaseUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.gamesService.findParticipatingGames(user, page, limit);
  }
}
