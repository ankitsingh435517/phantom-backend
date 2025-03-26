import type { NextFunction, Request, Response } from "express";
import client from "prom-client";

const requestCount = new client.Counter({
  name: "http_request_total",
  help: "Total number of API requests",
  labelNames: ["method", "route", "status"],
});

const responseTime = new client.Histogram({
  name: "http_response_time_seconds",
  help: "API response time",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

const metricMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const end = responseTime.startTimer();
  res.on("finish", () => {
    requestCount.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
};

export { metricMiddleware, client };
