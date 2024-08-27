import { body } from "express-validator";
import User from "../models/user.model.js";

const checkEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("This email already exists");
  }
};

export const registerValidator = [
  body("fullname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("fullname is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("fullname must be between 3 and 50 characters long")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("fullname must contain only alphabets"),
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(checkEmail)
    .normalizeEmail(),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
    .withMessage(
      "password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

export const loginValidator = [
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),

  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 5 })
    .withMessage("password is to short"),
];
