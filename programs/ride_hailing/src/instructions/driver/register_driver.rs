use crate::errors::CustomError;
use crate::state::driver::Driver;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RegisterDriver<'info> {
    #[account(
        init,
        payer = authority,
        space = Driver::LEN,
        seeds = [b"driver", authority.key().as_ref()],
        bump
    )]
    pub driver: Account<'info, Driver>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        constraint = driver_token_account.owner == authority.key() @ CustomError::Unauthorized
    )]
    pub driver_token_account: Account<'info, TokenAccount>,

    #[account(
        constraint = mint.key() == driver_token_account.mint @ CustomError::Unauthorized
    )]
    pub mint: Account<'info, Mint>,

    /// CHECK: This PDA only serves as the token authority for the program-owned vault.
    /// Its address is derived from fixed seeds and it is never read or written directly.
    #[account(
        seeds = [b"vault_authority", authority.key().as_ref()],
        bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [b"vault", authority.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = vault_authority,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> RegisterDriver<'info> {
    pub fn initialize(
        &mut self,
        stake_amount: u64,
        vehicle_hash: [u8; 32],
        bump: u8,
    ) -> Result<()> {
        const MIN_STAKE: u64 = 1_000_000;

        require!(stake_amount >= MIN_STAKE, CustomError::StakeTooLow);

        let cpi_accounts = Transfer {
            from: self.driver_token_account.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), stake_amount)?;

        let driver = &mut self.driver;
        driver.authority = self.authority.key();
        driver.vehicle_hash = vehicle_hash;
        driver.stake_amount = stake_amount;
        driver.ratings = 0;
        driver.total_ratings = 0;
        driver.total_rides = 0;
        driver.is_verified = false;
        driver.civic_id_hash = [0; 32];
        driver.civic_id_verified = false;
        driver.verified_at = 0;
        driver.bump = bump;

        Ok(())
    }
}
