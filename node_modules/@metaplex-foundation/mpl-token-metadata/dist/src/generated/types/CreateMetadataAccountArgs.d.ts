import * as beet from '@metaplex-foundation/beet';
import { Data } from './Data';
export type CreateMetadataAccountArgs = {
    data: Data;
    isMutable: boolean;
};
export declare const createMetadataAccountArgsBeet: beet.FixableBeetArgsStruct<CreateMetadataAccountArgs>;
