import { Router } from "express";
import { body } from "express-validator";
import validate from "../middlewares/validate.js";
import { protect } from "../middlewares/auth.js";
import {
  registerPassenger,
  registerDriver,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";

const router = Router();

// Validation rules
const registerValidation = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post(
  "/register/passenger",
  registerValidation,
  validate,
  registerPassenger,
);

router.post(
  "/register/driver",
  [
    ...registerValidation,
    body("licenseNumber")
      .trim()
      .notEmpty()
      .withMessage("License number is required"),
    body("licenseExpiry")
      .isISO8601()
      .withMessage("Valid license expiry date required"),
  ],
  validate,
  registerDriver,
);

router.post("/login", loginValidation, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
