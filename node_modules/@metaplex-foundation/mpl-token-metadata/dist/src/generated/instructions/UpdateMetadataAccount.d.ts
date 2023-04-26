import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { UpdateMetadataAccountArgs } from '../types/UpdateMetadataAccountArgs';
export type UpdateMetadataAccountInstructionArgs = {
    updateMetadataAccountArgs: UpdateMetadataAccountArgs;
};
export declare const UpdateMetadataAccountStruct: beet.FixableBeetArgsStruct<UpdateMetadataAccountInstructionArgs & {
    instructionDiscriminator: number;
}>;
export type UpdateMetadataAccountInstructionAccounts = {
    metadata: web3.PublicKey;
    updateAuthority: web3.PublicKey;
};
export declare const updateMetadataAccountInstructionDiscriminator = 1;
export declare function createUpdateMetadataAccountInstruction(accounts: UpdateMetadataAccountInstructionAccounts, args: UpdateMetadataAccountInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
