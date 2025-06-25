export const RequestPassiveWhyEnum = {
    BLOCK: 0,
    ALREADY_RENT: 1,
    ALREADY_BUY: 2,
    OUTDATED: 3,
    SUSPEND: 4,
    OTHER: 5,
    SURVEY: 6
} as const;

export const RequestPassiveWhyLabel = {
    [RequestPassiveWhyEnum.BLOCK]: 'Заблокировано модератором',
    [RequestPassiveWhyEnum.ALREADY_RENT]: 'Сняли',
    [RequestPassiveWhyEnum.ALREADY_BUY]: 'Купили',
    [RequestPassiveWhyEnum.OUTDATED]: 'Запрос устарел',
    [RequestPassiveWhyEnum.SUSPEND]: 'Отложил поиск',
    [RequestPassiveWhyEnum.OTHER]: 'Иное',
    [RequestPassiveWhyEnum.SURVEY]: 'По результату опроса'
};

export type RequestPassiveWhy = (typeof RequestPassiveWhyEnum)[keyof typeof RequestPassiveWhyEnum];
