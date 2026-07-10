import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  // imports: [
  //   MulterModule.register({
  //     dest: './uploads',
  //   }),
  // ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, FirebaseService],
  exports: [UsersService, FirebaseService],
})
export class UsersModule {}
