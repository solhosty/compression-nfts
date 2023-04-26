import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { MintPrintingTokensViaTokenArgs } from '../types/MintPrintingTokensViaTokenArgs';
export type DeprecatedMintPrintingTokensInstructionArgs = {
    mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs;
};
export declare const DeprecatedMintPrintingTokensStruct: beet.BeetArgsStruct<DeprecatedMintPrintingTokensInstructionArgs & {
    instructionDiscriminator: number;
}>;
export type DeprecatedMintPrintingTokensInstructionAccounts = {
    destination: web3.PublicKey;
    printingMint: web3.PublicKey;
    updateAuthority: web3.PublicKey;
    metadata: web3.PublicKey;
    masterEdition: web3.PublicKey;
    tokenProgram?: web3.PublicKey;
    rent?: web3.PublicKey;
};
export declare const deprecatedMintPrintingTokensInstructionDiscriminator = 9;
export declare function createDeprecatedMintPrintingTokensInstruction(accounts: DeprecatedMintPrintingTokensInstructionAccounts, args: DeprecatedMintPrintingTokensInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
