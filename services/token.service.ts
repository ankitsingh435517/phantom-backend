import jwt from "jsonwebtoken";
import type { StringValue } from "../types/service.types";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config/dotenv";
import type { ID } from "../types/mongoose.types";
import RefreshTokenModel from "../models/RefreshToken.model";

class TokenService {
  generateAccessToken(userId: ID) {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET as string, {
      expiresIn: ACCESS_TOKEN_EXPIRY as StringValue,
    });
  }

  generateRefreshToken(userId: ID, tokenId: ID) {
    return jwt.sign({ userId, tokenId }, REFRESH_TOKEN_SECRET as string, {
      expiresIn: REFRESH_TOKEN_EXPIRY as StringValue,
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET as string);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET as string);
  }

  async create({
    userId,
    expiresAt,
    deviceInfo,
  }: {
    userId: ID;
    expiresAt: Date;
    deviceInfo: { ip: string; deviceName: string };
  }) {
    return RefreshTokenModel.create({ userId, expiresAt, deviceInfo });
  }
}

export default TokenService;
