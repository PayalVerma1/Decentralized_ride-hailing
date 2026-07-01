import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    make: {
      type: String,
      required: [true, "Vehicle make is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Vehicle model is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Vehicle year is required"],
    },
    color: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["economy", "comfort", "premium", "xl"],
      default: "economy",
    },
    seats: {
      type: Number,
      default: 4,
      min: 2,
      max: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    photos: [String],
  },
  { timestamps: true },
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
