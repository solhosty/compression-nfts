import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  TokenProgramVersion,
  createMintToCollectionV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";
import { env } from "../env-config";
import { Connection, PublicKey } from "@solana/web3.js";
import { loadWallet, sendVersionedTx } from "./utils/util";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
async function createMerkle() {
  const keypair = loadWallet(env.KEYPAIR_SRC);
  const connection = new Connection(env.SOLANA_RPC);
  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);
  const numberOfTransactions = Number(env.COLLECTION_SIZE);
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [merkleTree.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  const collectionMint = new PublicKey(env.COLLECTION_MINT);
  const [collectionMetadataAccount, _b1] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata", "utf8"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
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
  const [bgumSigner, __] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID
  );
  const ix = await createMintToCollectionV1Instruction(
    {
      merkleTree: merkleTree.publicKey,
      treeAuthority: treeAuthority,
      leafOwner: keypair.publicKey,
      leafDelegate: keypair.publicKey,
      payer: keypair.publicKey,
      treeDelegate: keypair.publicKey,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      collectionAuthority: keypair.publicKey,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: collectionMint,
      collectionMetadata: collectionMetadataAccount,
      editionAccount: collectionEditionAccount,
      bubblegumSigner: bgumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: {
        collection: { key: collectionMint, verified: false },
        creators: [],
        isMutable: true,
        name: "Helius Test CNFTs",
        primarySaleHappened: true,
        sellerFeeBasisPoints: 0,
        symbol: "HCNFT",
        uri: env.NFT_METADATA,
        uses: null,
        editionNonce: null,
        tokenStandard: null,
        tokenProgramVersion: TokenProgramVersion.Original,
      },
    }
  );
  for (let i = 0; i < numberOfTransactions; i++) {
    const stx = await sendVersionedTx(connection, [ix], keypair.publicKey, [
      keypair,
    ]);
    console.log(`Transaction ${i} sent: ${stx}`);
  }
}

createMerkle();
