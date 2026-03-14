use crate::errors::CustomError;
use crate::state::ride::{Ride, RideStatus};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(ride_id: u64)]
pub struct CancelRide<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride.rider.as_ref(), &ride_id.to_le_bytes()],
        bump = ride.bump,
        constraint = ride.status == RideStatus::Requested @ CustomError::RideNotAvailable,
    )]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub rider: Signer<'info>,

    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub rider_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl<'info> CancelRide<'info> {
    pub fn cancel(&mut self) -> Result<()> {
        let ride = &mut self.ride;

        require!(self.rider.key() == ride.rider, CustomError::Unauthorized);
        require!(
            ride.status == RideStatus::Requested,
            CustomError::RideNotAvailable
        );

        let amount = ride.amount;
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.rider_token_account.to_account_info(),
            authority: self.vault.to_account_info(),
        };

        let cpi_program = self.token_program.to_account_info();

        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        ride.status = RideStatus::Canceled;

        msg!(
            "Ride {} cancelled by rider {}. Refund of {} tokens released.",
            ride.key(),
            self.rider.key(),
            amount
        );

        Ok(())
    }
}
