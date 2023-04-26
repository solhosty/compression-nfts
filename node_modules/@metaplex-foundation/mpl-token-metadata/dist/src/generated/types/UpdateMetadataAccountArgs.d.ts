import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { Data } from './Data';
export type UpdateMetadataAccountArgs = {
    data: beet.COption<Data>;
    updateAuthority: beet.COption<web3.PublicKey>;
    primarySaleHappened: beet.COption<boolean>;
};
export declare const updateMetadataAccountArgsBeet: beet.FixableBeetArgsStruct<UpdateMetadataAccountArgs>;
