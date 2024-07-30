import { InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfigDTO } from '../dto/app-config.dto';

export function validateConfig(processEnv: NodeJS.ProcessEnv): AppConfigDTO {
  const castedEnv = plainToInstance(AppConfigDTO, processEnv, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(castedEnv);

  if (errors.length > 0) {
    throw new InternalServerErrorException(errors.toString());
  }
  return castedEnv;
}
