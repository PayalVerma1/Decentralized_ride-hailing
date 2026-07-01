import Wallet from "../models/Wallet.js";

/**
 * @desc    Get wallet
 * @route   GET /api/wallet
 */
export const getWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }
    res.json({ success: true, wallet });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get wallet transactions
 * @route   GET /api/wallet/transactions
 */
export const getTransactions = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.json({ success: true, transactions: [] });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const transactions = wallet.transactions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      transactions,
      total: wallet.transactions.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add funds to wallet
 * @route   POST /api/wallet/add-funds
 */
export const addFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }

    wallet.balance += amount;
    wallet.totalDeposited += amount;
    wallet.transactions.push({
      type: "credit",
      amount,
      description: `Added $${amount} to wallet`,
      status: "completed",
    });
    await wallet.save();

    res.json({ success: true, wallet });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Withdraw funds
 * @route   POST /api/wallet/withdraw
 */
export const withdrawFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet || wallet.balance < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;
    wallet.transactions.push({
      type: "withdrawal",
      amount,
      description: `Withdrew $${amount}`,
      status: "completed",
    });
    await wallet.save();

    res.json({ success: true, wallet });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get payment methods
 * @route   GET /api/wallet/payment-methods
 */
export const getPaymentMethods = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.json({ success: true, methods: wallet?.paymentMethods || [] });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add payment method
 * @route   POST /api/wallet/payment-methods
 */
export const addPaymentMethod = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }

    // If first method, make it default
    if (wallet.paymentMethods.length === 0) {
      req.body.isDefault = true;
    }

    wallet.paymentMethods.push(req.body);
    await wallet.save();

    res.status(201).json({ success: true, methods: wallet.paymentMethods });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove payment method
 * @route   DELETE /api/wallet/payment-methods/:id
 */
export const removePaymentMethod = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    wallet.paymentMethods = wallet.paymentMethods.filter(
      (m) => m._id.toString() !== req.params.id,
    );
    await wallet.save();

    res.json({ success: true, methods: wallet.paymentMethods });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get rewards
 * @route   GET /api/wallet/rewards
 */
export const getRewards = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.json({
      success: true,
      rewards: wallet?.rewards || { points: 0, tier: "bronze" },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Claim reward
 * @route   POST /api/wallet/rewards/:id/claim
 */
export const claimReward = async (req, res, next) => {
  try {
    // Placeholder – would check reward eligibility
    res.json({ success: true, message: "Reward claimed" });
  } catch (error) {
    next(error);
  }
};
