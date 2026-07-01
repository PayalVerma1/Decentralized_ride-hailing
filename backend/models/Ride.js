import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    pickup: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    destination: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    vehicleType: {
      type: String,
      enum: ["economy", "comfort", "premium", "xl"],
      default: "economy",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "driver_arriving",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    fare: {
      estimated: { type: Number, default: 0 },
      actual: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    distance: {
      type: Number, // in km
      default: 0,
    },
    duration: {
      estimated: { type: Number, default: 0 }, // in minutes
      actual: { type: Number, default: 0 },
    },
    payment: {
      method: {
        type: String,
        enum: ["wallet", "card", "cash"],
        default: "wallet",
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
    },
    rating: {
      passengerRating: { type: Number, min: 1, max: 5 },
      driverRating: { type: Number, min: 1, max: 5 },
      passengerReview: String,
      driverReview: String,
    },
    cancelReason: String,
    cancelledBy: {
      type: String,
      enum: ["passenger", "driver", "admin"],
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
    isVerifiedOnChain: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for fast queries
rideSchema.index({ passenger: 1, status: 1 });
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ status: 1, createdAt: -1 });

const Ride = mongoose.model("Ride", rideSchema);
export default Ride;
