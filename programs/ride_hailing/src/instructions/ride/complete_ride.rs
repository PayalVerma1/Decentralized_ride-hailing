use anchor_lang::prelude::*;
use crate::state::{Ride, RideStatus};
use crate::errors::CustomError;

#[derive(Accounts)]
#[instruction(ride_id: u64)]
pub struct CompleteRide<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride.driver.as_ref(), &ride_id.to_le_bytes()],
        bump = ride.bump,
        constraint = ride.status == RideStatus::InProgress @ CustomError::RideNotAvailable,
    )]
    pub ride: Account<'info, Ride>,
    #[account(mut)]
    pub driver: Signer<'info>,
}

impl<'info> CompleteRide<'info> {
    pub fn complete(&mut self) -> Result<()> {
        let ride = &mut self.ride;

        require!(self.driver.key() == ride.driver, CustomError::Unauthorized);
        require!(ride.status == RideStatus::InProgress, CustomError::RideNotAvailable);

        ride.status = RideStatus::Completed;

        msg!("Ride {} completed by driver {}", ride.key(), self.driver.key());

        Ok(())
    }
}
