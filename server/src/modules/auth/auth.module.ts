import { Module } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [AuthController],
  providers: [
    FirebaseService,
    AuthService,
    UsersRepository,
    JwtService,
    EmailService,
  ],
  exports: [FirebaseService, AuthService, EmailService],
})
export class AuthModule {}
