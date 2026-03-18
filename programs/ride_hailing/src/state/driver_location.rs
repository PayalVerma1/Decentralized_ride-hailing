use anchor_lang::prelude::*;
#[account]
pub struct DriverLocation{
    pub driver: Pubkey,
     pub lat: f64,
    pub lng: f64,
    pub timestamp: i64,
}
impl DriverLocation {
    // discriminator (8) + lat (8) + lng (8) + timestamp (8)
    pub const LEN: usize = 8 + 8 + 8 + 8;
}