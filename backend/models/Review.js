import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ ride: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
