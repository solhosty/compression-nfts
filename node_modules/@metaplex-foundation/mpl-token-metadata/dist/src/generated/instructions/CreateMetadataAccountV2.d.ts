import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { CreateMetadataAccountArgsV2 } from '../types/CreateMetadataAccountArgsV2';
export type CreateMetadataAccountV2InstructionArgs = {
    createMetadataAccountArgsV2: CreateMetadataAccountArgsV2;
};
export declare const CreateMetadataAccountV2Struct: beet.FixableBeetArgsStruct<CreateMetadataAccountV2InstructionArgs & {
    instructionDiscriminator: number;
}>;
export type CreateMetadataAccountV2InstructionAccounts = {
    metadata: web3.PublicKey;
    mint: web3.PublicKey;
    mintAuthority: web3.PublicKey;
    payer: web3.PublicKey;
    updateAuthority: web3.PublicKey;
    systemProgram?: web3.PublicKey;
    rent?: web3.PublicKey;
};
export declare const createMetadataAccountV2InstructionDiscriminator = 16;
export declare function createCreateMetadataAccountV2Instruction(accounts: CreateMetadataAccountV2InstructionAccounts, args: CreateMetadataAccountV2InstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
