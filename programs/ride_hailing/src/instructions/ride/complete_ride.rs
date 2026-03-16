use crate::errors::CustomError;
use crate::state::{Ride, RideStatus};
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(ride_id: u64)]
pub struct CompleteRide<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride.rider.as_ref(), &ride_id.to_le_bytes()],
        bump = ride.bump,
        constraint = ride.status == RideStatus::InProgress @ CustomError::RideNotAvailable,
    )]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub driver: Signer<'info>,
    #[account(
        mut,
        constraint=vault_b.owner==ride.key() @ CustomError::Unauthorized
    )]
    pub vault_b: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint=driver_token_account.owner==driver.key() @ CustomError::Unauthorized,
    )]
    pub driver_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

impl<'info> CompleteRide<'info> {
    pub fn complete(&mut self, ride_id: u64) -> Result<()> {
        let ride = &mut self.ride;

        require!(self.driver.key() == ride.driver, CustomError::Unauthorized);
      
        let amount = ride.amount;
        let cpi_accounts = Transfer {
            from: self.vault_b.to_account_info(),
            to: self.driver_token_account.to_account_info(),
            authority: ride.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();

        let seeds: &[&[u8]] = &[
            b"ride".as_ref(),
            ride.rider.as_ref(),
            &ride_id.to_le_bytes(),
            &[ride.bump],
        ];
        let signer_seeds: &[&[&[u8]]] = &[seeds];

        token::transfer(CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds), amount)?;
        ride.status = RideStatus::Completed;
        msg!(
            "Ride {} completed by driver {}",
            ride.key(),
            self.driver.key()
        );

        Ok(())
    }
}
