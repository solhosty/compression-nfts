import {
  Keypair,
  Signer,
  TransactionInstruction,
  Connection,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
  AccountMeta
} from "@solana/web3.js";

export function loadWallet(kFile: string): Keypair {
  const fs = require("fs");
  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(kFile).toString()))
  );
}
export async function sendVersionedTx(
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  signers: Signer[]
) {
  let latestBlockhash = await connection.getLatestBlockhash();
  const message = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: latestBlockhash.blockhash,
    instructions,
  }).compileToLegacyMessage();
  const transaction = new VersionedTransaction(message);
  transaction.sign(signers);
  const signature = await connection.sendTransaction(transaction);
  return signature;
}

export const mapProof = (assetProof: { proof: string[] }): AccountMeta[] => {
  if (!assetProof.proof || assetProof.proof.length === 0) {
    throw new Error("Proof is empty");
  }
  return assetProof.proof.map((node) => ({
    pubkey: new PublicKey(node),
    isSigner: true,
    isWritable: true,
  }));
};