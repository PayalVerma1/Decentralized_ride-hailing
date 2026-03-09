use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::ride::{Ride, RideStatus};
use crate::errors::CustomError;
#[derive(Accounts)]
#[instruction(ride_id: u64)]
pub struct RequestRide<'info>{
   #[account(
       init,
       payer=rider,
       space=Ride::LEN,
       seeds=[b"ride", rider.key().as_ref(), &ride_id.to_le_bytes()],
       bump
   )]
   pub ride:Account<'info,Ride>,

   #[account(mut)]
   pub rider:Signer<'info>,

   #[account(mut)]
   pub rider_token_account:Account<'info,TokenAccount>,

   #[account(mut)]
   pub vault:Account<'info,TokenAccount>,

   pub token_program:Program<'info,Token>,
   pub system_program:Program<'info,System>,


}
impl<'info>RequestRide<'info>{
    pub fn request(&mut self,source:[u8; 32],destination:[u8; 32],amount:u64)->Result<()>{
        require!(amount>0 ,CustomError::InvalidAmount);
       let cpi_accounts = Transfer {
        from: self.rider_token_account.to_account_info(),
        to: self.vault.to_account_info(),
        authority: self.rider.to_account_info(),
    };

    let cpi_program = self.token_program.to_account_info();

    token::transfer(
        CpiContext::new(cpi_program, cpi_accounts),
        amount,
    )?;
        let ride=&mut self.ride;
        ride.rider = self.rider.key();
        ride.driver = Pubkey::default();
        ride.amount = amount;
        ride.status = RideStatus::Requested;
      ride.source_hash = source;
ride.destination_hash = destination;
        ride.timestamp = Clock::get()?.unix_timestamp;
       ride.bump=ride.bumps;
       
        Ok(())
        
    }
}