import { Injectable } from '@nestjs/common';
import { adminUser, Prisma, User } from 'src/generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';

type UserWithInterests = Prisma.UserGetPayload<{
  include: {
    interests: true;
  };
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnique<T extends Prisma.UserFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
  ) {
    return this.prisma.user.findUnique(args);
  }

  findUniqueAdmin<T extends Prisma.adminUserFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.adminUserFindUniqueArgs>,
  ) {
    return this.prisma.adminUser.findUnique(args);
  }

  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where,
      include: {
        interests: true,
      },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserWithInterests[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        interests: true,
      },
    });
  }

  async findManyWithCount(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          interests: true,
        },
      }),

      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  createAdmin(data: Prisma.adminUserCreateInput): Promise<adminUser> {
    return this.prisma.adminUser.create({
      data,
    });
  }

  update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  updateAdmin(
    where: Prisma.adminUserWhereUniqueInput,
    data: Prisma.adminUserUpdateInput,
  ): Promise<adminUser> {
    return this.prisma.adminUser.update({
      where,
      data,
    });
  }

  delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
