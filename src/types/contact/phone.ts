import { BooleanNumber, Identifiable, SoftDelete, Timestamps } from '@/types/base';

export const PhoneCountryCodeEnum = {
    RU: 'RU',
    BY: 'BY',
    UA: 'UA'
} as const;

export type PhoneCountryCode = (typeof PhoneCountryCodeEnum)[keyof typeof PhoneCountryCodeEnum];

export const PhoneTypeEnum = {
    MOBILE: 'mobile',
    HOME: 'home',
    WORK: 'work',
    WHATSAPP: 'whatsapp'
} as const;

export type PhoneType = (typeof PhoneTypeEnum)[keyof typeof PhoneTypeEnum];

export const PhoneTypeLabel = {
    [PhoneTypeEnum.MOBILE]: 'Мобильный',
    [PhoneTypeEnum.WORK]: 'Рабочий',
    [PhoneTypeEnum.HOME]: 'Домашний',
    [PhoneTypeEnum.WHATSAPP]: 'WhatsApp'
};

export const PhoneStatusEnum = {
    ACTIVE: 'active',
    PASSIVE: 'passive'
} as const;

export type PhoneStatus = (typeof PhoneStatusEnum)[keyof typeof PhoneStatusEnum];

export interface Phone extends Identifiable, Timestamps, SoftDelete {
    native_phone?: string;
    phone: string;
    tel?: string;
    exten: string | null;
    isMain: BooleanNumber | null;
    contact_id?: number;
    country_code: PhoneCountryCode;
    type: PhoneType;
    comment: string | null;
    status?: PhoneStatus;
}
