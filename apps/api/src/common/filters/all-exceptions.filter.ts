import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaErrorRegistry } from '../utils/prisma-error-mapper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    // Handle NestJS HttpExceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } 
    // Handle Prisma Known Request Errors
    else if (exception && typeof exception === 'object' && (exception as any).name === 'PrismaClientKnownRequestError') {
      const { code, meta, message: prismaMsg } = exception as any;
      const errorConfig = PrismaErrorRegistry[code];
      if (errorConfig) {
        status = errorConfig.status;
        message = errorConfig.message(meta);
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = `Database error: ${prismaMsg}`;
      }
    }
    // Handle other Prisma errors (Initialization, etc.)
    else if (exception && typeof exception === 'object' && 'name' in exception && exception.name === 'PrismaClientValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error: One or more fields are invalid.';
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message || message,
    };

    response.status(status).json(errorResponse);
  }
}
