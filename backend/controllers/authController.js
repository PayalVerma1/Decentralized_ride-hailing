import User from "../models/User.js";
import Driver from "../models/Driver.js";
import Wallet from "../models/Wallet.js";

/**
 * @desc    Register a new passenger
 * @route   POST /api/auth/register/passenger
 */
export const registerPassenger = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: "passenger",
    });

    // Create wallet
    await Wallet.create({ user: user._id });

    // Generate token
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new driver
 * @route   POST /api/auth/register/driver
 */
export const registerDriver = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      licenseNumber,
      licenseExpiry,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehiclePlate,
      vehicleType,
    } = req.body;

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user with driver role
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: "driver",
    });

    // Create driver profile
    const driver = await Driver.create({
      user: user._id,
      licenseNumber,
      licenseExpiry,
    });

    // Create wallet
    await Wallet.create({ user: user._id });

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: "Driver registration successful – pending approval",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        driverId: driver._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "Account has been suspended",
      });
    }

    const token = user.generateToken();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 */
export const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
