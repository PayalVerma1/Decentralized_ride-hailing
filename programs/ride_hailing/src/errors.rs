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

    #[msg("Ride is not available for acceptance")]
    RideNotAvailable,

    #[msg("Driver is not verified")]
    DriverNotVerified,
    
    #[msg("Unauthorized action")]
    Unauthorized,

    #[msg("Driver is already verified")]
    AlreadyVerified,

    #[msg("Invalid gateway token")]
    InvalidGatewayToken,
}
