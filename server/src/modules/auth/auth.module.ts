import { Module } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/email/email.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [FirebaseService, AuthService, EmailService, JwtStrategy],
  exports: [FirebaseService, AuthService, EmailService],
})
export class AuthModule {}
