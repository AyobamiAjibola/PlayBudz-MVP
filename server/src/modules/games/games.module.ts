import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GamesRepository } from './games.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [JwtModule.register({}), UsersModule, PassportModule],
  controllers: [GamesController],
  providers: [GamesService, GamesRepository, FirebaseService],
  exports: [GamesService, FirebaseService],
})
export class GamesModule {}
