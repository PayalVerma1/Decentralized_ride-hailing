use anchor_lang::prelude::*;
use crate::state::ride::Ride;
#[derive(Accounts)]
pub struct RequestRide<'info>{
   #[account(
       init,
       payer=rider,
       space=Ride::LEN,
       seeds=[b"ride", rider.key().as_ref(), Clock::get()?.unix_timestamp.to_le_bytes().as_ref()],
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
    pub fn request(&mut self,rider:String,source:String,destination:String,amount:u64)->Result<()>{
        require!(amount>0 ,CustomError::InvalidAmount);
        let cpi_accounts= Transfer{
            from:self.rider_token_account.to_account_info(),
            to:self.vault.to_account_info(),
            authority:self.rider.to_account_info(),
        };
        token::transfer(CpiContext::new(self.token_program.to_account_info(cpi_accou)))
        let ride=&mut self.ride;
        let ride_request=&mut self.ride_request;
        ride_request.rider= self.rider.key();
        ride_request.driver=Pubkey::default();
        ride_request.amount=amount;
        ride_request.status=RideStatus::Requested;
        ride_request.source=source;
        ride_request.destination=destination;
        ride_request.timestamp=Clock::get()?.unix_timestamp;
        Ok(())
        
    }
}