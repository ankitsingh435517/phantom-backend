import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const APP_ORIGIN = process.env.APP_ORIGIN;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const ROTATION_EXPIRY = process.env.ROTATION_EXPIRY;
const SALT_ROUNDS = process.env.SALT_ROUNDS;

export {
  PORT,
  APP_ORIGIN,
  MONGO_URI,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  ROTATION_EXPIRY,
  SALT_ROUNDS,
};
