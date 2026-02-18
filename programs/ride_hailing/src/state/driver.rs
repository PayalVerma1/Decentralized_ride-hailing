use anchor_lang::prelude::*;
#[account]
pub struct Driver{
    pub authority:Pubkey,
    #[max_len(50)]
    pub vehicle_hash:String,
    pub rating:u8,
    pub total_rides:u64,
    pub is_verified:bool,
}
impl Driver {
    pub const LEN: usize = 8 + 32 + 4 + 50 + 1 + 8 + 1;
}