/// <reference types="node" />
import { Creator, MetadataArgs } from './generated';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
export * from './generated';
export declare function getLeafAssetId(tree: PublicKey, leafIndex: BN): Promise<PublicKey>;
export declare function computeDataHash(metadata: MetadataArgs): Buffer;
export declare function computeCreatorHash(creators: Creator[]): Buffer;
export declare function computeCompressedNFTHash(assetId: PublicKey, owner: PublicKey, delegate: PublicKey, treeNonce: BN, metadata: MetadataArgs): Buffer;
