import { Identifiable } from '@/types/base';
import { User } from '@/types/user';

export const CompanyPassiveWhyEnum = {
    SUSPENDED: 0,
    BLOCKED: 1,
    OTHER: 2,
    DESTROYED: 3,
    INCORRECT: 4
} as const;

export const CompanyPassiveWhyLabel = {
    [CompanyPassiveWhyEnum.SUSPENDED]: 'Временно приостановлена',
    [CompanyPassiveWhyEnum.BLOCKED]: 'Заблокировано модератором',
    [CompanyPassiveWhyEnum.OTHER]: 'Иное',
    [CompanyPassiveWhyEnum.DESTROYED]: 'Компания ликвидирована',
    [CompanyPassiveWhyEnum.INCORRECT]: 'Идентификация невозможна'
};

export const CompanyPassiveWhyLabelShort = {
    [CompanyPassiveWhyEnum.SUSPENDED]: 'Приостановлена',
    [CompanyPassiveWhyEnum.BLOCKED]: 'Заблокирована',
    [CompanyPassiveWhyEnum.OTHER]: 'Иное',
    [CompanyPassiveWhyEnum.DESTROYED]: 'Ликвидирована',
    [CompanyPassiveWhyEnum.INCORRECT]: 'Не заполнено'
};

export type CompanyPassiveWhy = (typeof CompanyPassiveWhyEnum)[keyof typeof CompanyPassiveWhyEnum];

export const CompanyStatusEnum = {
    ACTIVE: 1,
    PASSIVE: 0,
    DELETED: 2
} as const;

export const CompanyStatusLabel = {
    [CompanyStatusEnum.PASSIVE]: 'Приостановлена',
    [CompanyStatusEnum.ACTIVE]: 'Актив',
    [CompanyStatusEnum.DELETED]: 'Удалена'
};

export type CompanyStatus = (typeof CompanyStatusEnum)[keyof typeof CompanyStatusEnum];

export const CompanyStatusSourceEnum = {
    USER: 'user',
    SYSTEM: 'system'
} as const;

export type CompanyStatusSource =
    (typeof CompanyStatusSourceEnum)[keyof typeof CompanyStatusSourceEnum];

export const CompanyStatusReasonEnum = {
    SUSPENDED: 'suspended',
    BLOCKED: 'blocked',
    DESTROYED: 'destroyed',
    INCORRECT: 'incorrect',
    OTHER: 'other',
    NO_CONTACTS: 'no-contacts'
} as const;

export type CompanyStatusReason =
    (typeof CompanyStatusReasonEnum)[keyof typeof CompanyStatusReasonEnum];

export const CompanyStatusReasonLabel = {
    [CompanyStatusReasonEnum.SUSPENDED]: 'Временно приостановлено',
    [CompanyStatusReasonEnum.BLOCKED]: 'Заблокировано модератором',
    [CompanyStatusReasonEnum.OTHER]: 'Иное',
    [CompanyStatusReasonEnum.DESTROYED]: 'Компания ликвидирована',
    [CompanyStatusReasonEnum.INCORRECT]: 'Идентификация невозможна',
    [CompanyStatusReasonEnum.NO_CONTACTS]: 'Нет активных контактов'
};

export interface CompanyStatusHistory extends Identifiable {
    company_id: number;
    status: CompanyStatus;
    reason: CompanyStatusReason | null;
    comment: string | null;
    changed_by_id: number | null;
    changed_by_source: CompanyStatusSource;
    changed_by: User | null;
    created_at: string;
}
