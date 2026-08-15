import { Injectable } from '@nestjs/common';
import {
  Game,
  Participation,
  Prisma,
  SportTypes,
} from 'src/generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';

export type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    creator: true;
    location: true;
    participants: {
      include: {
        user: true;
      };
    };
  };
}>;

@Injectable()
export class GamesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.GameCreateInput): Promise<Game> {
    return this.prisma.game.create({
      data,
    });
  }

  createSportType(data: Prisma.SportTypesCreateInput): Promise<SportTypes> {
    return this.prisma.sportTypes.upsert({
      where: {
        sport: data.sport,
      },
      update: {},
      create: {
        sport: data.sport,
      },
    });
  }

  findAllSports(): Promise<SportTypes[]> {
    return this.prisma.sportTypes.findMany();
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GameWhereUniqueInput;
    where?: Prisma.GameWhereInput;
    orderBy?: Prisma.GameOrderByWithRelationInput;
  }): Promise<GameWithRelations[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.game.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        creator: true,
        location: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  findUnique<T extends Prisma.GameFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.GameFindUniqueArgs>,
  ) {
    return this.prisma.game.findUnique(args);
  }

  findOne(where: Prisma.GameWhereUniqueInput): Promise<Game | null> {
    return this.prisma.game.findFirst({
      where,
      include: {
        creator: true,
      },
    });
  }

  update(
    where: Prisma.GameWhereUniqueInput,
    data: Prisma.GameUpdateInput,
  ): Promise<Game> {
    return this.prisma.game.update({
      where,
      data,
    });
  }

  findParticipation(
    where: Prisma.ParticipationWhereUniqueInput,
  ): Promise<Participation | null> {
    return this.prisma.participation.findUnique({
      where,
    });
  }

  countParticipants(gameId: string): Promise<number> {
    return this.prisma.participation.count({
      where: {
        gameId,
      },
    });
  }

  findParticipantsByGameId(gameId: string) {
    return this.prisma.participation.findMany({
      where: {
        gameId,
      },
      include: {
        user: {
          include: {
            interests: true,
          },
        },
      },
    });
  }

  joinGame(userId: string, gameId: string): Promise<Participation> {
    return this.prisma.participation.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      update: {},
      create: {
        userId,
        gameId,
      },
    });
  }

  leaveGame(userId: string, gameId: string): Promise<Participation> {
    return this.prisma.participation.delete({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });
  }

  deleteGame(where: Prisma.GameWhereUniqueInput): Promise<Game> {
    return this.prisma.game.delete({
      where,
    });
  }

  async saveGame(userId: string, gameId: string): Promise<void> {
    await this.prisma.savedGame.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      update: {},
      create: {
        user: {
          connect: { id: userId },
        },
        game: {
          connect: { id: gameId },
        },
      },
    });
  }

  async unSaveGame(userId: string, gameId: string): Promise<void> {
    await this.prisma.savedGame.delete({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });
  }
}
