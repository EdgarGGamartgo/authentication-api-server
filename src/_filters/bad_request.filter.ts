import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const r = exception.getResponse() as any;

    if (status === 400 && r?.statusCode) {
      return response.status(status).json({
        message: 'Account creation failed',
        cause: r?.message,
      });
    }

    return exception;
  }
}
