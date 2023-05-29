import { Keypair, Connection, PublicKey, AccountMeta } from "@solana/web3.js";
import {
  setAndVerifyCollectionStruct,
  setAndVerifyCollectionInstructionDiscriminator,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  verifyCreatorStruct,
  unverifyCollectionStruct,
  unverifyCollectionInstructionDiscriminator,
  createVerifyCreatorInstruction,
  createSetAndVerifyCollectionInstruction,
  createUnverifyCreatorInstruction,
  TokenProgramVersion,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { sendVersionedTx } from "./utils/util";
import { getAsset, getAssetProof } from "./utils/helius";
import * as bs58 from "bs58";
import { env } from "../env-config";
import { loadWallet } from "./utils/util";

async function verifyCreator() {
  const keypair = loadWallet(env.KEYPAIR_SRC);
  const connection = new Connection(env.SOLANA_RPC);
  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [merkleTree.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  const assetId = env.ASSET_ID;
  //Use helius method to get asset and proof
  const res = await getAsset(assetId);
  console.log(res);
  const proof = await getAssetProof(assetId);
  console.log(proof);
  // Map proof to accounts
  const proofPathAsAccounts = mapProof(proof);

  // Verify or unverify a creator that exists in the NFT's creators array. CAN BE USED FOR BOTH.
  const ix = createVerifyCreatorInstruction(
    {
      leafOwner: keypair.publicKey,
      treeAuthority: treeAuthority,
      leafDelegate: keypair.publicKey,
      merkleTree: merkleTree.publicKey,
      payer: keypair.publicKey,
      creator: keypair.publicKey,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      anchorRemainingAccounts: proofPathAsAccounts,
    },
    {
      root: decode(proof.root),
      dataHash: decode(res.compression.data_hash),
      creatorHash: decode(res.compression.creator_hash),
      nonce: res.compression.leaf_id,
      index: res.compression.leaf_id,
      message: {
        name: "Helius Test CNFTs",
        symbol: "HCNFT",
        uri: "https://arweave.net/4Y8b3nIcBMaqevhOycCm-EQ5FNwLZ2YKQ6iK_3H57YM",
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: new PublicKey(
              "H42GRQby3FsqRjJVqGHxnCmkxuMVkp8g3Htv1u27z84i"
            ),
            share: 100,
            verified: true,
          },
        ],
        primarySaleHappened: true,
        isMutable: true,
        editionNonce: null,
        collection: {
          key: new PublicKey("HsH5qTQuSmNwgHd46gENv61RHieUGokFY5FRrFqBgYas"),
          verified: true,
        },
        tokenStandard: null,
        tokenProgramVersion: TokenProgramVersion.Original,
        uses: null,
      },
    },
    BUBBLEGUM_PROGRAM_ID
  );
  const stx = await sendVersionedTx(connection, [ix], keypair.publicKey, [
    keypair,
  ]);
  console.log(stx);
}
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
verifyCreator();
