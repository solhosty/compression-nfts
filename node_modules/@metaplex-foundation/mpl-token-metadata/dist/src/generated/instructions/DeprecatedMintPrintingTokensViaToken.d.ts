import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { MintPrintingTokensViaTokenArgs } from '../types/MintPrintingTokensViaTokenArgs';
export type DeprecatedMintPrintingTokensViaTokenInstructionArgs = {
    mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs;
};
export declare const DeprecatedMintPrintingTokensViaTokenStruct: beet.BeetArgsStruct<DeprecatedMintPrintingTokensViaTokenInstructionArgs & {
    instructionDiscriminator: number;
}>;
export type DeprecatedMintPrintingTokensViaTokenInstructionAccounts = {
    destination: web3.PublicKey;
    token: web3.PublicKey;
    oneTimePrintingAuthorizationMint: web3.PublicKey;
    printingMint: web3.PublicKey;
    burnAuthority: web3.PublicKey;
    metadata: web3.PublicKey;
    masterEdition: web3.PublicKey;
    tokenProgram?: web3.PublicKey;
    rent?: web3.PublicKey;
};
export declare const deprecatedMintPrintingTokensViaTokenInstructionDiscriminator = 8;
export declare function createDeprecatedMintPrintingTokensViaTokenInstruction(accounts: DeprecatedMintPrintingTokensViaTokenInstructionAccounts, args: DeprecatedMintPrintingTokensViaTokenInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
