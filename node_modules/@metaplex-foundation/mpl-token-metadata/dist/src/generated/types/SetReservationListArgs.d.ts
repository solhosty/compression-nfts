import * as beet from '@metaplex-foundation/beet';
import { Reservation } from './Reservation';
export type SetReservationListArgs = {
    reservations: Reservation[];
    totalReservationSpots: beet.COption<beet.bignum>;
    offset: beet.bignum;
    totalSpotOffset: beet.bignum;
};
export declare const setReservationListArgsBeet: beet.FixableBeetArgsStruct<SetReservationListArgs>;
