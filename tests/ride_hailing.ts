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
    const testRider = Keypair.generate();
    const driver = Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(testRider.publicKey, 5 * LAMPORTS_PER_SOL)
    );
    await connection.confirmTransaction(
      await connection.requestAirdrop(driver.publicKey, 5 * LAMPORTS_PER_SOL)
    );
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey,
      null,
      6
    );

    const createRawTokenAccount = async (
      owner: PublicKey,
      signer: Keypair
    ): Promise<PublicKey> => {
      const tokenAccountKeypair = Keypair.generate();
      const rentExemption = await connection.getMinimumBalanceForRentExemption(165);

      const { createInitializeAccountInstruction } = splToken;

      const createIx = SystemProgram.createAccount({
        fromPubkey: signer.publicKey,
        newAccountPubkey: tokenAccountKeypair.publicKey,
        space: 165,
        lamports: rentExemption,
        programId: TOKEN_PROGRAM_ID,
      });

      const initIx = createInitializeAccountInstruction(
        tokenAccountKeypair.publicKey,
        mint,
        owner,
        TOKEN_PROGRAM_ID
      );

      const tx = new Transaction().add(createIx, initIx);
      tx.feePayer = signer.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.sign(signer, tokenAccountKeypair);

      const sig = await connection.sendRawTransaction(tx.serialize());
      await connection.confirmTransaction(sig);

      return tokenAccountKeypair.publicKey;
    };
    const riderTokenAccount = await createRawTokenAccount(
      testRider.publicKey,
      testRider
    );
    const driverTokenAccount = await createRawTokenAccount(
      driver.publicKey,
      driver
    );
    const riderVaultKeypair = Keypair.generate();
    const driverVaultKeypair = Keypair.generate();
    
    const { createInitializeAccountInstruction } = splToken;
    const rentExemption = await connection.getMinimumBalanceForRentExemption(165);
    let createVaultTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: testRider.publicKey,
        newAccountPubkey: riderVaultKeypair.publicKey,
        space: 165,
        lamports: rentExemption,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeAccountInstruction(
        riderVaultKeypair.publicKey,
        mint,
        testRider.publicKey,
        TOKEN_PROGRAM_ID
      )
    );
    createVaultTx.feePayer = testRider.publicKey;
    createVaultTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    createVaultTx.sign(testRider, riderVaultKeypair);
    const riderVaultSig = await connection.sendRawTransaction(createVaultTx.serialize());
    await connection.confirmTransaction(riderVaultSig);
    createVaultTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: driver.publicKey,
        newAccountPubkey: driverVaultKeypair.publicKey,
        space: 165,
        lamports: rentExemption,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeAccountInstruction(
        driverVaultKeypair.publicKey,
        mint,
        driver.publicKey,
        TOKEN_PROGRAM_ID
      )
    );
    createVaultTx.feePayer = driver.publicKey;
    createVaultTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    createVaultTx.sign(driver, driverVaultKeypair);
    const driverVaultSig = await connection.sendRawTransaction(createVaultTx.serialize());
    await connection.confirmTransaction(driverVaultSig);

    const riderVault = riderVaultKeypair.publicKey;
    const driverVault = driverVaultKeypair.publicKey;
    await mintTo(
      connection,
      payer,
      mint,
      riderTokenAccount,
      payer,
      10_000_000
    );

    await mintTo(
      connection,
      payer,
      mint,
      driverTokenAccount,
      payer,
      5_000_000
    );

    const rideId = new anchor.BN(2);
    const [ridePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ride"),
        testRider.publicKey.toBuffer(),
        rideId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const [driverPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("driver"), driver.publicKey.toBuffer()],
      program.programId
    );

    const vehicleHash = new Uint8Array(32).fill(9);
    const stakeAmount = new anchor.BN(1_000_000);

    await program.methods
      .registerDriver(stakeAmount, Array.from(vehicleHash))
      .accounts({
        driver: driverPda,
        authority: driver.publicKey,
        driverTokenAccount: driverTokenAccount,
        vault: driverVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([driver])
      .rpc();

    console.log("✓ Driver registered");

    const [adminPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("admin_state")],
      program.programId
    );

    await program.methods
      .verifyDriver()
      .accounts({
        driver: driverPda,
        authority: payer.publicKey,
        admin: adminPda,
      } as any)
      .rpc();

    console.log("✓ Driver verified");

    const source = new Uint8Array(32).fill(3);
    const destination = new Uint8Array(32).fill(4);
    const amount = new anchor.BN(1_000_000);

    await program.methods
      .requestRide(
        rideId,
        Array.from(source),
        Array.from(destination),
        amount
      )
      .accounts({
        ride: ridePda,
        rider: testRider.publicKey,
        riderTokenAccount: riderTokenAccount,
        vaultB: riderVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([testRider])
      .rpc();

    console.log("✓ Ride request created");
    await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driverPda,
        driverAuthority: driver.publicKey,
      } as any)
      .signers([driver])
      .rpc();

    console.log("✓ Ride accepted");
    const acceptedRide = await program.account.ride.fetch(ridePda);
    const driverAccount = await program.account.driver.fetch(driverPda);

    assert.equal(
      acceptedRide.rider.toString(),
      testRider.publicKey.toString(),
      "Rider mismatch"
    );
    assert.equal(
      acceptedRide.driver.toString(),
      driver.publicKey.toString(),
      "Driver mismatch"
    );
    assert.equal(
      Object.keys(acceptedRide.status)[0],
      "accepted",
      "Status should be 'accepted'"
    );
    assert.equal(
      driverAccount.authority.toString(),
      driver.publicKey.toString(),
      "Driver authority mismatch"
    );
    assert.equal(
      driverAccount.totalRides.toNumber(),
      1,
      "Total rides should be 1"
    );

    console.log("✓ All assertions passed");
  });
});
