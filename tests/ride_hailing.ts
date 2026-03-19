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
import {assert} from "chai";

describe("ride_hailing", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.rideHailing as Program<RideHailing>;

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
  it("Create a ride request", async () => {
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const connection = provider.connection;
    const payer = (provider.wallet as any).payer as Keypair;
    
    console.log("Setup: Importing SPL token library...");
    const splToken = require("@solana/spl-token");
    const { createMint, getOrCreateAssociatedTokenAccount, createAccount, mintTo, TOKEN_PROGRAM_ID } = splToken;
    
    console.log("Setup: Creating rider...");
    const rider = Keypair.generate();
    const airdropSig = await connection.requestAirdrop(rider.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSig);
    console.log("Setup: Rider airdrop confirmed");

    console.log("Setup: Creating mint...");
    let mint;
    try {
      mint = await createMint(connection, payer, payer.publicKey, null, 0, undefined, { commitment: "confirmed" });
      console.log("Mint created:", mint.toBase58());
    } catch (e) {
      console.error("Error creating mint:", e);
      throw e;
    }

    console.log("Setup: Creating rider token account...");
    let riderTokenAccount;
    try {
      riderTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, rider.publicKey);
      console.log("Rider token account:", riderTokenAccount.address.toBase58());
    } catch (e) {
      console.error("Error creating rider token account:", e);
      throw e;
    }

    console.log("Setup: Minting tokens to rider...");
    try {
      const mintTx = await mintTo(connection, payer, mint, riderTokenAccount.address, payer, 1_000_000);
      console.log("Mint tx:", mintTx);
    } catch (e) {
      console.error("Error minting tokens:", e);
      throw e;
    }
    console.log("Setup: Rider token account funded");

    const rideId = new anchor.BN(1);
    const source = new Uint8Array(32).fill(1);
    const destination = new Uint8Array(32).fill(2);

    const [ridePda, _bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("ride"), rider.publicKey.toBuffer(), rideId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    console.log("Setup: Creating vault account...");
    const vaultAccount = await createAccount(connection, payer, mint, payer.publicKey);

    const amount = 1000;
    console.log("Calling requestRide...");


    const instruction = await program.methods
      .requestRide(rideId, Array.from(source), Array.from(destination), new anchor.BN(amount))
      .accounts({
        ride: ridePda,
        rider: rider.publicKey,
        riderTokenAccount: riderTokenAccount.address,
        vaultB: vaultAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
      .instruction();

    const tx = new Transaction().add(instruction);
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.sign(payer, rider);

    const txSig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(txSig);

    console.log("Request ride tx:", txSig);

    const rideAccount = await program.account.ride.fetch(ridePda);
    assert.equal(rideAccount.rider.toBase58(), rider.publicKey.toBase58());
    assert.equal(rideAccount.amount.toNumber(), amount);
  
    const statusVariant = Object.keys(rideAccount.status)[0];
    assert.equal(statusVariant, "requested");
    console.log("✅ Ride request created successfully!");
  });
  it("it should process the ride request", async () => {
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const connection = provider.connection;
    })
});
