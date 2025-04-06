import { createClient } from "redis";
import logger from "./logger";
import { REDIS_ENDPOINT_URI } from "./dotenv";

const client = createClient({
  url: REDIS_ENDPOINT_URI,
});

client.on("error", (err) => logger.error("Redis Client Error", err));

client
  .connect()
  .then(() => logger.info("Redis Client Connected"))
  .catch((err) => logger.error("Error while connecting to redis", err));

export default client;