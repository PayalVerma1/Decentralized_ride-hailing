import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import {
  createInitializeAccountInstruction,
  createMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import { RideHailing } from "../target/types/ride_hailing";

describe("ride_hailing", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RideHailing as Program<RideHailing>;
  const connection = provider.connection;
  const payer = (provider.wallet as anchor.Wallet).payer as Keypair;

  const divider = (label: string) => {
    console.log(`\n${label}`);
  };

  const logValue = (label: string, value: unknown) => {
    console.log(`${label}:`, value);
  };

  const logPubkey = (label: string, key: PublicKey) => {
    console.log(`${label}: ${key.toBase58()}`);
  };

  const logStatus = (label: string, status: unknown) => {
    console.log(`${label}: ${Object.keys(status as Record<string, unknown>)[0]}`);
  };

  const logTx = (label: string, signature: string) => {
    console.log(`  ${label}: ${signature}`);
  };

  const getAdminPda = () =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("admin_state")],
      program.programId
    )[0];

  const getRidePda = (rider: PublicKey, rideId: anchor.BN) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("ride"),
        rider.toBuffer(),
        rideId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    )[0];

  const getDriverPda = (authority: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("driver"), authority.toBuffer()],
      program.programId
    )[0];

  const getVaultAuthorityPda = (authority: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("vault_authority"), authority.toBuffer()],
      program.programId
    )[0];

  const getDriverVaultPda = (authority: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), authority.toBuffer()],
      program.programId
    )[0];

  const airdrop = async (pubkey: PublicKey, sol = 5) => {
    const sig = await connection.requestAirdrop(pubkey, sol * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig);
    return sig;
  };

  const ensureAdminInitialized = async () => {
    const adminPda = getAdminPda();
    const existing = await connection.getAccountInfo(adminPda);

    if (!existing) {
      const tx = await program.methods
        .initialize()
        .accounts({
          admin: adminPda,
          adminAuthority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
      } as any)
      .rpc();
      logTx("initialize tx", tx);
    }

    return adminPda;
  };

  const createTokenAccount = async (
    mint: PublicKey,
    owner: PublicKey,
    signer: Keypair
  ) => {
    const tokenAccountKeypair = Keypair.generate();
    const rentExemption =
      await connection.getMinimumBalanceForRentExemption(165);

    const tx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: signer.publicKey,
        newAccountPubkey: tokenAccountKeypair.publicKey,
        space: 165,
        lamports: rentExemption,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeAccountInstruction(
        tokenAccountKeypair.publicKey,
        mint,
        owner,
        TOKEN_PROGRAM_ID
      )
    );

    tx.feePayer = signer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.sign(signer, tokenAccountKeypair);

    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(sig);

    return { tokenAccount: tokenAccountKeypair.publicKey, txSig: sig };
  };

  const createMintWithAccounts = async () => {
    const mint = await createMint(connection, payer, payer.publicKey, null, 6);
    return { mint };
  };

  const createFundedUser = async (amount = 2) => {
    const user = Keypair.generate();
    const sig = await airdrop(user.publicKey, amount);
    logPubkey("Funded user", user.publicKey);
    logValue("Airdrop tx", sig);
    return user;
  };

  const createUserTokenAccount = async (
    mint: PublicKey,
    owner: PublicKey,
    amount = 0
  ) => {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      owner
    );

    if (amount > 0) {
      await mintTo(connection, payer, mint, ata.address, payer, amount);
    }

    return ata.address;
  };

  const registerDriver = async (
    driver: Keypair,
    mint: PublicKey,
    stakeAmount = 1_000_000
  ) => {
    const driverPda = getDriverPda(driver.publicKey);
    const vaultAuthorityPda = getVaultAuthorityPda(driver.publicKey);
    const driverVaultPda = getDriverVaultPda(driver.publicKey);
    const driverTokenAccount = await createUserTokenAccount(
      mint,
      driver.publicKey,
      5_000_000
    );
    const vehicleHash = new Uint8Array(32).fill(7);

    const tx = await program.methods
      .registerDriver(new anchor.BN(stakeAmount), Array.from(vehicleHash))
      .accounts({
        driver: driverPda,
        mint,
        authority: driver.publicKey,
        driverTokenAccount,
        vaultAuthority: vaultAuthorityPda,
        vault: driverVaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([driver])
      .rpc();

    return { driverPda, driverVaultPda, driverTokenAccount, tx };
  };

  const verifyDriver = async (driverPda: PublicKey, authority?: Keypair) => {
    const adminPda = await ensureAdminInitialized();

    const tx = await program.methods
      .verifyDriver()
      .accounts({
        driver: driverPda,
        authority: authority?.publicKey ?? provider.wallet.publicKey,
        admin: adminPda,
      } as any)
      .signers(authority ? [authority] : [])
      .rpc();

    return tx;
  };

  const requestRide = async (
    rider: Keypair,
    mint: PublicKey,
    rideId: anchor.BN,
    amount = 1_000_000
  ) => {
    const ridePda = getRidePda(rider.publicKey, rideId);
    const riderTokenAccount = await createUserTokenAccount(
      mint,
      rider.publicKey,
      10_000_000
    );
    const { tokenAccount: vaultB, txSig: vaultCreationTx } = await createTokenAccount(
      mint,
      ridePda,
      rider
    );

    const source = new Uint8Array(32).fill(1);
    const destination = new Uint8Array(32).fill(2);

    const tx = await program.methods
      .requestRide(
        rideId,
        Array.from(source),
        Array.from(destination),
        new anchor.BN(amount)
      )
      .accounts({
        ride: ridePda,
        rider: rider.publicKey,
        riderTokenAccount,
        vaultB,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([rider])
      .rpc();

    return {
      ridePda,
      riderTokenAccount,
      vaultB,
      source,
      destination,
      tx,
      vaultCreationTx,
    };
  };

  const expectAnchorError = async (
    promise: Promise<unknown>,
    expectedFragment: string
  ) => {
    try {
      await promise;
      assert.fail(`Expected error containing "${expectedFragment}"`);
    } catch (error: any) {
      const message = [
        error?.error?.errorCode?.code,
        error?.error?.errorMessage,
        error?.message,
        error?.logs?.join("\n"),
        JSON.stringify(error),
      ]
        .filter(Boolean)
        .join("\n");

      console.log(`Expected failure captured: ${expectedFragment}`);
      assert.include(message, expectedFragment);
    }
  };

  before(async () => {
    await ensureAdminInitialized();
  });

  it("initializes the admin state", async () => {
    divider("Admin initialization");
    const adminPda = await ensureAdminInitialized();
    const adminAccount = await program.account.adminState.fetch(adminPda);
    logPubkey("Admin PDA", adminPda);

    assert.equal(
      adminAccount.authority.toString(),
      provider.wallet.publicKey.toString()
    );
  });

  it("creates a ride and escrows rider funds", async () => {
    divider("Ride request");
    const rider = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(1);

    const {
      ridePda,
      riderTokenAccount,
      vaultB,
      source,
      destination,
      tx,
      vaultCreationTx,
    } =
      await requestRide(rider, mint, rideId);

    const rideAccount = await program.account.ride.fetch(ridePda);
    const riderBalance = await getAccount(connection, riderTokenAccount);
    const vaultBalance = await getAccount(connection, vaultB);

    logValue("Ride id", rideId.toString());
    logTx("vault setup", vaultCreationTx);
    logTx("request ride", tx);
    logStatus("Ride status", rideAccount.status);
    logValue("Escrowed", vaultBalance.amount.toString());

    assert.equal(rideAccount.rider.toString(), rider.publicKey.toString());
    assert.equal(rideAccount.driver.toString(), PublicKey.default.toString());
    assert.equal(rideAccount.amount.toNumber(), 1_000_000);
    assert.equal(Object.keys(rideAccount.status)[0], "requested");
    assert.deepEqual(Array.from(rideAccount.sourceHash), Array.from(source));
    assert.deepEqual(
      Array.from(rideAccount.destinationHash),
      Array.from(destination)
    );
    assert.equal(Number(riderBalance.amount), 9_000_000);
    assert.equal(Number(vaultBalance.amount), 1_000_000);
  });

  it("registers a driver and locks the stake in the vault", async () => {
    divider("Driver registration");
    const driver = await createFundedUser();
    const { mint } = await createMintWithAccounts();

    const { driverPda, driverVaultPda, driverTokenAccount, tx } =
      await registerDriver(driver, mint);

    const driverAccount = await program.account.driver.fetch(driverPda);
    const driverWalletBalance = await getAccount(connection, driverTokenAccount);
    const driverVaultBalance = await getAccount(connection, driverVaultPda);

    logPubkey("Driver PDA", driverPda);
    logTx("register driver", tx);
    logValue("Stake locked", driverVaultBalance.amount.toString());

    assert.equal(driverAccount.authority.toString(), driver.publicKey.toString());
    assert.equal(driverAccount.stakeAmount.toNumber(), 1_000_000);
    assert.equal(driverAccount.isVerified, false);
    assert.equal(Number(driverWalletBalance.amount), 4_000_000);
    assert.equal(Number(driverVaultBalance.amount), 1_000_000);
  });

  it("accepts a requested ride with a verified driver", async () => {
    divider("Ride acceptance");
    const rider = await createFundedUser();
    const driver = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(2);

    const { ridePda } = await requestRide(rider, mint, rideId);
    const { driverPda } = await registerDriver(driver, mint);
    const verifyTx = await verifyDriver(driverPda);

    const acceptTx = await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driverPda,
        authority: driver.publicKey,
      } as any)
      .signers([driver])
      .rpc();

    const acceptedRide = await program.account.ride.fetch(ridePda);
    logValue("Ride id", rideId.toString());
    logTx("verify driver", verifyTx);
    logTx("accept ride", acceptTx);
    logStatus("Ride status", acceptedRide.status);
    assert.equal(acceptedRide.driver.toString(), driver.publicKey.toString());
    assert.equal(Object.keys(acceptedRide.status)[0], "accepted");
  });

  it("starts and completes a ride, paying the driver from escrow", async () => {
    divider("Ride completion");
    const rider = await createFundedUser();
    const driver = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(3);

    const { ridePda, vaultB } = await requestRide(rider, mint, rideId);
    const { driverPda } = await registerDriver(driver, mint);
    const verifyTx = await verifyDriver(driverPda);
    const { tokenAccount: driverTokenAccount, txSig: payoutAccountTx } =
      await createTokenAccount(mint, driver.publicKey, driver);

    const acceptTx = await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driverPda,
        authority: driver.publicKey,
      } as any)
      .signers([driver])
      .rpc();

    const startTx = await program.methods
      .startRide(rideId)
      .accounts({
        rideAccount: ridePda,
        authority: driver.publicKey,
        driver: driverPda,
      } as any)
      .signers([driver])
      .rpc();

    const completeTx = await program.methods
      .completeRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driver.publicKey,
        vaultB,
        driverTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      } as any)
      .signers([driver])
      .rpc();

    const completedRide = await program.account.ride.fetch(ridePda);
    const driverBalance = await getAccount(connection, driverTokenAccount);
    const vaultBalance = await getAccount(connection, vaultB);

    assert.equal(Object.keys(completedRide.status)[0], "completed");
    assert.equal(Number(driverBalance.amount), 1_000_000);
    assert.equal(Number(vaultBalance.amount), 0);
  });

  it("cancels a requested ride and refunds the rider", async () => {
    divider("Ride cancellation");
    const rider = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(4);

    const { ridePda, riderTokenAccount, vaultB } = await requestRide(
      rider,
      mint,
      rideId
    );

    const cancelTx = await program.methods
      .cancelRide(rideId)
      .accounts({
        ride: ridePda,
        rider: rider.publicKey,
        vaultB,
        riderTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      } as any)
      .signers([rider])
      .rpc();

    const canceledRide = await program.account.ride.fetch(ridePda);
    const riderBalance = await getAccount(connection, riderTokenAccount);
    const vaultBalance = await getAccount(connection, vaultB);

    logValue("Ride id", rideId.toString());
    logTx("cancel ride", cancelTx);
    logStatus("Ride status", canceledRide.status);
    logValue("Refunded", riderBalance.amount.toString());

    assert.equal(Object.keys(canceledRide.status)[0], "canceled");
    assert.equal(Number(riderBalance.amount), 10_000_000);
    assert.equal(Number(vaultBalance.amount), 0);
  });

  it("rejects ride requests with zero amount", async () => {
    divider("Ride request rejected: zero amount");
    const rider = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(5);
    const ridePda = getRidePda(rider.publicKey, rideId);
    const riderTokenAccount = await createUserTokenAccount(
      mint,
      rider.publicKey,
      10_000_000
    );
    const vaultB = await createTokenAccount(mint, ridePda, rider);
    logValue("Ride id", rideId.toString());

    await expectAnchorError(
      program.methods
        .requestRide(
          rideId,
          Array.from(new Uint8Array(32).fill(1)),
          Array.from(new Uint8Array(32).fill(2)),
          new anchor.BN(0)
        )
        .accounts({
          ride: ridePda,
          rider: rider.publicKey,
          riderTokenAccount,
          vaultB: vaultB.tokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        } as any)
        .signers([rider])
        .rpc(),
      "InvalidAmount"
    );
  });

  it("rejects ride requests when the token account is not owned by the rider", async () => {
    divider("Ride request rejected: unauthorized token account");
    const rider = await createFundedUser();
    const stranger = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(6);
    const ridePda = getRidePda(rider.publicKey, rideId);
    const strangerTokenAccount = await createUserTokenAccount(
      mint,
      stranger.publicKey,
      10_000_000
    );
    const vaultB = await createTokenAccount(mint, ridePda, rider);
    logValue("Ride id", rideId.toString());

    await expectAnchorError(
      program.methods
        .requestRide(
          rideId,
          Array.from(new Uint8Array(32).fill(1)),
          Array.from(new Uint8Array(32).fill(2)),
          new anchor.BN(1_000_000)
        )
        .accounts({
          ride: ridePda,
          rider: rider.publicKey,
          riderTokenAccount: strangerTokenAccount,
          vaultB: vaultB.tokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        } as any)
        .signers([rider])
        .rpc(),
      "Unauthorized"
    );
  });

  it("rejects driver registration below the minimum stake", async () => {
    divider("Driver registration rejected: low stake");
    const driver = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const driverPda = getDriverPda(driver.publicKey);
    const vaultAuthorityPda = getVaultAuthorityPda(driver.publicKey);
    const driverVaultPda = getDriverVaultPda(driver.publicKey);
    const driverTokenAccount = await createUserTokenAccount(
      mint,
      driver.publicKey,
      5_000_000
    );

    logValue("Attempted stake", "999999");

    await expectAnchorError(
      program.methods
        .registerDriver(new anchor.BN(999_999), Array.from(new Uint8Array(32).fill(4)))
        .accounts({
          driver: driverPda,
          mint,
          authority: driver.publicKey,
          driverTokenAccount,
          vaultAuthority: vaultAuthorityPda,
          vault: driverVaultPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        } as any)
        .signers([driver])
        .rpc(),
      "StakeTooLow"
    );
  });

  it("rejects driver verification from a non-admin authority", async () => {
    divider("Driver verification rejected: non-admin");
    const driver = await createFundedUser();
    const outsider = await createFundedUser();
    const { mint } = await createMintWithAccounts();

    const { driverPda } = await registerDriver(driver, mint);
    logPubkey("Driver PDA", driverPda);

    await expectAnchorError(verifyDriver(driverPda, outsider), "Unauthorized");
  });

  it("rejects accepting a ride with an unverified driver", async () => {
    divider("Ride acceptance rejected: unverified driver");
    const rider = await createFundedUser();
    const driver = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(7);

    const { ridePda } = await requestRide(rider, mint, rideId);
    const { driverPda } = await registerDriver(driver, mint);
    logValue("Ride id", rideId.toString());

    await expectAnchorError(
      program.methods
        .acceptRide(rideId)
        .accounts({
          ride: ridePda,
          driver: driverPda,
          authority: driver.publicKey,
        } as any)
        .signers([driver])
        .rpc(),
      "DriverNotVerified"
    );
  });

  it("rejects accepting a ride that has already been accepted", async () => {
    divider("Ride acceptance rejected: already accepted");
    const rider = await createFundedUser();
    const driverOne = await createFundedUser();
    const driverTwo = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(8);

    const { ridePda } = await requestRide(rider, mint, rideId);
    const { driverPda: driverOnePda } = await registerDriver(driverOne, mint);
    const { driverPda: driverTwoPda } = await registerDriver(driverTwo, mint);
    await verifyDriver(driverOnePda);
    await verifyDriver(driverTwoPda);

    const firstAcceptTx = await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driverOnePda,
        authority: driverOne.publicKey,
      } as any)
      .signers([driverOne])
      .rpc();

    logValue("Ride id", rideId.toString());
    logTx("first accept", firstAcceptTx);

    await expectAnchorError(
      program.methods
        .acceptRide(rideId)
        .accounts({
          ride: ridePda,
          driver: driverTwoPda,
          authority: driverTwo.publicKey,
        } as any)
        .signers([driverTwo])
        .rpc(),
      "RideNotAvailable"
    );
  });

  it("rejects starting a ride from a different driver", async () => {
    divider("Ride start rejected: wrong driver");
    const rider = await createFundedUser();
    const assignedDriver = await createFundedUser();
    const otherDriver = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(9);

    const { ridePda } = await requestRide(rider, mint, rideId);
    const { driverPda: assignedDriverPda } = await registerDriver(
      assignedDriver,
      mint
    );
    const { driverPda: otherDriverPda } = await registerDriver(otherDriver, mint);
    await verifyDriver(assignedDriverPda);
    await verifyDriver(otherDriverPda);

    const acceptTx = await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: assignedDriverPda,
        authority: assignedDriver.publicKey,
      } as any)
      .signers([assignedDriver])
      .rpc();

    await expectAnchorError(
      program.methods
        .startRide(rideId)
        .accounts({
          rideAccount: ridePda,
          authority: otherDriver.publicKey,
          driver: otherDriverPda,
        } as any)
        .signers([otherDriver])
        .rpc(),
      "Unauthorized"
    );
  });

  it("rejects completing a ride before it has started", async () => {
    divider("Ride completion rejected: not in progress");
    const rider = await createFundedUser();
    const driver = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(10);

    const { ridePda, vaultB } = await requestRide(rider, mint, rideId);
    const { driverPda } = await registerDriver(driver, mint);
    await verifyDriver(driverPda);
    const driverTokenAccount = await createUserTokenAccount(mint, driver.publicKey);

    const acceptTx = await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driverPda,
        authority: driver.publicKey,
      } as any)
      .signers([driver])
      .rpc();
    await expectAnchorError(
      program.methods
        .completeRide(rideId)
        .accounts({
          ride: ridePda,
          driver: driver.publicKey,
          vaultB,
          driverTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        } as any)
        .signers([driver])
        .rpc(),
      "RideNotAvailable"
    );
  });

  it("rejects canceling a ride after a driver has accepted it", async () => {
    divider("Ride cancellation rejected: already accepted");
    const rider = await createFundedUser();
    const driver = await createFundedUser();
    const { mint } = await createMintWithAccounts();
    const rideId = new anchor.BN(11);

    const { ridePda, riderTokenAccount, vaultB } = await requestRide(
      rider,
      mint,
      rideId
    );
    const { driverPda } = await registerDriver(driver, mint);
    await verifyDriver(driverPda);

    const acceptTx = await program.methods
      .acceptRide(rideId)
      .accounts({
        ride: ridePda,
        driver: driverPda,
        authority: driver.publicKey,
      } as any)
      .signers([driver])
      .rpc();

    await expectAnchorError(
      program.methods
        .cancelRide(rideId)
        .accounts({
          ride: ridePda,
          rider: rider.publicKey,
          vaultB,
          riderTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        } as any)
        .signers([rider])
        .rpc(),
      "RideNotAvailable"
    );
  });
});
