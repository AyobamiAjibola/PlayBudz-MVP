import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseUser } from '../types/authenticated-user.type';

type AuthenticatedRequest = Request & {
  user: FirebaseUser;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): FirebaseUser => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);
