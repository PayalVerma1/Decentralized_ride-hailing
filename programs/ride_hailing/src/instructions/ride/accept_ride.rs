use anchor_lang::prelude::*;
use crate::errors::CustomError;
use crate::state::driver::Driver;
use crate::state::ride::{Ride, RideStatus};

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
        mut,
        seeds = [b"driver", authority.key().as_ref()],
        bump = driver.bump,
        has_one = authority,
        constraint = driver.is_verified @ CustomError::DriverNotVerified,
    )]
    pub driver: Account<'info, Driver>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

impl<'info> AcceptRide<'info> {
    pub fn accept(&mut self) -> Result<()> {
        let ride = &mut self.ride;
        ride.driver = self.authority.key();
        ride.status = RideStatus::Accepted;
        ride.timestamp = Clock::get()?.unix_timestamp;

        msg!("Ride accepted by driver: {}", self.authority.key());

        Ok(())
    }
}
