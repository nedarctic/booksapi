import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

@Catch()
export class CustomResponseFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomResponseFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse();

    // logging
    if (exception instanceof Error) {
      this.logger.error(
        `Error on ${req.method} ${req.url}`,
        exception.stack,
      );
    }

    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const response = exception.getResponse();

      message =
        typeof response === "string"
          ? { message: response }
          : response;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      message = {
        message: "Internal server error",
      };
    }

    res.status(status).json({
      success: false,
      error: {
        statusCode: status,
        ...(typeof message === "object"
          ? message
          : { message }),
      },
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}