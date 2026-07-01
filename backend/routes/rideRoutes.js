import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.js";
import {
  bookRide,
  getFareEstimate,
  getRide,
  getMyRides,
  cancelRide,
  rateRide,
  getRideRequests,
  acceptRide,
  rejectRide,
  startRide,
  completeRide,
  getAllRides,
  getRideAnalytics,
} from "../controllers/rideController.js";

const router = Router();

// All routes require auth
router.use(protect);

// Passenger routes
router.post("/book", authorize("passenger"), bookRide);
router.post("/fare-estimate", getFareEstimate);
router.get("/my-rides", getMyRides);
router.put("/:id/cancel", cancelRide);
router.post("/:id/rate", rateRide);

// Driver routes
router.get("/requests", authorize("driver"), getRideRequests);
router.put("/:id/accept", authorize("driver"), acceptRide);
router.put("/:id/reject", authorize("driver"), rejectRide);
router.put("/:id/start", authorize("driver"), startRide);
router.put("/:id/complete", authorize("driver"), completeRide);

// Admin routes
router.get("/analytics", authorize("admin"), getRideAnalytics);
router.get("/", authorize("admin"), getAllRides);

// Shared
router.get("/:id", getRide);

export default router;
