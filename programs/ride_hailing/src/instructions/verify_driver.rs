use anchor_lang::prelude::*;
use crate::state::driver::Driver;
use crate::state::admin_state::AdminState;
#[derive(Accounts)]
pub struct VerifyDriver<'info>{
    #[account(
        mut,
        seeds=[b"driver",driver.authority.as_ref()],
        bump=driver.bump,
    )]
    pub driver:Account<'info,Driver>,
    pub authority:Signer<'info>,
    #[account(
        seeds=[b"admin_state"],
        bump=admin.bump,
    )]
    pub admin: Account<'info, AdminState>,

}
impl<'info>VerifyDriver<'info>{
    pub fn verify(&mut self)->Result<()>{
       require!(
            self.authority.key() == self.admin.authority,
            ErrorCode::Unauthorized
        );
       self.driver.is_verified = true;
       self.driver.verified_at = Clock::get()?.unix_timestamp;
       Ok(())
    }
}
#[error_code]
pub enum ErrorCode{
    #[msg("Unauthorized")]
    Unauthorized,           
}