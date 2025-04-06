import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";
import client from "./redisClient";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 90,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: "api:",
  }),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 45,
  message: "Too many failed login attempts. Try again in 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: "login:",
  }),
});

export { generalLimiter, loginLimiter };
