import { registerAs } from '@nestjs/config';
import { getOptionalEnv } from './env';

export default registerAs('auth', () => ({
  jwtAccessSecret: getOptionalEnv('JWT_ACCESS_SECRET', ''),
  jwtRefreshSecret: getOptionalEnv('JWT_REFRESH_SECRET', ''),
  jwtAccessExpiresIn: getOptionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
  jwtRefreshExpiresIn: getOptionalEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
}));
