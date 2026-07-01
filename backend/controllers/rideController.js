import Ride from "../models/Ride.js";
import Driver from "../models/Driver.js";
import Wallet from "../models/Wallet.js";
import Notification from "../models/Notification.js";
import blockchainService from "../services/blockchainService.js";

/**
 * @desc    Book a new ride
 * @route   POST /api/rides/book
 */
export const bookRide = async (req, res, next) => {
  try {
    const { pickup, destination, vehicleType, paymentMethod } = req.body;

    // Calculate estimated fare (simplified)
    const baseFare = { economy: 2.5, comfort: 3.5, premium: 5, xl: 4 };
    const perKm = { economy: 1.2, comfort: 1.7, premium: 2.5, xl: 2 };
    const type = vehicleType || "economy";

    // Rough distance estimate (would use Google Maps API in production)
    const distance =
      Math.abs(pickup.latitude - destination.latitude) * 111 +
      Math.abs(pickup.longitude - destination.longitude) * 85;
    const estimatedFare =
      Math.round(
        ((baseFare[type] || 2.5) + distance * (perKm[type] || 1.2)) * 100,
      ) / 100;

    const ride = await Ride.create({
      passenger: req.user._id,
      pickup,
      destination,
      vehicleType: type,
      fare: { estimated: estimatedFare, currency: "USD" },
      distance: Math.round(distance * 10) / 10,
      duration: { estimated: Math.round(distance * 2.5) },
      payment: { method: paymentMethod || "wallet", status: "pending" },
    });

    // Notify nearby drivers (placeholder – would use socket.io in production)
    await Notification.create({
      user: req.user._id,
      title: "Ride Booked",
      message: `Your ride from ${pickup.address} has been booked. Looking for drivers...`,
      type: "ride_accepted",
      data: { rideId: ride._id },
    });

    res.status(201).json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get fare estimate
 * @route   POST /api/rides/fare-estimate
 */
export const getFareEstimate = async (req, res, next) => {
  try {
    const { pickup, destination, vehicleType } = req.body;

    const baseFare = { economy: 2.5, comfort: 3.5, premium: 5, xl: 4 };
    const perKm = { economy: 1.2, comfort: 1.7, premium: 2.5, xl: 2 };

    const distance =
      Math.abs(pickup.latitude - destination.latitude) * 111 +
      Math.abs(pickup.longitude - destination.longitude) * 85;

    const estimates = Object.keys(baseFare).map((type) => ({
      vehicleType: type,
      fare:
        Math.round(
          (baseFare[type] + distance * perKm[type]) *
            (vehicleType === type ? 1 : 1) *
            100,
        ) / 100,
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(distance * 2.5),
    }));

    res.json({ success: true, estimates });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get ride by ID
 * @route   GET /api/rides/:id
 */
export const getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("passenger", "firstName lastName phone avatar")
      .populate({
        path: "driver",
        populate: { path: "user", select: "firstName lastName phone avatar" },
      })
      .populate("vehicle");

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's rides
 * @route   GET /api/rides/my-rides
 */
export const getMyRides = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { passenger: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [rides, total] = await Promise.all([
      Ride.find(filter)
        .populate("driver")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ride.countDocuments(filter),
    ]);

    res.json({
      success: true,
      rides,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a ride
 * @route   PUT /api/rides/:id/cancel
 */
export const cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    if (["completed", "cancelled"].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: `Ride is already ${ride.status}`,
      });
    }

    ride.status = "cancelled";
    ride.cancelReason = req.body.reason || "No reason provided";
    ride.cancelledBy = req.user.role === "driver" ? "driver" : "passenger";
    await ride.save();

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rate a completed ride
 * @route   POST /api/rides/:id/rate
 */
export const rateRide = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    if (ride.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only rate completed rides",
      });
    }

    if (req.user.role === "passenger") {
      ride.rating.driverRating = rating;
      ride.rating.passengerReview = review;
    } else {
      ride.rating.passengerRating = rating;
      ride.rating.driverReview = review;
    }

    await ride.save();

    // Update driver average rating
    if (req.user.role === "passenger" && ride.driver) {
      const driver = await Driver.findById(ride.driver);
      if (driver) {
        const totalRating = driver.rating * driver.totalRatings + rating;
        driver.totalRatings += 1;
        driver.rating =
          Math.round((totalRating / driver.totalRatings) * 10) / 10;
        await driver.save();
      }
    }

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Driver: Get pending ride requests
 * @route   GET /api/rides/requests
 */
export const getRideRequests = async (req, res, next) => {
  try {
    const requests = await Ride.find({ status: "pending" })
      .populate("passenger", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Driver: Accept a ride
 * @route   PUT /api/rides/:id/accept
 */
export const acceptRide = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver profile not found" });
    }

    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    if (ride.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Ride is no longer available",
      });
    }

    ride.driver = driver._id;
    ride.status = "accepted";
    await ride.save();

    // Notify passenger
    await Notification.create({
      user: ride.passenger,
      title: "Driver Found!",
      message: `${req.user.firstName} is on the way. ETA: ${ride.duration.estimated} min`,
      type: "ride_accepted",
      data: { rideId: ride._id },
    });

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Driver: Start ride
 * @route   PUT /api/rides/:id/start
 */
export const startRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== "accepted") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot start this ride" });
    }

    ride.status = "in_progress";
    await ride.save();

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Driver: Complete ride
 * @route   PUT /api/rides/:id/complete
 */
export const completeRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== "in_progress") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot complete this ride" });
    }

    ride.status = "completed";
    ride.fare.actual = ride.fare.estimated; // Simplified
    ride.payment.status = "completed";
    await ride.save();

    // Store on blockchain (placeholder)
    const blockchainResult =
      await blockchainService.storeRideOnBlockchain(ride);
    ride.blockchainTxHash = blockchainResult.txHash;
    ride.isVerifiedOnChain = blockchainResult.success;
    await ride.save();

    // Update driver stats
    if (ride.driver) {
      const driver = await Driver.findById(ride.driver);
      if (driver) {
        driver.totalRides += 1;
        driver.totalEarnings += ride.fare.actual;
        driver.todayEarnings += ride.fare.actual;
        await driver.save();
      }
    }

    // Notify passenger
    await Notification.create({
      user: ride.passenger,
      title: "Ride Completed",
      message: `Your ride is complete. Fare: $${ride.fare.actual}. Rate your driver!`,
      type: "ride_completed",
      data: { rideId: ride._id },
    });

    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Driver: Reject a ride
 * @route   PUT /api/rides/:id/reject
 */
export const rejectRide = async (req, res, next) => {
  try {
    // Simply return success – the ride stays pending for other drivers
    res.json({ success: true, message: "Ride rejected" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get all rides
 * @route   GET /api/rides
 */
export const getAllRides = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [rides, total] = await Promise.all([
      Ride.find(filter)
        .populate("passenger", "firstName lastName email")
        .populate({
          path: "driver",
          populate: { path: "user", select: "firstName lastName email" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ride.countDocuments(filter),
    ]);

    res.json({
      success: true,
      rides,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get ride analytics
 * @route   GET /api/rides/analytics
 */
export const getRideAnalytics = async (req, res, next) => {
  try {
    const [totalRides, completedRides, cancelledRides, revenueAgg] =
      await Promise.all([
        Ride.countDocuments(),
        Ride.countDocuments({ status: "completed" }),
        Ride.countDocuments({ status: "cancelled" }),
        Ride.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$fare.actual" } } },
        ]),
      ]);

    res.json({
      success: true,
      analytics: {
        totalRides,
        completedRides,
        cancelledRides,
        totalRevenue: revenueAgg[0]?.total || 0,
        completionRate:
          totalRides > 0 ? Math.round((completedRides / totalRides) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
