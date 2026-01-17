import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      logger.error(message, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
      });
    } else {
      logger.info(message, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
      });
    }
  });

  next();
};
