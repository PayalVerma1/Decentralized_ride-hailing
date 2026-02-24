use anchor_lang::prelude::*;
use crate::state::driver::Driver;
#[derive(Accounts)]
pub struct SlashDriver<'info>{
    #[account(
        mut,
        seeds=[b"driver",driver.authority.as_ref()],
        bump=driver.bump,
    )]
    pub driver:Account<'info,Driver>,

}
impl<'info>SlashDriver<'info>{
    pub fn slash(&mut self,slash_amount:u64)->Result<()>{
        require!(slash_amount <= self.driver.stake_amount, CustomError::SlashAmountExceedsStake);
        self.driver.stake_amount = self.driver.stake_amount.checked_sub(slash_amount).ok_or(CustomError::Underflow)?;
        Ok(())
    }
}