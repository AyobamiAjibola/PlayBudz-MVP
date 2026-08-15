import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppLoggerService } from 'src/shared/logger/logger.service';
import { UsersRepository } from '../users/users.repository';
import { ApiResponse } from 'src/common/types/api-response.type';
import { FirebaseUser } from 'src/common/types/authenticated-user.type';
import {
  Game,
  Participation,
  Prisma,
  SportTypes,
  UserInterest,
} from 'src/generated/prisma/browser';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { GamesRepository, GameWithRelations } from './games.repository';
import { GameLocation } from './games.controller';

export type StatusFilter = 'upcoming' | 'past';
export type GameFilter = 'saved';

const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

@Injectable()
export class GamesService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: AppLoggerService,
    private readonly gameRepository: GamesRepository,
  ) {}

  async createSpotTypes(sport: string): Promise<ApiResponse<SportTypes>> {
    const data: Prisma.SportTypesCreateInput = {
      sport,
    };

    const newSport = await this.gameRepository.createSportType(data);

    return {
      success: true,
      message: 'Successful',
      data: newSport,
    };
  }

  async findAllSports(): Promise<ApiResponse<SportTypes[]>> {
    const sports = await this.gameRepository.findAllSports();
    return {
      success: true,
      message: 'Successful',
      data: sports,
    };
  }

  async createGame(
    createGameDto: CreateGameDto,
    user: FirebaseUser,
    imageUrl: string,
    location?: GameLocation,
  ): Promise<ApiResponse<Game>> {
    const u = await this.usersRepository.findOne({
      firebaseUid: user.uid,
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const data: Prisma.GameCreateInput = {
      ...createGameDto,
      location: { create: location },
      gameDateTime: new Date(createGameDto.gameDateTime),
      creator: {
        connect: {
          id: u.id,
        },
      },
      image: imageUrl ?? '',
    };

    const newGame = await this.gameRepository.create(data);

    return {
      success: true,
      message: 'Successful',
      data: newGame,
    };
  }

  async cancelGame(
    gameId: string,
    user: FirebaseUser,
  ): Promise<ApiResponse<null>> {
    const u = await this.usersRepository.findOne({
      firebaseUid: user.uid,
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const game = await this.gameRepository.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Event does not exist');
    }

    if (game.creatorId !== u.id) {
      throw new ForbiddenException('You are not allowed to modify this event.');
    }

    await this.gameRepository.update({ id: gameId }, { cancelled: true });

    return {
      success: true,
      message: 'Event canceled successfully',
      data: null,
    };
  }

  async toggleOpenGame(
    gameId: string,
    user: FirebaseUser,
  ): Promise<ApiResponse<null>> {
    const u = await this.usersRepository.findOne({
      firebaseUid: user.uid,
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const game = await this.gameRepository.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Event does not exist');
    }

    if (game.creatorId !== u.id) {
      throw new ForbiddenException('You are not allowed to modify this event.');
    }

    if (game.cancelled) {
      throw new ForbiddenException(
        'This event has been cancelled and is no longer available.',
      );
    }

    await this.gameRepository.update({ id: gameId }, { closed: !game.closed });

    return {
      success: true,
      message: game.closed
        ? 'Event closed successfully'
        : 'Event reopened successfully',
      data: null,
    };
  }

  async updateGame(
    gameDto: UpdateGameDto,
    user: FirebaseUser,
    gameId: string,
    imageUrl?: string,
    location?: GameLocation,
  ): Promise<ApiResponse<Game>> {
    const u = await this.usersRepository.findOne({
      firebaseUid: user.uid,
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const game = await this.gameRepository.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Event does not exist');
    }

    if (game.creatorId !== u.id) {
      throw new ForbiddenException('You are not allowed to edit this event');
    }

    if (game.cancelled) {
      throw new ForbiddenException(
        'This event has been cancelled and is no longer available.',
      );
    }

    const data: Prisma.GameUpdateInput = {
      ...(gameDto.sport !== undefined && {
        sport: gameDto.sport,
      }),

      ...(gameDto.title !== undefined && {
        title: gameDto.title,
      }),

      ...(gameDto.skill_level !== undefined && {
        skill_level: gameDto.skill_level,
      }),

      ...(gameDto.players !== undefined && {
        players: gameDto.players,
      }),

      ...(gameDto.gameDateTime !== undefined && {
        gameDateTime: new Date(gameDto.gameDateTime),
      }),

      ...(gameDto.description !== undefined && {
        description: gameDto.description,
      }),

      ...(gameDto.gameType !== undefined && {
        gameType: gameDto.gameType,
      }),

      ...(imageUrl !== undefined && {
        image: imageUrl,
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

    const updatedGame = await this.gameRepository.update({ id: game.id }, data);

    return {
      success: true,
      message: 'Successful',
      data: updatedGame,
    };
  }

  async findGame(gameId: string): Promise<ApiResponse<Game>> {
    const game = await this.gameRepository.findUnique({
      where: { id: gameId },
      include: {
        location: true,
        participants: {
          include: {
            user: {
              include: {
                interests: true,
              },
            },
          },
        },
        creator: {
          include: {
            interests: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return {
      success: true,
      message: 'Successful',
      data: game,
    };
  }

  /**
   *
   * @param page
   * @param limit
   * @param userId
   * @param filter by saved | upcoming | past
   * @param sport
   * @returns the games
   */
  async findGames(
    page: number = 1,
    limit: number = 10,
    user: FirebaseUser,
    sport?: string,
    search?: string,
    date?: string,
    status?: StatusFilter,
  ): Promise<ApiResponse<Game[]>> {
    const skip = (page - 1) * limit;
    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const conditions: Prisma.GameWhereInput[] = [
      {
        OR: [
          {
            creatorId: u.id,
          },
          {
            participants: {
              some: {
                userId: u.id,
              },
            },
          },
        ],
      },
    ];

    if (status === 'upcoming') {
      conditions.push({
        gameDateTime: {
          gte: new Date(),
        },
      });
    }

    if (status === 'past') {
      conditions.push({
        gameDateTime: {
          lt: new Date(),
        },
      });
    }

    if (date) {
      const selectedDate = new Date(date);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      conditions.push({
        gameDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      });
    }

    if (sport) {
      conditions.push({
        sport,
      });
    }

    if (search) {
      conditions.push({
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            sport: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const where: Prisma.GameWhereInput = {
      AND: conditions,
    };

    const games = await this.gameRepository.findMany({
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
      data: games,
    };
  }

  async saveGame(
    user: FirebaseUser,
    gameId: string,
  ): Promise<ApiResponse<null>> {
    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const game = await this.gameRepository.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Event does not exist');
    }

    if (game.cancelled) {
      throw new ForbiddenException(
        'This event has been cancelled and is no longer available.',
      );
    }

    const userId = u.id;

    await this.gameRepository.saveGame(userId, gameId);

    return {
      success: true,
      message: 'Game saved successfully',
      data: null,
    };
  }

  async unSaveGame(
    user: FirebaseUser,
    gameId: string,
  ): Promise<ApiResponse<null>> {
    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const userId = u.id;
    await this.gameRepository.unSaveGame(userId, gameId);

    return {
      success: true,
      message: 'Game unsaved successfully',
      data: null,
    };
  }

  async savedGames(
    user: FirebaseUser,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<ApiResponse<Game[]>> {
    const skip = (page - 1) * limit;
    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
      include: { interests: true },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const conditions: Prisma.GameWhereInput[] = [
      {
        savedBy: {
          some: {
            userId: u.id,
          },
        },
      },
    ];

    if (search) {
      conditions.push({
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            sport: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const games = await this.gameRepository.findMany({
      skip,
      take: limit,
      where: {
        AND: conditions,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      message: 'Successful',
      data: games,
    };
  }

  async recommendedGames(
    user: FirebaseUser,
    page: number = 1,
    limit: number = 10,
    search?: string,
    date?: string,
    sport?: string,
    latitude?: string,
    longitude?: string,
    radius?: string,
  ): Promise<ApiResponse<GameWithRelations[]>> {
    const skip = (page - 1) * limit;

    const userLatitude = latitude !== undefined ? Number(latitude) : undefined;

    const userLongitude =
      longitude !== undefined ? Number(longitude) : undefined;

    const radiusKm = radius ? Number(radius) : 20;

    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
      include: { interests: true },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const interestNames = u.interests.map((i: UserInterest) => i.interest);

    const conditions: Prisma.GameWhereInput[] = [
      {
        sport: {
          in: interestNames,
        },
      },
      {
        creatorId: {
          not: u.id,
        },
      },
      {
        participants: {
          none: {
            userId: u.id,
          },
        },
      },
    ];

    if (date) {
      const selectedDate = new Date(date);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      conditions.push({
        gameDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      });
    }

    if (sport) {
      conditions.push({
        sport,
      });
    }

    if (search) {
      conditions.push({
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            sport: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const games = await this.gameRepository.findMany({
      skip,
      take: limit,
      where: {
        AND: conditions,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let result = games;

    if (userLatitude !== undefined && userLongitude !== undefined) {
      result = games.filter((game) => {
        if (!game.location) return false;

        const distance = getDistanceKm(
          userLatitude,
          userLongitude,
          game.location.latitude,
          game.location.longitude,
        );

        return distance <= radiusKm;
      });
    }

    return {
      success: true,
      message: 'Successful',
      data: result,
    };
  }

  async findParticipatingGames(
    user: FirebaseUser,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<Game[]>> {
    const skip = (page - 1) * limit;
    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }
    const games = await this.gameRepository.findMany({
      skip,
      take: limit,
      where: {
        participants: {
          some: {
            userId: u.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      message: 'Successful',
      data: games,
    };
  }

  async joinGame(
    gameId: string,
    user: FirebaseUser,
  ): Promise<ApiResponse<Participation>> {
    const u = await this.usersRepository.findUnique({
      where: { firebaseUid: user.uid },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const game = await this.gameRepository.findUnique({
      where: { id: gameId },
      include: {
        location: true,
        participants: {
          include: {
            user: true,
          },
        },
        creator: {
          include: {
            interests: true,
          },
        },
      },
    });

    const totalParticipants =
      await this.gameRepository.countParticipants(gameId);

    if (!game) {
      throw new NotFoundException('Event does not exist');
    }

    if (totalParticipants >= Number(game.players)) {
      throw new ForbiddenException(
        'This event is full. All available spots have been filled.',
      );
    }

    if (game.cancelled) {
      throw new ForbiddenException(
        'This event has been cancelled and is no longer available.',
      );
    }

    const participation = await this.gameRepository.joinGame(u.id, gameId);

    return {
      success: true,
      message: 'Successful',
      data: participation,
    };
  }

  async leaveGame(
    gameId: string,
    user: FirebaseUser,
  ): Promise<ApiResponse<null>> {
    const u = await this.usersRepository.findUnique({
      where: {
        firebaseUid: user.uid,
      },
    });

    if (!u) {
      throw new NotFoundException('User not found');
    }

    const game = await this.gameRepository.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      throw new NotFoundException('Event does not exist');
    }

    if (game.creatorId === u.id) {
      throw new ForbiddenException('You cannot leave an event you created.');
    }

    const participation = await this.gameRepository.findParticipation({
      userId_gameId: {
        userId: u.id,
        gameId,
      },
    });

    if (!participation) {
      throw new NotFoundException('You are not participating in this event.');
    }

    await this.gameRepository.leaveGame(u.id, gameId);

    return {
      success: true,
      message: 'You have successfully left the event.',
      data: null,
    };
  }
}
