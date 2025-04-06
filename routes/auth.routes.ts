import express from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers";
import { UserService, TokenService } from "../services";
import { loginLimiter } from "../config/limitter";

const router = express.Router();

// init & dep inject (optional)
const userService = new UserService();
const tokenService = new TokenService();
const authController = new AuthController(userService, tokenService);

router.post(
	"/register",
	body("firstName").notEmpty().trim().isString().isLength({ min: 3 }),
	body("lastName").optional().trim().isString().isLength({ min: 1 }),
	body("username").notEmpty().trim().isString().isLength({ min: 3 }),
	body("email").notEmpty().trim().isString().isEmail(),
	body("password").notEmpty().isString().isLength({ min: 6 }),
	authController.register,
);

router.post('/login', loginLimiter, () => {});

export default router;
