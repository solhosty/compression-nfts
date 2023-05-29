import {
  createCreateTreeInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import { env } from "../env-config";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { loadWallet, sendVersionedTx } from "./utils/util";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ValidDepthSizePair,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";
import { SYSTEM_PROGRAM_ID } from "@raydium-io/raydium-sdk";

async function createMerkle() {
  const keypair = loadWallet(env.KEYPAIR_SRC);
  const connection = new Connection(env.SOLANA_RPC);
  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [merkleTree.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  const depthSizePair: ValidDepthSizePair = {
    maxDepth: 14,
    maxBufferSize: 64,
  };
  const space = getConcurrentMerkleTreeAccountSize(
    depthSizePair.maxDepth,
    depthSizePair.maxBufferSize
  );
  const createAccountIx = SystemProgram.createAccount({
    newAccountPubkey: merkleTree.publicKey,
    fromPubkey: keypair.publicKey,
    space: space,
    lamports: await connection.getMinimumBalanceForRentExemption(space),
    programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  });
  const ix = createCreateTreeInstruction(
    {
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      treeCreator: keypair.publicKey,
      treeAuthority: treeAuthority,
      systemProgram: SYSTEM_PROGRAM_ID,
      merkleTree: merkleTree.publicKey,
      payer: keypair.publicKey,
    },
    {
      maxDepth: depthSizePair.maxDepth,
      maxBufferSize: depthSizePair.maxBufferSize,
      public: false,
    }
  );
  const stx = await sendVersionedTx(
    connection,
    [createAccountIx, ix],
    keypair.publicKey,
    [keypair, merkleTree]
  );
  console.log(stx);
}

createMerkle();
