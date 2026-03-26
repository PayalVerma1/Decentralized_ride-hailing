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
  const program =  anchor.workspace.RideHailing as Program<RideHailing>;
 
  let rider: Keypair;
  let driver: Keypair;
  let ridepda: PublicKey;

  before(async()=>{
    rider=Keypair.generate();
    driver=Keypair.generate();
    await provider.connection.requestAirdrop(rider.publicKey,2*LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(driver.publicKey,2*LAMPORTS_PER_SOL);
    [ridepda] = PublicKey.findProgramAddressSync(
    [Buffer.from("ride"),rider.publicKey.toBuffer()],
    program.programId,
  )
  });
 

 it("Is initialized!", async () => {
    const [adminPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("admin_state")],
      program.programId,
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        admin: adminPda,
        adminAuthority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    assert.ok(tx);
 });
 });