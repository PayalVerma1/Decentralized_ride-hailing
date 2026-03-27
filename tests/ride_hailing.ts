import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RideHailing } from "../target/types/ride_hailing";

import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
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
    getAccount,
    mintTo,
    TOKEN_PROGRAM_ID,
  } = splToken;

  let rider: Keypair;

  before(async () => {
    rider = Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(rider.publicKey, 2 * LAMPORTS_PER_SOL)
    );
  });

  it("Is initialized!", async () => {
    const [adminPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("admin_state")],
      program.programId
    );

    await program.methods
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
    const initialRiderBalance = 10_000_000;
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
      initialRiderBalance
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

    await program.methods
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
    const riderTokenBalanceAfter = await getAccount(
      connection,
      riderTokenAccount.address
    );
    const vaultTokenBalanceAfter = await getAccount(connection, vaultAccount);

    assert.ok(rideAccount != null);
    assert.equal(rideAccount.rider.toString(), rider.publicKey.toString());
    assert.equal(rideAccount.driver.toString(), PublicKey.default.toString());
    assert.equal(rideAccount.amount.toNumber(), amount.toNumber());
    assert.equal(Object.keys(rideAccount.status)[0], "requested");
    assert.deepEqual(Array.from(rideAccount.sourceHash), Array.from(source));
    assert.deepEqual(
      Array.from(rideAccount.destinationHash),
      Array.from(destination)
    );
    assert.equal(Number(rideAccount.bump) >= 0, true);
    assert.equal(
      Number(riderTokenBalanceAfter.amount),
      initialRiderBalance - amount.toNumber()
    );
    assert.equal(Number(vaultTokenBalanceAfter.amount), amount.toNumber());
  });
  it("accept ride", async () => {
    const driver = Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(driver.publicKey, 2 * LAMPORTS_PER_SOL)
    );

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
    const driverTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      driver.publicKey
    );

    await mintTo(
      connection,
      payer,
      mint,
      riderTokenAccount.address,
      payer,
      10_000_000
    );
    await mintTo(
      connection,
      payer,
      mint,
      driverTokenAccount.address,
      payer,
      5_000_000
    );

    const riderVault = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );
    const driverVault = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    const rideId = new anchor.BN(2);
    const source = new Uint8Array(32).fill(3);
    const destination = new Uint8Array(32).fill(4);
    const amount = new anchor.BN(1_000_000);
    const stakeAmount = new anchor.BN(1_000_000);
    const vehicleHash = new Uint8Array(32).fill(9);

    const [ridePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ride"),
        rider.publicKey.toBuffer(),
        rideId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const [driverPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("driver"), driver.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .registerDriver(stakeAmount, Array.from(vehicleHash))
      .accounts({
        driver: driverPda,
        authority: driver.publicKey,
        driverTokenAccount: driverTokenAccount.address,
        vault: driverVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([driver])
      .rpc();

    await program.methods
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
        vaultB: riderVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([rider])
      .rpc();

    await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driverPda,
        driverAuthority: driver.publicKey,
      } as any)
      .signers([driver])
      .rpc();

    const acceptedRide = await program.account.ride.fetch(ridePda);
    const driverAccount = await program.account.driver.fetch(driverPda);

    assert.equal(acceptedRide.rider.toString(), rider.publicKey.toString());
    assert.equal(acceptedRide.driver.toString(), driver.publicKey.toString());
    assert.equal(Object.keys(acceptedRide.status)[0], "accepted");
    assert.equal(driverAccount.authority.toString(), driver.publicKey.toString());
    assert.equal(driverAccount.totalRides.toNumber(), 1);
  });
});
