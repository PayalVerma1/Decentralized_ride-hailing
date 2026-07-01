import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import {
  getWallet,
  getTransactions,
  addFunds,
  withdrawFunds,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getRewards,
  claimReward,
} from "../controllers/walletController.js";

const router = Router();

router.use(protect);

router.get("/", getWallet);
router.get("/transactions", getTransactions);
router.post("/add-funds", addFunds);
router.post("/withdraw", withdrawFunds);
router.get("/payment-methods", getPaymentMethods);
router.post("/payment-methods", addPaymentMethod);
router.delete("/payment-methods/:id", removePaymentMethod);
router.get("/rewards", getRewards);
router.post("/rewards/:id/claim", claimReward);

export default router;
