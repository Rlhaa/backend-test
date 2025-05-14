import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const error = exception.getResponse();
    const message = typeof error === 'string' ? error : (error as any).message;

    let code = 'INVALID_TOKEN';
    if (message === 'jwt expired') code = 'TOKEN_EXPIRED';
    if (message === 'No auth token' || message === 'Unauthorized') {
      code = 'TOKEN_NOT_FOUND';
    }

    res.status(401).json({
      error: {
        code,
        message:
          code === 'TOKEN_EXPIRED'
            ? '토큰이 만료되었습니다.'
            : code === 'TOKEN_NOT_FOUND'
              ? '토큰이 없습니다.'
              : '토큰이 유효하지 않습니다.',
      },
    });
  }
}
