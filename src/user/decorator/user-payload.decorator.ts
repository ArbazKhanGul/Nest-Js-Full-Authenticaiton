import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../types/jwt.types';

export const CurrentUserPayload = createParamDecorator(
  (data: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!data) {
      return request.user;
    }
    return request.user[data];
  },
);
