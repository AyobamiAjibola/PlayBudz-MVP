import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { ApiResponse } from 'src/common/types/api-response.type';
import { User, Prisma } from 'src/generated/prisma/browser';
import { AppLoggerService } from 'src/shared/logger/logger.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import type { FirebaseUser } from 'src/common/types/authenticated-user.type';

@Injectable()
export class UsersService {
  constructor(
    // @Inject(FIREBASE_PROVIDER) private readonly firebaseApp: admin.app.App,
    private readonly usersRepository: UsersRepository,
    private readonly logger: AppLoggerService,
    private readonly firebaseService: FirebaseService,
    // private auth: admin.auth.Auth;
  ) {
    // this.auth = this.firebaseApp.auth();
  }

  async getUser(id: string): Promise<ApiResponse<User | null>> {
    const user = await this.usersRepository.findUnique({
      id,
    });

    if (!user) {
      this.logger.warn('User not found', {
        userId: id,
      });
      throw new NotFoundException('User does not exist');
    }

    return {
      success: true,
      message: 'Successful',
      data: user,
    };
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    const users = await this.usersRepository.findMany({});

    return {
      success: true,
      message: 'Successful',
      data: users,
    };
  }

  // async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
  //   const userExist = await this.usersRepository.findUnique({
  //     email: data.email,
  //   });
  //   if (userExist) {
  //     throw new ConflictException('User with email already exist.');
  //   }

  //   const hashedPassword = await bcrypt.hash(data.password, 10);

  //   const metadata = {
  //     ...data,
  //     password: hashedPassword,
  //   };
  //   const newUser = await this.usersRepository.create(metadata);

  //   return {
  //     success: true,
  //     message: 'Successful',
  //     data: newUser,
  //   };
  // }

  async updateUserProfile(
    dto: UpdateUserDto,
    user: FirebaseUser,
    imageUrl: string,
  ): Promise<ApiResponse<User>> {
    const data = {
      image: imageUrl,
      dob: dto.dob,
      gender: dto.gender,
      biography: dto.biography,
      interests: dto.interests,
      location: dto.location,
      fullName: dto.fullName,
      registrationComplete: true,
    };

    const u = await this.usersRepository.findOne({
      firebaseUid: user.uid,
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.update({ id: u.id }, data);

    return {
      success: true,
      message: 'Successful.',
      data: updatedUser,
    };
  }

  async createUserFirebase(data: CreateUserDto): Promise<ApiResponse<User>> {
    const decoded = await this.firebaseService.verifyIdToken(data.idToken);

    const firebaseUid = decoded.uid;
    const email = decoded.email;

    const provider = decoded.firebase?.sign_in_provider;

    const newUser = await this.usersRepository.create({
      fullName: data.fullName,
      firebaseUid,
      provider,
      email: email as string,
    });

    return {
      success: true,
      message: 'Successful.',
      data: newUser,
    };
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<ApiResponse<User>> {
    const { where, data } = params;
    const user = await this.usersRepository.update(where, data);

    return {
      success: true,
      message: 'Successful',
      data: user,
    };
  }

  async updateNotification(dto: FirebaseUser): Promise<ApiResponse<null>> {
    const user = await this.usersRepository.findOne({
      firebaseUid: dto.uid,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(
      { id: user.id },
      { notificationEnabled: !user.notificationEnabled },
    );

    return {
      success: true,
      message: 'Successfully updated notification.',
      data: null,
    };
  }

  async deleteUser(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<ApiResponse<null>> {
    const { where } = params;
    await this.usersRepository.delete(where);

    return {
      success: true,
      message: 'Successfully deleted user.',
      data: null,
    };
  }
}
