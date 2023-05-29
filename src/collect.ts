import { Keypair, TransactionMessage, Connection, PublicKey, AccountMeta, AddressLookupTableProgram, VersionedTransaction } from "@solana/web3.js";
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

  createUnverifyCollectionInstruction
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
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
const web3 = require("@solana/web3.js");

/*
  NEEDED INSTRUCTIONS
   - VerifyCreator //on this page 
   https://explorer.solana.com/tx/5EDVjLZzWSGmsyZfVsVMd14N4Xc9YzgTP4mBcfaxKhLwjvEdn8hrVq4jD3n7MEkjAbhfV9WwDYu9yLXpTecZGzj7?cluster=devnet
    - UnverifyCreator // on this page
    https://explorer.solana.com/tx/3DfnW8KySEKVpNyrW3Lcb8vrsQGAkn68XjGb2CW8EsmgVcqTPbi3LU3FFDY3z5b4UMeNdJEV5u2myuJei1Czk5fm?cluster=devnet
    - VerifyCollection // on this page. 
    SendTransactionError: failed to send transaction: encoded solana_sdk::transaction::versioned::VersionedTransaction too large: 1684 bytes (max: encoded/raw 1644/1232)
    - UnverifyCollection // on this page.
    SendTransactionError: failed to send transaction: encoded solana_sdk::transaction::versioned::VersionedTransaction too large: 1684 bytes (max: encoded/raw 1644/1232)
    - SetAndVerifyCollection // on this page. 
    SendTransactionError: failed to send transaction: encoded solana_sdk::transaction::versioned::VersionedTransaction too large: 1684 bytes (max: encoded/raw 1644/1232)
    - DecompressV1 
    
    */

async function verifyCreator() {
  const keypair = loadWallet(env.KEYPAIR_SRC);
  const connection = new Connection(env.SOLANA_RPC);
  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);
  const collectionMint = new PublicKey(env.COLLECTION_MINT);
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
  const [collectionMetadataAccount, _b] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata", "utf8"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  const [bgumSigner, __] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID
  );
  const [collectionEditionAccount, _b2] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata", "utf8"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
      Buffer.from("edition", "utf8"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );




  // Verify or unverify a creator that exists in the NFT's creators array. CAN BE USED FOR BOTH.
  const instructions = [
    createUnverifyCollectionInstruction(
    {
      treeAuthority: treeAuthority,
      leafOwner: keypair.publicKey,
      leafDelegate: keypair.publicKey,
      treeDelegate: keypair.publicKey,
      merkleTree: merkleTree.publicKey,
      payer: keypair.publicKey,
      collectionAuthority: keypair.publicKey,
      collectionMint: collectionMint,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMetadata: collectionMetadataAccount,
      editionAccount: collectionEditionAccount,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      anchorRemainingAccounts: proofPathAsAccounts,
      bubblegumSigner: bgumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      root: decode(proof.root),
      dataHash: decode(res.compression.data_hash),
      creatorHash: decode(res.compression.creator_hash),
      nonce: res.compression.leaf_id,
      index: res.compression.leaf_id,
      message: {
        name: 'Helius Test CNFTs',
        symbol: 'HCNFT',
        uri: 'https://arweave.net/4Y8b3nIcBMaqevhOycCm-EQ5FNwLZ2YKQ6iK_3H57YM',
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: new PublicKey("H42GRQby3FsqRjJVqGHxnCmkxuMVkp8g3Htv1u27z84i"),
            share: 100,
            verified: false
          }
        ],
        primarySaleHappened: true,
        isMutable: true,
        editionNonce: null,
        collection: {key: new PublicKey("TXpiWKLVnBVTCYLrhnyZiuEPDjM1GdWXefdz4a17nyB"), "verified": true},
        tokenStandard: null,
        tokenProgramVersion: TokenProgramVersion.Original,
        uses: null,
      },
      
    },
    
  )
  ];

// get the table from the cluster
  
  let blockhash = await connection.getLatestBlockhash("confirmed");
    const message = new TransactionMessage({
      payerKey: keypair.publicKey,
      recentBlockhash: blockhash.blockhash,
      instructions: instructions,
    }).compileToV0Message();

    const tx = new web3.VersionedTransaction(message);
    tx.sign([keypair]);
    const txid = await web3.sendAndConfirmTransaction(connection, tx)
    console.log(
      `Transaction: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
    );
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

// Verify or unverify an NFT as a member of a Metaplex Certified Collection when the collection is already set in the Metadata.
// Or set a new collection in the metadata and verify the NFT as a member of the new collection.

/*
    const setAndVerify = createSetAndVerifyCollectionInstruction({  //can change args to unverify/verify as well. 
            treeAuthority: treeAuthority,
            leafOwner: keypair.publicKey,
            leafDelegate: keypair.publicKey,
            merkleTree: merkleTree.publicKey,
            payer: keypair,
            treeDelegate: keypair.publicKey,
            collectionAuthority: keypair.publicKey,
            collectionMint: collectionMint,
            collectionMetadata: keypair.publicKey,
            bubblegumSigner: bgumSigner,
            editionAccount: collectionEditionAccount,
            logWrapper: SPL_NOOP_PROGRAM_ID,
            compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        },
        {
            creatorHash: decode(res.compression.creator_hash),
            dataHash: decode(res.compression.data_hash),
            index: res.compression.leaf_id,
            nonce: res.compression.leaf_id,
            root: decode(proof.root),
        } )
    */
