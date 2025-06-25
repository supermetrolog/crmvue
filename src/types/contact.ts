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
