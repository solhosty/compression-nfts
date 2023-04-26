import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import { SetReservationListArgs } from '../types/SetReservationListArgs';
export type DeprecatedSetReservationListInstructionArgs = {
    setReservationListArgs: SetReservationListArgs;
};
export declare const DeprecatedSetReservationListStruct: beet.FixableBeetArgsStruct<DeprecatedSetReservationListInstructionArgs & {
    instructionDiscriminator: number;
}>;
export type DeprecatedSetReservationListInstructionAccounts = {
    masterEdition: web3.PublicKey;
    reservationList: web3.PublicKey;
    resource: web3.PublicKey;
};
export declare const deprecatedSetReservationListInstructionDiscriminator = 5;
export declare function createDeprecatedSetReservationListInstruction(accounts: DeprecatedSetReservationListInstructionAccounts, args: DeprecatedSetReservationListInstructionArgs, programId?: web3.PublicKey): web3.TransactionInstruction;
