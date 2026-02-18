use anchor_lang::prelude::*;
#[account]
#[derive(InitSpace)]
pub struct Rider{
    pub authority:Pubkey,
    #[max_len(50)]
    pub name:String,
    pub rating:u8,
}

impl Rider {
    pub const LEN: usize = 8 + 32 + 4 + 50 + 1;
}