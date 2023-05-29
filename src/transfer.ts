import {
  createTransferInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import { loadWallet, sendVersionedTx } from "./utils/util";
import { AccountMeta, Connection, PublicKey } from "@solana/web3.js";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { getAsset, getAssetProof } from "./utils/helius";
import * as bs58 from "bs58";
import { env } from "../env-config";

async function transfer() {
  const keypair = loadWallet(env.KEYPAIR_SRC);
  const connection = new Connection(env.SOLANA_RPC);
  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [merkleTree.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const assetId = env.ASSET_ID;
  const res = await getAsset(assetId);
  const proof = await getAssetProof(assetId);
  const proofPathAsAccounts = mapProof(proof);
  const instruction = createTransferInstruction(
    {
      treeAuthority: treeAuthority,
      leafOwner: keypair.publicKey,
      leafDelegate: keypair.publicKey,
      newLeafOwner: new PublicKey(
        "MiCQoU7dk3ddXTNPjFfFwC3YuXNDfZuuqDwd19Cmgpg"
      ),
      merkleTree: merkleTree.publicKey,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      anchorRemainingAccounts: proofPathAsAccounts,
    },
    {
      creatorHash: decode(res.compression.creator_hash),
      dataHash: decode(res.compression.data_hash),
      index: res.compression.leaf_id,
      nonce: res.compression.leaf_id,
      root: decode(proof.root),
    }
  );

  const sx = await sendVersionedTx(
    connection,
    [instruction],
    keypair.publicKey,
    [keypair]
  );
  console.log(sx);
}

function decode(tx: string) {
  return bufferToArray(Buffer.from(bs58.decode(tx)));
}
function bufferToArray(buffer: Buffer): number[] {
  const nums: number[] = [];
  for (let i = 0; i < buffer.length; i++) {
    nums.push(buffer[i]);
  }
  return nums;
}
const mapProof = (assetProof: { proof: string[] }): AccountMeta[] => {
  if (!assetProof.proof || assetProof.proof.length === 0) {
    throw new Error("Proof is empty");
  }
  return assetProof.proof.map((node) => ({
    pubkey: new PublicKey(node),
    isSigner: false,
    isWritable: false,
  }));
};

transfer();
