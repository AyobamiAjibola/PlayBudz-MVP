import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, FirebaseService],
  exports: [UsersService, FirebaseService, UsersRepository],
})
export class UsersModule {}
