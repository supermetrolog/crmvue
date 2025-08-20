import { BooleanNumber, Identifiable, SoftDelete, Timestamps } from '@/types/base';
import { User } from '@/types/user';
import { Phone } from '@/types/contact/phone';
import { Email } from '@/types/contact/email';
import { WayOfInformings } from '@/types/contact/way-of-informings';
import { Website } from '@/types/contact/website';
import { Call } from '@/types/call';
import { LetterContact } from '@/types/letter/letter';

export const ContactPassiveWhyEnum = {
    NOT_ACTUAL: 0,
    NOT_WORKING_IN_COMPANY: 1,
    BLOCKED: 2,
    OTHER: 3,
    COMPANY_DISABLED: 4,
    NOT_EXISTS: 5
} as const;

export const ContactPassiveWhyLabel = {
    [ContactPassiveWhyEnum.NOT_ACTUAL]: 'Телефоны не актуальны',
    [ContactPassiveWhyEnum.NOT_WORKING_IN_COMPANY]: 'Не работает в компании',
    [ContactPassiveWhyEnum.BLOCKED]: 'Заблокировано модератором',
    [ContactPassiveWhyEnum.OTHER]: 'Другое',
    [ContactPassiveWhyEnum.COMPANY_DISABLED]: 'Компания архивирована',
    [ContactPassiveWhyEnum.NOT_EXISTS]: 'Номер не существует'
};

export type ContactPassiveWhy = (typeof ContactPassiveWhyEnum)[keyof typeof ContactPassiveWhyEnum];

export const ContactTypeEnum = {
    PERSONAL: 0,
    GENERAL: 1
} as const;

export type ContactType = (typeof ContactTypeEnum)[keyof typeof ContactTypeEnum];

export interface ContactPosition extends Identifiable, Timestamps, SoftDelete {
    slug: string;
    name: string;
    short_name: string | null;
    description: string | null;
    color: string | null;
    icon: string | null;
    sort_order: number | null;
    is_active: boolean;
    created_by_id: number | null;
}

export const ContactStatusEnum = {
    PASSIVE: 0,
    ACTIVE: 1
} as const;

export type ContactStatus = (typeof ContactStatusEnum)[keyof typeof ContactStatusEnum];

export interface Contact extends Identifiable, Timestamps {
    company_id: number;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    full_name: string;
    type: ContactType;
    consultant_id: number | null;
    consultant?: User | null;
    position_id: number | null;
    faceToFaceMeeting: BooleanNumber | null;
    warning: BooleanNumber | null;
    good: BooleanNumber | null;
    status: ContactStatus;
    passive_why: ContactPassiveWhy | null;
    passive_why_comment: string | null;
    warning_why_comment: string | null;
    position_unknown: BooleanNumber;
    isMain: BooleanNumber | null;
    emails: Email[];
    phones: Phone[];
    wayOfInformings: WayOfInformings[];
    websites: Website[];
    calls?: Call[];
    letters?: LetterContact[];
}
