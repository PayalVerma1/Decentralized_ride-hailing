use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::admin_state::AdminState;
use crate::state::driver::Driver;
use crate::errors::CustomError;

#[derive(Accounts)]
pub struct SlashDriver<'info> {
    #[account(
        mut,
        seeds = [b"driver", driver.authority.as_ref()],
        bump = driver.bump,
    )]
    pub driver: Account<'info, Driver>,

    pub authority: Signer<'info>,

    #[account(
        seeds = [b"admin_state"],
        bump = admin.bump,
    )]
    pub admin: Account<'info, AdminState>,

    /// CHECK: This PDA is only used as the signing authority for the driver's vault.
    /// Its address is derived from fixed seeds and is not otherwise read or written.
    #[account(
        seeds = [b"vault_authority", driver.authority.as_ref()],
        bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"vault", driver.authority.as_ref()],
        bump,
        token::authority = vault_authority,
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = treasury_token_account.owner == admin.authority @ CustomError::Unauthorized,
        constraint = treasury_token_account.mint == vault.mint @ CustomError::Unauthorized,
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl<'info> SlashDriver<'info> {
    pub fn slash(&mut self, slash_amount: u64, vault_authority_bump: u8) -> Result<()> {
        require!(
            self.authority.key() == self.admin.authority,
            CustomError::Unauthorized
        );
        require!(slash_amount > 0, CustomError::InvalidAmount);
        require!(slash_amount <= self.driver.stake_amount, CustomError::SlashAmountExceedsStake);

        let signer_seeds: &[&[&[u8]]] = &[&[
            b"vault_authority",
            self.driver.authority.as_ref(),
            &[vault_authority_bump],
        ]];

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.treasury_token_account.to_account_info(),
            authority: self.vault_authority.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();
        token::transfer(
            CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
            slash_amount,
        )?;

        self.driver.stake_amount = self
            .driver
            .stake_amount
            .checked_sub(slash_amount)
            .ok_or(CustomError::Underflow)?;

        Ok(())
    }
}
