import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenPayload } from '../types/jwt.types';
import { ROLES_KEY } from '../decorator/roles.decorator';

/**
 * Guard to check if the currently logged in `User` has the required `roles` to access a method.
 *
 * Use this guard in combination with an authentication guard to protect a method.
 *
 * Also use the `@Roles()` decorator to set which `roles` are allowed to access a method.
 *
 * @example
 * ```ts
 * @Get('users')
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles('admin')
 * getUsers() {
 *   return this.userService.findAll();
 * }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload;
    return this.matchRoles(roles, user.role);
  }
}
