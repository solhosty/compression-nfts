import * as beet from '@metaplex-foundation/beet';
import { DataV2 } from './DataV2';
export type CreateMetadataAccountArgsV2 = {
    data: DataV2;
    isMutable: boolean;
};
export declare const createMetadataAccountArgsV2Beet: beet.FixableBeetArgsStruct<CreateMetadataAccountArgsV2>;
