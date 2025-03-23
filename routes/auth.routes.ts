import express from "express";
import { body } from "express-validator";
import { Auth } from "../controllers";

const router = express.Router();

// init & dep inject (optional)
const authController = new Auth();

router.post(
	"/login",
	body("firstName").notEmpty().trim().isString().isLength({ min: 3 }),
	body("lastName").optional().trim().isString().isLength({ min: 1 }),
	body("username").notEmpty().trim().isString().isLength({ min: 3 }),
	body("email").notEmpty().trim().isString().isEmail(),
	body("password").notEmpty().isString().isLength({ min: 6 }),
	authController.login,
);

export default router;
