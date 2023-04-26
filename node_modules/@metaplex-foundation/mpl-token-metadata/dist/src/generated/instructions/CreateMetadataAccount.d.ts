import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { CreateMetadataAccountArgs } from '../types/CreateMetadataAccountArgs';
export type CreateMetadataAccountInstructionArgs = {
    createMetadataAccountArgs: CreateMetadataAccountArgs;
};
export declare const CreateMetadataAccountStruct: beet.FixableBeetArgsStruct<CreateMetadataAccountInstructionArgs & {
    instructionDiscriminator: number;
}>;
export type CreateMetadataAccountInstructionAccounts = {
    metadata: web3.PublicKey;
    mint: web3.PublicKey;
    mintAuthority: web3.PublicKey;
    payer: web3.PublicKey;
    updateAuthority: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    rent?: web3.PublicKey;
};
export declare const createMetadataAccountInstructionDiscriminator = 0;
export declare function createCreateMetadataAccountInstruction(accounts: CreateMetadataAccountInstructionAccounts, args: CreateMetadataAccountInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
