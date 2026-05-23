import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { PrismaErrorRegistry } from '../utils/prisma-error-mapper';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message: string | object = 'Internal server error';

//     // Handle NestJS HttpExceptions
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       message = exception.getResponse();
//     }
//     // Handle Prisma Known Request Errors
//     else if (
//       exception &&
//       typeof exception === 'object' &&
//       (exception as Record<string, unknown>).name === 'PrismaClientKnownRequestError'
//     ) {
//       const {
//         code,
//         meta,
//         message: prismaMsg,
//       } = exception as { code: string; meta?: Record<string, unknown>; message: string };
//       const errorConfig = PrismaErrorRegistry[code];
//       if (errorConfig) {
//         status = errorConfig.status;
//         message = errorConfig.message(meta);
//       } else {
//         status = HttpStatus.BAD_REQUEST;
//         message = `Database error: ${prismaMsg}`;
//       }
//     }
//     // Handle other Prisma errors (Initialization, etc.)
//     else if (
//       exception &&
//       typeof exception === 'object' &&
//       'name' in exception &&
//       exception.name === 'PrismaClientValidationError'
//     ) {
//       status = HttpStatus.BAD_REQUEST;
//       message = 'Validation error: One or more fields are invalid.';
//     }

//     const errorResponse = {
//       success: false,
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       method: request.method,
//       message:
//         typeof message === 'string'
//           ? message
//           : (message as Record<string, unknown>).message || message,
//     };

//     response.status(status).json(errorResponse);
//   }
// }

//help us debugging with the logs
//should be removed in production
//dont forget to  add NODE_ENV=development to the .env file

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // ✅ Always log the full exception (stack + cause)
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let cause: string | undefined; // ✅ capture root cause separately

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();

      // ✅ Extract the cause if present
      const exceptionCause = exception.cause;
      if (exceptionCause instanceof Error) {
        cause = exceptionCause.message;
      }
    } else if (
      exception &&
      typeof exception === 'object' &&
      (exception as Record<string, unknown>).name === 'PrismaClientKnownRequestError'
    ) {
      const {
        code,
        meta,
        message: prismaMsg,
      } = exception as {
        code: string;
        meta?: Record<string, unknown>;
        message: string;
      };
      const errorConfig = PrismaErrorRegistry[code];
      if (errorConfig) {
        status = errorConfig.status;
        message = errorConfig.message(meta);
        cause = `Prisma [${code}]${meta ? ': ' + JSON.stringify(meta) : ''}`; // ✅ include meta
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = `Database error: ${prismaMsg}`;
        cause = `Unregistered Prisma code: ${code}`;
      }
    } else if (
      exception &&
      typeof exception === 'object' &&
      'name' in exception &&
      exception.name === 'PrismaClientValidationError'
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error: One or more fields are invalid.';
      cause = (exception as Error).message; // ✅ Prisma validation messages are descriptive
    }

    const isDev = process.env.NODE_ENV !== 'production';

    // 4xx auth/validation failures are expected control flow for guards and clients.
    // Keep full stacks for server failures only, otherwise anonymous auth checks spam dev logs.
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else if (status !== HttpStatus.UNAUTHORIZED) {
      this.logger.warn(`${request.method} ${request.url} failed with HTTP ${status}`);
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as Record<string, unknown>).message || message,
      // ✅ Only expose cause in non-production environments
      ...(isDev && cause ? { cause } : {}),
    };

    response.status(status).json(errorResponse);
  }
}
