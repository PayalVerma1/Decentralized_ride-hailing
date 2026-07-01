import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    method: {
      type: String,
      enum: ["wallet", "card", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionRef: {
      type: String,
      default: "",
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
    isVerifiedOnChain: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

paymentSchema.index({ payer: 1, createdAt: -1 });
paymentSchema.index({ ride: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
