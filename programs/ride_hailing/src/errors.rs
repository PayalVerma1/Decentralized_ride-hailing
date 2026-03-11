use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Stake amount is too low")]
    StakeTooLow,

    #[msg("Slash amount exceeds available stake")]
    SlashAmountExceedsStake,

    #[msg("Arithmetic underflow")]
    Underflow,

    #[msg("Invalid amount")]
    InvalidAmount,
}
