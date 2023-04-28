import dotenv from 'dotenv';
dotenv.config();

export const env = {
  HELIUS_RPC: process.env.HELIUS_RPC_URL || 'undefined',
  SOLANA_RPC: process.env.SOLANA_RPC || 'undefined',
  COLLECTION_MINT: process.env.COLLECTION_MINT || 'undefined',
  COLLECTION_METADATA: process.env.COLLECTION_METADATA || 'undefined',
  NFT_METADATA: process.env.NFT_METADATA || 'undefined',
  MERKLE_TREE_SRC: process.env.MERKLE_TREE_SRC || 'undefined',
  KEYPAIR_SRC: process.env.KEYPAIR_SRC || 'undefined',
  COLLECTION_MINT_WALLET: process.env.COLLECTION_MINT_WALLET || 'undefined',
  COLLECTION_SIZE: parseInt(process.env.COLLECTION_SIZE || '0', 10),
  ASSET_ID: process.env.ASSET_ID || 'undefined',
  INDEX_NFT: parseInt(process.env.INDEX_NFT || '0', 10),
  // add other environment variables you need here
};
