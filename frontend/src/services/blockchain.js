/**
 * Blockchain Service – Placeholder API Interface
 * =================================================
 * These are CLEAN API SURFACE methods that will later
 * communicate with the blockchain layer built by the team.
 *
 * DO NOT implement blockchain logic here.
 * Only define the interface contracts.
 */

/**
 * Verify a ride on the blockchain.
 * @param {string} rideId - The ride identifier
 * @returns {Promise<{verified: boolean, txHash: string}>}
 */
export async function verifyRide(rideId) {
  // TODO: Connect to blockchain verification endpoint
  console.log(`[Blockchain] verifyRide called for ride: ${rideId}`);
  return { verified: true, txHash: "0x..." };
}

/**
 * Store ride data permanently on the blockchain.
 * @param {object} rideData - Complete ride information
 * @returns {Promise<{success: boolean, txHash: string, blockNumber: number}>}
 */
export async function storeRideOnBlockchain(rideData) {
  // TODO: Connect to blockchain storage endpoint
  console.log("[Blockchain] storeRideOnBlockchain called", rideData);
  return { success: true, txHash: "0x...", blockNumber: 0 };
}

/**
 * Process driver payment via blockchain.
 * @param {string} driverId - Driver wallet/ID
 * @param {number} amount  - Payment amount
 * @param {string} rideId  - Associated ride ID
 * @returns {Promise<{success: boolean, txHash: string}>}
 */
export async function payDriver(driverId, amount, rideId) {
  // TODO: Connect to blockchain payment endpoint
  console.log(
    `[Blockchain] payDriver called: ${driverId}, $${amount}, ride: ${rideId}`,
  );
  return { success: true, txHash: "0x..." };
}

/**
 * Verify a payment transaction on the blockchain.
 * @param {string} txHash - Transaction hash to verify
 * @returns {Promise<{verified: boolean, confirmations: number}>}
 */
export async function verifyPayment(txHash) {
  // TODO: Connect to blockchain payment verification
  console.log(`[Blockchain] verifyPayment called for tx: ${txHash}`);
  return { verified: true, confirmations: 12 };
}

/**
 * Get wallet balance from blockchain.
 * @param {string} walletAddress
 * @returns {Promise<{balance: string, currency: string}>}
 */
export async function getWalletBalance(walletAddress) {
  // TODO: Connect to blockchain wallet balance endpoint
  console.log(`[Blockchain] getWalletBalance called for: ${walletAddress}`);
  return { balance: "0.00", currency: "ETH" };
}

/**
 * Get ride transaction history from blockchain.
 * @param {string} userId
 * @returns {Promise<Array<{txHash: string, amount: number, timestamp: string, type: string}>>}
 */
export async function getBlockchainHistory(userId) {
  // TODO: Connect to blockchain history endpoint
  console.log(`[Blockchain] getBlockchainHistory called for user: ${userId}`);
  return [];
}
