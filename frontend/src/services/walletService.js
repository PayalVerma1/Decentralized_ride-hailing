import api from './api'

const walletService = {
  /** Get current user's wallet */
  getWallet: () => api.get('/wallet'),

  /** Get wallet transaction history */
  getTransactions: (params) => api.get('/wallet/transactions', { params }),

  /** Add funds to wallet */
  addFunds: (amount, paymentMethodId) =>
    api.post('/wallet/add-funds', { amount, paymentMethodId }),

  /** Withdraw funds */
  withdrawFunds: (amount, destination) =>
    api.post('/wallet/withdraw', { amount, destination }),

  /** Get saved payment methods */
  getPaymentMethods: () => api.get('/wallet/payment-methods'),

  /** Add a payment method */
  addPaymentMethod: (data) => api.post('/wallet/payment-methods', data),

  /** Remove a payment method */
  removePaymentMethod: (methodId) =>
    api.delete(`/wallet/payment-methods/${methodId}`),

  /** Get rewards info */
  getRewards: () => api.get('/wallet/rewards'),

  /** Claim a reward */
  claimReward: (rewardId) => api.post(`/wallet/rewards/${rewardId}/claim`),
}

export default walletService
