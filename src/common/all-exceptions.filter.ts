import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let errorDetails = null;

        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
            const response: any = exception.getResponse();
            message = typeof response === 'string' ? response : response.message || message;
            errorDetails = response;
        } else {
            // Log critical errors that aren't HttpExceptions
            this.logger.error('Unhandled Exception:', exception);
            if (exception instanceof Error) {
                message = exception.message;
                errorDetails = exception.stack;
            }
        }

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message: message,
            error: errorDetails
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
