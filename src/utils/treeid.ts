import {
    Keypair,
    PublicKey,
  } from "@solana/web3.js";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID, } from "@metaplex-foundation/mpl-bubblegum";
import { BN } from "@project-serum/anchor";
import { env } from "../../env-config";
import { loadWallet } from "./util";
export const getCompressedNftId = async (
    treeKeypair: Keypair,
    leafIndex: number
  ) => {
    const node = new BN.BN(leafIndex);
    const [assetId] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("asset", "utf8"),
        treeKeypair.publicKey.toBuffer(),
        Uint8Array.from(node.toArray("le", 8)),
      ],
      BUBBLEGUM_PROGRAM_ID
    );
    return assetId.toString();
  };

async function getId() { 
  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);
  const assetId = getCompressedNftId(merkleTree, env.INDEX_NFT);
  console.log(assetId)
}
getId()