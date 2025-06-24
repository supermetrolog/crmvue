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
