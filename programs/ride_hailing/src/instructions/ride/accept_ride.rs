use anchor_lang::prelude::*;
use crate::state::ride::{Ride, RideStatus};
use crate::state::driver::Driver;
use crate::errors::CustomError;

#[derive(Accounts)]
#[instruction(ride_id: u64)]
pub struct AcceptRide<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride.rider.as_ref(), &ride_id.to_le_bytes()],
        bump = ride.bump,
        constraint = ride.status == RideStatus::Requested @ CustomError::RideNotAvailable,
    )]
    pub ride: Account<'info, Ride>,

    #[account(
        seeds = [b"driver", driver_authority.key().as_ref()],
        bump = driver.bump,
        constraint = driver.is_verified @ CustomError::DriverNotVerified,
    )]
    pub driver: Account<'info, Driver>,

    #[account(mut)]
    pub driver_authority: Signer<'info>,
}

impl<'info> AcceptRide<'info> {
    pub fn accept(&mut self) -> Result<()> {
        let ride = &mut self.ride;
        ride.driver = self.driver_authority.key();
        ride.status = RideStatus::InProgress;

        msg!(
            "Ride accepted by driver: {}",
            self.driver_authority.key()
        );

        Ok(())
    }
}
