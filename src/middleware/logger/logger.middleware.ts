import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const captured_req_time = Date.now();
    res.on('finish', () => {
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${
          Date.now() - captured_req_time
        } ms`,
      );
    });
    next();
  }
}
