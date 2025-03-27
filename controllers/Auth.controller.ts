import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import type { UserPayload } from "../types/service.types";
import type { UserService, TokenService } from "../services";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../config/dotenv";

class AuthController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  async register(req: Request, res: Response) {
    try {
      // login a user
      // 1. validate the user input
      const result = validationResult(req);
      if (!result.isEmpty()) {
        // validation errors
        const firstError = result.array({ onlyFirstError: true })[0];
        console.log("firstError: ", firstError);
        res.status(400).json({
          success: false,
          message:
            "Some issues logging you in, please try again after some time!",
          error: firstError,
        });
        return;
      }
      // 2. check if user exists or not if not then return with error
      const { firstName, lastName, username, email, password } =
        req.body as UserPayload;

      const doesUserExists = await this.userService.exists(username);

      if (doesUserExists) {
        throw new Error("User with that username already exists");
      }
      // 3. create the user (hash password) and link the user with access & refesh tokens
      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS as string);

      const user = await this.userService.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });

      const yearInMs = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

      // 4. create a jwt token (AuthToken entity)
      const token = await this.tokenService.create({
        userId: user._id,
        expiresAt: new Date(Date.now() + yearInMs),
        deviceInfo: {
          ip: req.body.ip,
          deviceName: req.body.deviceName,
        },
      });

      const accessToken = this.tokenService.generateAccessToken(user._id);
      const refreshToken = this.tokenService.generateRefreshToken(
        user._id,
        token._id
      );

      // 5. Set expiry like rotational with access & refresh token flow

      // 6. set the token to the cookie and send the success response
      res.status(201).json({ success: true, message: "Login successful" });
    } catch (err) {
      res.status(500).json({
        success: false,
        message:
          (err as Error)?.message ||
          "Some issues logging you in, please try again after some time!",
      });
    }
  }
}

export default AuthController;
