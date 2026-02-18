use anchor_lang::prelude::*;

declare_id!("H7zV5vcQmbnoLib3oUbVSHyhMjKU2BRLSpP9zbFTH4oG");

#[program]
pub mod ride_hailing {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
