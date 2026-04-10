use anchor_lang::prelude::*;
#[account]
pub struct AdminState {
    pub authority: Pubkey,
    pub bump: u8,
}

impl AdminState {
    pub const LEN: usize = 8 + 32 + 1;
}