import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AccessTokenStrategyName } from '../strategies/acess-token.strategy';

@Injectable()
export class AccessTokenGuard extends AuthGuard(AccessTokenStrategyName) {}
