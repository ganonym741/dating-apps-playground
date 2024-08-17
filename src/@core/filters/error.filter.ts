import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { TraceService } from 'nestjs-otel';

interface ZodResponseException {
  message: string[];
  error: string;
  statusCode: number;
}
@Catch(PrismaClientKnownRequestError, HttpException)
export class ErrorFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);
  constructor(private readonly traceService: TraceService) {}

  catch(exception: T, host: ArgumentsHost) {
    const span = this.traceService.getSpan()!;
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest<Request>();

    span.setStatus({ code: 2, message: 'Error filter' });
    span.end();

    if (exception instanceof PrismaClientKnownRequestError) {
      const paragraphs = exception.message.split('\n');

      // Get the last paragraph
      const message = paragraphs[paragraphs.length - 1];

      this.logger.error(exception);

      // Tambahkan penanganan kesalahan Prisma di sini
      // Tangani kesalahan Prisma di sini
      return response.status(HttpStatus.BAD_REQUEST).json({
        errors: [message],
        timestamp: Date.now(),
        message: 'Error during access database',
        statusCode: HttpStatus.BAD_REQUEST,
        path: request.url,
      });
    }

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object') {
        // Logic untuk ZodResponse
        if ((res as ZodResponseException)?.error === 'ZOD_ERROR') {
          const zodMessage: ZodResponseException = res as any;

          return response.status(zodMessage.statusCode).json({
            errors: zodMessage.message,
            timestamp: Date.now(),
            message: 'Error during form validation',
            statusCode: zodMessage.statusCode,
            path: request.url,
          });
        }
      }

      return response.status(exception.getStatus()).json({
        // errors: [exception.message],
        timestamp: Date.now(),
        message: exception.message,
        statusCode: exception.getStatus(),
        path: request.url,
      });
    }
  }
}
