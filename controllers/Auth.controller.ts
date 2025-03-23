import type { Request, Response } from "express";
import type {
  ILoginUserRequestBody,
  ILoginUserResponse,
} from "../types/requestResponse.types";
import { validationResult } from "express-validator";

class Auth {
  async login(req: Request, res: Response) {
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
        req.body as ILoginUserRequestBody;
        
      // 3. create a jwt token (AuthToken entity) and tie it to this user
      // 4. Set expiry like rotational with access & refresh token flow
      // 5. set the token to the cookie and send the success response
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

export default Auth;
