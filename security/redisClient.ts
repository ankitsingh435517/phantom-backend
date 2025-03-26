import Redis from "ioredis";
import { logger } from "../config";

const redisClient = new Redis(); // Uses default localhost:6379

redisClient.on("connect", () => {
  logger.log("info", "Connected to Redis locally!");
});
redisClient.on("error", (err) => {
  logger.log("error", `Redis error: ${err}`);
});

export default redisClient;
