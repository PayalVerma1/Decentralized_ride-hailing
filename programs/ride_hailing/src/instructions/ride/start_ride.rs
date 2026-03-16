use crate::errors::CustomError;
use crate::state::driver::Driver;
use crate::state::ride::{Ride, RideStatus};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(ride_id: u64)]
pub struct StartRide<'info> {
    #[account(
        mut,
        seeds = [b"ride", ride_account.rider.as_ref(), &ride_id.to_le_bytes()],
        bump = ride_account.bump,
        constraint = ride_account.status == RideStatus::Accepted @ CustomError::RideNotAvailable,
    )]
    pub ride_account: Account<'info, Ride>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [b"driver", authority.key().as_ref()],
        bump = driver.bump,
        has_one = authority,
        constraint = driver.is_verified @ CustomError::DriverNotVerified,
    )]
    pub driver: Account<'info, Driver>,
}

impl<'info> StartRide<'info> {
    pub fn start(&mut self) -> Result<()> {
        let ride = &mut self.ride_account;
        require!(
            ride.status==RideStatus::Accepted,
            CustomError::RideNotAvailable
        );
        ride.status = RideStatus::InProgress;
        ride.timestamp = Clock::get()?.unix_timestamp;

        msg!("Ride {} started by {}", ride.key(), self.authority.key());

        Ok(())
    }
}
