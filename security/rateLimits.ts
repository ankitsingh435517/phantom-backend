import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "./redisClient";
import type { NextFunction, Request, Response } from "express";

const generalLimiter = rateLimit({
  // Rate limiter configuration
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
});

const loginLimiter = rateLimit({
  // Rate limiter configuration
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: "Too many failed login attempts. Try again in 15 minutes.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
  keyGenerator: (req) => `${req.body.username || "unknown"}:${req.ip}`,
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
});

// auto IP Ban & cool down for failed login attempts (to mitigate bruteforce attacks)
const LOGIN_ATTEMPT_KEY = "login_attempts";
const IP_BAN_KEY = "banned_ips";

const MAX_ATTEMPTS = 5;
const ATTEMPT_DURATION = 10 * 60; // 10 minutes (seconds)
const BAN_DURATION = 30 * 60; // 30 minutes (seconds)

async function checkIPBan(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
  const isBanned = await redisClient.exists(`${IP_BAN_KEY}:${ip}`);
  if (isBanned) {
    return res
      .status(403)
      .json({ message: "Too many failed attempts. Try again later." });
  }
  next();
}

async function banIP(loginStatus: "SUCCESS" | "FAILED", ip: string) {
  if (loginStatus === "FAILED") {
    const attempts = await redisClient.incr(`${LOGIN_ATTEMPT_KEY}:${ip}`);

    if (attempts === 1) {
      // Track attempts
      await redisClient.expire(`${LOGIN_ATTEMPT_KEY}:${ip}`, ATTEMPT_DURATION);
    }

    if (attempts >= MAX_ATTEMPTS) {
      // Ban IP
      await redisClient.set(
        `${IP_BAN_KEY}:${ip}`,
        "banned",
        "EX",
        BAN_DURATION
      );
      return {
        ipBanned: true,
      };
    }

    return {
      ipBanned: false,
    };
  }

  // login success then reset attempts
  await redisClient.del(`${LOGIN_ATTEMPT_KEY}:${ip}`);
  return {
    ipBanned: false,
  };
}

export { generalLimiter, loginLimiter, checkIPBan, banIP };
