import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLoggerService {
  constructor(private readonly logger: PinoLogger) {}

  info(message: string, data?: Record<string, any>) {
    this.logger.info(data ?? {}, message);
  }

  warn(message: string, data?: Record<string, any>) {
    this.logger.warn(data ?? {}, message);
  }

  error(message: string, error?: Error, data?: Record<string, any>) {
    this.logger.error(
      {
        ...data,
        stack: error?.stack,
      },
      message,
    );
  }

  debug(message: string, data?: Record<string, any>) {
    this.logger.debug(data ?? {}, message);
  }
}
