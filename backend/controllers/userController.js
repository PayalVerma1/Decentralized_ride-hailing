import User from "../models/User.js";
import Driver from "../models/Driver.js";

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["firstName", "lastName", "phone", "avatar"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get saved locations
 * @route   GET /api/users/locations
 */
export const getSavedLocations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("savedLocations");
    res.json({ success: true, locations: user.savedLocations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add saved location
 * @route   POST /api/users/locations
 */
export const addSavedLocation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedLocations.push(req.body);
    await user.save();
    res.status(201).json({ success: true, locations: user.savedLocations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove saved location
 * @route   DELETE /api/users/locations/:id
 */
export const removeSavedLocation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedLocations = user.savedLocations.filter(
      (loc) => loc._id.toString() !== req.params.id,
    );
    await user.save();
    res.json({ success: true, locations: user.savedLocations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get emergency contacts
 * @route   GET /api/users/emergency-contacts
 */
export const getEmergencyContacts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("emergencyContacts");
    res.json({ success: true, contacts: user.emergencyContacts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add emergency contact
 * @route   POST /api/users/emergency-contacts
 */
export const addEmergencyContact = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.emergencyContacts.push(req.body);
    await user.save();
    res.status(201).json({ success: true, contacts: user.emergencyContacts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update preferences
 * @route   PUT /api/users/preferences
 */
export const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.preferences = { ...user.preferences.toObject(), ...req.body };
    await user.save();
    res.json({ success: true, preferences: user.preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get all users
 * @route   GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { lastName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get all drivers
 * @route   GET /api/users/drivers
 */
export const getAllDrivers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.isApproved !== undefined) {
      filter.isApproved = req.query.isApproved === "true";
    }

    const [drivers, total] = await Promise.all([
      Driver.find(filter)
        .populate("user", "firstName lastName email phone avatar")
        .populate("vehicle")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Driver.countDocuments(filter),
    ]);

    res.json({
      success: true,
      drivers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Verify driver
 * @route   PUT /api/users/drivers/:id/verify
 */
export const verifyDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }
    res.json({ success: true, driver });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Suspend user
 * @route   PUT /api/users/:id/suspend
 */
export const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true, suspendReason: req.body.reason || "" },
      { new: true },
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
