use anchor_lang::prelude::*;

use anchor_lang::prelude::*;

#[account]
pub struct Driver {
    pub authority: Pubkey,
    // store a fixed-size hash for the vehicle (32 bytes)
    pub vehicle_hash: [u8; 32],
    pub stake_amount: u64,
    pub ratings: u8,
    pub total_ratings: u64,
    pub total_rides: u64,
    pub is_verified: bool,
    pub bump: u8,
    pub verified_at: i64,
}

impl Driver {
    // sizes: discriminator (8) + Pubkey (32) + vehicle_hash [u8;32] (32)
    // + stake_amount (8) + ratings (1) + total_ratings (8) + total_rides (8)
    // + is_verified (1) + bump (1) + verified_at (8)
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1 + 8 + 8 + 1 + 1 + 8;
}