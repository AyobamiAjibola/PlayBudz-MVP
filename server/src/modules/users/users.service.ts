import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { ApiResponse } from 'src/common/types/api-response.type';
import { User, Prisma, UserInterest } from 'src/generated/prisma/browser';
import { AppLoggerService } from 'src/shared/logger/logger.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import type { FirebaseUser } from 'src/common/types/authenticated-user.type';

export interface UserLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface InterestsType {
  interest: string;
  skill_level: string;
}

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
      where: { id },
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
    location?: UserLocation,
    interests?: InterestsType,
  ): Promise<ApiResponse<User>> {
    const data = {
      image: imageUrl,
      dob: dto.dob,
      gender: dto.gender,
      biography: dto.biography,
      interests: { create: interests },
      location: { create: location },
      fullName: dto.fullName,
      registrationComplete: true,
    };

    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
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

    if (!email) {
      throw new BadRequestException(
        'Firebase account does not contain an email address.',
      );
    }

    const existingUser = await this.usersRepository.findUnique({
      where: { firebaseUid },
    });

    if (existingUser) {
      return {
        success: true,
        message: 'User account already exists.',
        data: existingUser,
      };
    }

    const newUser = await this.usersRepository.create({
      fullName:
        provider === 'google.com'
          ? ((decoded.name as string) ?? '')
          : data.fullName,
      firebaseUid,
      provider,
      email: email,
      image: provider === 'google.com' ? (decoded.picture ?? '') : '',
    });

    return {
      success: true,
      message: 'Successful.',
      data: newUser,
    };
  }

  async updateUser(
    user: FirebaseUser,
    dto: UpdateUserDto,
    location?: UserLocation,
    interests?: InterestsType,
  ): Promise<ApiResponse<null>> {
    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const data: Prisma.UserUpdateInput = {
      ...(dto.dob !== undefined && {
        dob: dto.dob,
      }),

      ...(dto.gender !== undefined && {
        gender: dto.gender,
      }),

      ...(dto.biography !== undefined && {
        biography: dto.biography,
      }),

      ...(dto.fullName !== undefined && {
        fullName: dto.fullName,
      }),

      ...(dto.notificationEnabled !== undefined && {
        notificationEnabled: dto.notificationEnabled,
      }),

      ...(dto.pushToken !== undefined && {
        pushToken: dto.pushToken,
      }),

      ...(interests !== undefined && {
        interests: {
          deleteMany: {},
          create: interests,
        },
      }),

      ...(location !== undefined && {
        location: {
          upsert: {
            create: location,
            update: location,
          },
        },
      }),
    };

    await this.usersRepository.update({ id: u.id }, data);

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

  async findAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ApiResponse<User[]>> {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          gender: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const users = await this.usersRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      message: 'Successful',
      data: users,
    };
  }

  async findPlayersLikeYou(
    page: number = 1,
    limit: number = 10,
    user: FirebaseUser,
    search?: string,
  ): Promise<ApiResponse<User[]>> {
    const skip = (page - 1) * limit;

    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
      include: { interests: true },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const interestNames = u.interests.map((i: UserInterest) => i.interest);

    const where: Prisma.UserWhereInput = {
      id: {
        not: u.id,
      },
    };

    if (interestNames.length > 0) {
      where.interests = {
        some: {
          interest: {
            in: interestNames,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          gender: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const users = await this.usersRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      message: 'Successful',
      data: users,
    };
  }
}
