use anchor_lang::prelude::*;
#[account]
pub struct Ride{
    pub rider:Pubkey,
    pub driver:Pubkey,
    pub amount:u64,
    pub status:RideStatus,
    #[max_len(100)]
    pub source:String,
    #[max_len(100)]
    pub destination:String,
    pub timestamp:i64,

}
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum RideStatus{
    Requested,
    InProgress,
    Completed,
    Canceled,
}

impl Ride {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1 + 4 + 100 + 4 + 100 + 8;
}