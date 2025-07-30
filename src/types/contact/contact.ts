import { BooleanNumber, Identifiable, Timestamps } from '@/types/base';
import { User } from '@/types/user';
import { Phone } from '@/types/contact/phone';
import { Email } from '@/types/contact/email';
import { WayOfInformings } from '@/types/contact/way-of-informings';
import { Website } from '@/types/contact/website';
import { Call } from '@/types/call';

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

export const ContactPositionEnum = {
    SHAREHOLDER: 0,
    CEO: 1,
    COMMERCIAL_DIRECTOR: 2,
    CFO: 3,
    COO: 4,
    MANAGING_DIRECTOR: 5,
    LOGISTICS_DIRECTOR: 6,
    WAREHOUSE_MANAGER: 7,
    PROJECT_MANAGER: 8,
    SECURITY: 9,
    CHIEF_ENGINEER: 10,
    SECRETARY: 11,
    MANAGEMENT_COMPANY_REP: 12,
    ONSITE_REP: 13,
    ACCOUNTANT: 14,
    LAWYER: 15,
    AGENT: 16
} as const;

export type ContactPosition = (typeof ContactPositionEnum)[keyof typeof ContactPositionEnum];

export const ContactPositionLabels: Record<ContactPosition, string> = {
    [ContactPositionEnum.SHAREHOLDER]: 'Акционер',
    [ContactPositionEnum.CEO]: 'Генеральный директор',
    [ContactPositionEnum.COMMERCIAL_DIRECTOR]: 'Коммерческий директор',
    [ContactPositionEnum.CFO]: 'Финансовый директор',
    [ContactPositionEnum.COO]: 'Операционный директор',
    [ContactPositionEnum.MANAGING_DIRECTOR]: 'Управляющий директор',
    [ContactPositionEnum.LOGISTICS_DIRECTOR]: 'Директор по логистике',
    [ContactPositionEnum.WAREHOUSE_MANAGER]: 'Начальник склада',
    [ContactPositionEnum.PROJECT_MANAGER]: 'Менеджер по проектам',
    [ContactPositionEnum.SECURITY]: 'Охранник',
    [ContactPositionEnum.CHIEF_ENGINEER]: 'Главный инженер',
    [ContactPositionEnum.SECRETARY]: 'Секретарь',
    [ContactPositionEnum.MANAGEMENT_COMPANY_REP]: 'Представитель управляющей компании',
    [ContactPositionEnum.ONSITE_REP]: 'Представитель на объекте',
    [ContactPositionEnum.ACCOUNTANT]: 'Бухгалтер',
    [ContactPositionEnum.LAWYER]: 'Юрист',
    [ContactPositionEnum.AGENT]: 'Агент'
} as const;

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
    position: ContactPosition | null;
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
}
