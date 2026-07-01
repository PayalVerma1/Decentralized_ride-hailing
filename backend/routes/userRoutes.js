import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.js";
import {
  getProfile,
  updateProfile,
  getSavedLocations,
  addSavedLocation,
  removeSavedLocation,
  getEmergencyContacts,
  addEmergencyContact,
  updatePreferences,
  getAllUsers,
  getAllDrivers,
  verifyDriver,
  suspendUser,
} from "../controllers/userController.js";

const router = Router();

// All routes require auth
router.use(protect);

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Saved locations
router.get("/locations", getSavedLocations);
router.post("/locations", addSavedLocation);
router.delete("/locations/:id", removeSavedLocation);

// Emergency contacts
router.get("/emergency-contacts", getEmergencyContacts);
router.post("/emergency-contacts", addEmergencyContact);

// Preferences
router.put("/preferences", updatePreferences);

// Admin routes
router.get("/", authorize("admin"), getAllUsers);
router.get("/drivers", authorize("admin"), getAllDrivers);
router.put("/drivers/:id/verify", authorize("admin"), verifyDriver);
router.put("/:id/suspend", authorize("admin"), suspendUser);

export default router;
