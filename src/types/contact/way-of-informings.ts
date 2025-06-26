import { Identifiable } from '@/types/base';

export const WayOfInformingsWayEnum = {
    CALL: 0,
    VIBER: 1,
    SMS: 2,
    TELEGRAM: 3,
    WHATSAPP: 4,
    EMAIL: 5
} as const;

export type WayOfInformingsWay =
    (typeof WayOfInformingsWayEnum)[keyof typeof WayOfInformingsWayEnum];

export interface WayOfInformings extends Identifiable {
    way: WayOfInformingsWay;
}
