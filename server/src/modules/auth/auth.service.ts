import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { FirebaseService } from 'src/firebase/firebase.service';
import { LoginFirebaseDto } from './dto/sign-in-dto';
import { EmailService } from 'src/email/email.service';
import { ApiResponse } from 'src/common/types/api-response.type';
import { User } from 'src/generated/prisma/browser';
import { RedisService } from 'src/redis/redis.service';
import { FirebaseUser } from 'src/common/types/authenticated-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  // async login(dto: LoginDto) {
  //   const user = await this.usersRepository.findUnique({
  //     email: dto.email,
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const isPasswordValid = await bcrypt.compare(dto.password, user.password);

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const payload = {
  //     sub: user.id,
  //     email: user.email,
  //   };

  //   const accessToken = await this.jwtService.signAsync(payload, {
  //     expiresIn: '15m',
  //     secret: process.env.JWT_ACCESS_SECRET,
  //   });

  //   const refreshToken = await this.jwtService.signAsync(payload, {
  //     expiresIn: '7d',
  //     secret: process.env.JWT_REFRESH_SECRET,
  //   });

  //   const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  //   await this.usersRepository.update(
  //     { id: user.id },
  //     { refreshToken: hashedRefreshToken },
  //   );

  //   return {
  //     success: true,
  //     message: 'Login successful',
  //     data: {
  //       accessToken,
  //       refreshToken,
  //     },
  //   };
  // }

  async sendOtp(dto: { email: string }): Promise<ApiResponse<string>> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redisService.set(`otp:${dto.email}`, otp, 300);

    await this.emailService.sendOtp(dto.email, otp);

    return {
      success: true,
      message: 'OTP sent successfully.',
      data: otp,
    };
  }

  async verifyOtp(dto: {
    email: string;
    otp: string;
  }): Promise<ApiResponse<null>> {
    const storedOtp = await this.redisService.get(`otp:${dto.email}`);

    if (!storedOtp) {
      throw new BadRequestException('OTP has expired.');
    }

    if (storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.redisService.del(`otp:${dto.email}`);

    return {
      success: true,
      message: 'OTP sent successfully.',
      data: null,
    };
  }

  async profile(user: FirebaseUser): Promise<ApiResponse<User>> {
    const u = await this.usersRepository.findOne({
      firebaseUid: user.uid,
    });

    if (!u) {
      throw new BadRequestException('User does not exist.');
    }

    return {
      success: true,
      message: 'Successful.',
      data: u,
    };
  }

  async loginFirebase(dto: LoginFirebaseDto): Promise<ApiResponse<User>> {
    const decoded = await this.firebaseService.verifyIdToken(dto.idToken);

    const firebaseUid = decoded.uid;
    const email = decoded.email;

    const provider = decoded.firebase?.sign_in_provider;

    let user = await this.usersRepository.findUnique({ firebaseUid });

    if (!user) {
      const shouldAutoCreate =
        provider === 'google.com' || provider === 'apple.com';

      if (!shouldAutoCreate) {
        throw new UnauthorizedException(
          'User account not found. Please register first.',
        );
      }

      user = await this.usersRepository.create({
        firebaseUid,
        email: email as string,
        provider,
      });
    }

    return {
      success: true,
      message: 'Successful.',
      data: user,
    };
  }
}
