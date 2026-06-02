import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

export const WsJwtMiddleware = (jwtService: JwtService) => {
  return (client: Socket, next: (err?: Error) => void) => {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.split(' ')[1];
      const payload = jwtService.verify(token);
      client.data.userId = payload.sub || payload.id;
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  };
};
