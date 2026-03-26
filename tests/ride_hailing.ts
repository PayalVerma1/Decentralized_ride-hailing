import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RideHailing } from "../target/types/ride_hailing";

import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import { assert } from "chai";

describe("ride_hailing", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.RideHailing as Program<RideHailing>;
  const connection = provider.connection;
  const payer = (provider.wallet as any).payer as Keypair;

  // SPL Token imports
  const splToken = require("@solana/spl-token");
  const {
    createMint,
    getOrCreateAssociatedTokenAccount,
    createAccount,
    mintTo,
    TOKEN_PROGRAM_ID,
  } = splToken;

  let rider: Keypair;
  let driver: Keypair;
  let ridepda: PublicKey;

  before(async () => {
    rider = Keypair.generate();
    driver = Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(rider.publicKey, 2 * LAMPORTS_PER_SOL)
    );
    await connection.confirmTransaction(
      await connection.requestAirdrop(driver.publicKey, 2 * LAMPORTS_PER_SOL)
    );
    [ridepda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ride"), rider.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Is initialized!", async () => {
    const [adminPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("admin_state")],
      program.programId
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        admin: adminPda,
        adminAuthority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();
    const adminAccount = await program.account.adminState.fetch(adminPda);
    assert.ok(adminAccount != null);
    assert.equal(
      adminAccount.authority.toString(),
      provider.wallet.publicKey.toString()
    );
  });

  it("create ride", async () => {
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      6 
    );
    const riderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      rider.publicKey
    );
    await mintTo(
      connection,
      payer,
      mint,
      riderTokenAccount.address,
      payer,
      10_000_000 
    );
    const vaultAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey 
    );
    const rideId = new anchor.BN(1);
    const source = new Uint8Array(32).fill(1); 
    const destination = new Uint8Array(32).fill(2); 
    const amount = new anchor.BN(1_000_000); 
    const [ridePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ride"),
        rider.publicKey.toBuffer(),
        rideId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const tx = await program.methods
      .requestRide(
        rideId,
        Array.from(source),
        Array.from(destination),
        amount
      )
      .accounts({
        ride: ridePda,
        rider: rider.publicKey,
        riderTokenAccount: riderTokenAccount.address,
        vaultB: vaultAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([rider])
      .rpc();

    const rideAccount = await program.account.ride.fetch(ridePda);
    assert.ok(rideAccount != null);
    assert.equal(rideAccount.rider.toString(), rider.publicKey.toString());
    assert.equal(rideAccount.amount.toNumber(), amount.toNumber());
    assert.equal(Object.keys(rideAccount.status)[0], "requested");
  });
});