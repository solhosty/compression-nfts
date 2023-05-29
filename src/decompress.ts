import {
  Keypair,
  Connection,
  PublicKey,
  AccountMeta,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import {
  setAndVerifyCollectionStruct,
  setAndVerifyCollectionInstructionDiscriminator,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  verifyCreatorStruct,
  createRedeemInstruction,
  unverifyCollectionStruct,
  unverifyCollectionInstructionDiscriminator,
  createVerifyCreatorInstruction,
  createDecompressV1Instruction,
  Voucher,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { mapProof, sendVersionedTx } from "./utils/util";
import { getAsset, getAssetProof } from "./utils/helius";
import * as bs58 from "bs58";
import { env } from "../env-config";
import { loadWallet } from "./utils/util";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

async function verifyCreator() {
  const keypair = loadWallet(env.KEYPAIR_SRC);
  const connection = new Connection(env.SOLANA_RPC);
  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [merkleTree.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  const assetId = env.ASSET_ID;

  const res = await getAsset(assetId);
  console.log(res);
  const proof = await getAssetProof(assetId);
  console.log(proof);
  // Map proof to accounts
  const proofPathAsAccounts = mapProof(proof);
  const voucher = Voucher.fromArgs({
    index: 0,
    merkleTree: new PublicKey(merkleTree.publicKey),
    leafSchema: {
      id: res.id,
      owner: keypair.publicKey,
      delegate: merkleTree.publicKey,
      nonce: 2,
      creatorHash: decode(res.compression.creator_hash),
      dataHash: decode(res.compression.data_hash),
      __kind: "V1",
    },
  });
  console.log(voucher);
  const vouchNew = new PublicKey(voucher.merkleTree.toBuffer());
  const reedeemIx = createRedeemInstruction(
    {
      treeAuthority: treeAuthority,
      leafOwner: keypair.publicKey,
      leafDelegate: keypair.publicKey,
      merkleTree: merkleTree.publicKey,
      voucher: vouchNew,
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
  const stx = await sendVersionedTx(
    connection,
    [reedeemIx],
    keypair.publicKey,
    [keypair]
  );
  console.log(stx);
  function decode(tx: string) {
    return bufferToArray(Buffer.from(bs58.decode(tx)));
  }
  // Convert buffer to array of numbers
  function bufferToArray(buffer: Buffer): number[] {
    const nums: number[] = [];
    for (let i = 0; i < buffer.length; i++) {
      nums.push(buffer[i]);
    }
    return nums;
  }
}
verifyCreator();

/*
    const decompressIx = createDecompressV1Instruction(
        {
        leafOwner: keypair.publicKey,
        voucher: keypair.publicKey,
        sysvarRent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        associatedTokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_PROGRAM_ID,
        masterEdition: new PublicKey(env.COLLECTION_MINT),
        mint: new PublicKey(env.COLLECTION_MINT),
        tokenAccount: new PublicKey(env.COLLECTION_MINT),
        metadata: new PublicKey(env.COLLECTION_MINT),
        mintAuthority: keypair.publicKey,

        },
        {
            data:
          }
    )
    */
