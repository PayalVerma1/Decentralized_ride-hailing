use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;
pub use errors::*;

declare_id!("H7zV5vcQmbnoLib3oUbVSHyhMjKU2BRLSpP9zbFTH4oG");

#[program]
pub mod ride_hailing {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn register_driver(
        ctx: Context<RegisterDriver>,
        stake_amount: u64,
        vehicle_hash: [u8; 32],
    ) -> Result<()> {
        let bump = ctx.bumps.driver;
        ctx.accounts.initialize(stake_amount, vehicle_hash, bump)
    }

    pub fn verify_driver(ctx: Context<VerifyDriver>) -> Result<()> {
        ctx.accounts.verify()
    }

    pub fn slash_driver(ctx: Context<SlashDriver>, slash_amount: u64) -> Result<()> {
        ctx.accounts.slash(slash_amount)
    }

    pub fn request_ride(
        ctx: Context<RequestRide>,
        _ride_id: u64,
        source: [u8; 32],
        destination: [u8; 32],
        amount: u64,
    ) -> Result<()> {
        let bump = ctx.bumps.ride;
        ctx.accounts.request(source, destination, amount, bump)
    }

    pub fn accept_ride(
        ctx: Context<AcceptRide>,
        _ride_id: u64,
    ) -> Result<()> {
        ctx.accounts.accept()
    }

    pub fn start_ride(
        ctx: Context<StartRide>,
        _ride_id: u64,
    ) -> Result<()> {
        ctx.accounts.start()
    }

    pub fn cancel_ride(
        ctx: Context<CancelRide>,
        _ride_id: u64,
    ) -> Result<()> {
        ctx.accounts.cancel()
    }

    pub fn complete_ride(
        ctx: Context<CompleteRide>,
        _ride_id: u64,
    ) -> Result<()> {
        ctx.accounts.complete(_ride_id)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
