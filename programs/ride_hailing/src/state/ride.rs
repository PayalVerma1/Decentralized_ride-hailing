use anchor_lang::prelude::*;

#[account]
pub struct Ride {
    pub rider: Pubkey,
    pub driver: Pubkey,
    pub amount: u64,
    pub status: RideStatus,
    pub source_hash: [u8; 32],
    pub destination_hash: [u8; 32],
    pub timestamp: i64,
    pub bump: u8,
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum RideStatus {
    Requested,
    InProgress,
    Completed,
    Canceled,
}

impl Ride {
    // discriminator (8) + rider (32) + driver (32) + amount (8) + status (1)
    // + source_hash (32) + destination_hash (32) + timestamp (8) + bump (1)
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1 + 32 + 32 + 8 + 1;
}
