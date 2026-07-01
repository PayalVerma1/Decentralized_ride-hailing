import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    totalDeposited: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["credit", "debit", "refund", "reward", "withdrawal"],
        },
        amount: Number,
        description: String,
        rideId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ride",
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "completed",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    paymentMethods: [
      {
        type: { type: String, enum: ["card", "bank"] },
        last4: String,
        brand: String,
        expiryMonth: Number,
        expiryYear: Number,
        isDefault: { type: Boolean, default: false },
      },
    ],
    rewards: {
      points: { type: Number, default: 0 },
      tier: {
        type: String,
        enum: ["bronze", "silver", "gold", "platinum"],
        default: "bronze",
      },
      totalEarned: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
