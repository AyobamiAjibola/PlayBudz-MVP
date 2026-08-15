import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AppLoggerModule } from './shared/logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { GamesModule } from './modules/games/games.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AppLoggerModule,
    AuthModule,
    FirebaseModule,
    EmailModule,
    RedisModule,
    HealthModule,
    GamesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
