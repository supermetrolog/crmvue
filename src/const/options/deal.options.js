const publicServices = {
    1: {
        name: 'Отопление',
        icon: 'fa-solid fa-fire-flame-curved'
    },
    2: {
        name: 'Вода',
        icon: 'fa-solid fa-droplet'
    },
    3: {
        name: 'Элекричество',
        icon: 'fa-solid fa-plug-circle-bolt'
    }
};

const opex = {
    1: {
        name: 'Обслуживание здания',
        icon: 'fa-solid fa-industry'
    },
    2: {
        name: 'Охрана',
        icon: 'fa-solid fa-shield-halved'
    },
    3: {
        name: 'Вывоз мусора',
        icon: 'fa-solid fa-snowplow'
    }
};

const tax = {
    1: 'Triple Net',
    2: 'УСН',
    3: 'С НДС',
    4: 'Без НДС'
};

const servicePrice = {
    1: 'Включено',
    2: 'Частично',
    3: 'Не включено',
    4: 'Неизвестно'
};

const commissionOwner = {
    1: 'Деньгами',
    2: 'Деньгами (гарантировано)',
    3: 'Через каникулы',
    4: 'Не платит'
};

const status = {
    1: 'Сдается',
    2: 'Сдано',
    3: 'Продано',
    4: 'Неизвестно',
    5: 'Свободно, размечено'
};

const type = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Ответ. хранение',
    4: 'Субаренда'
};

const commissionStatement = {
    INCLUDED: 1,
    CANCELED: 2
};

const contractStatement = {
    SIGNED: 1,
    NOT_SIGNED: 2
};

const contractTypeStatement = {
    SIMPLE: 1,
    EXCLUSIVE: 2
};

const builtToSuitPlanStatement = {
    EXIST: 1,
    NOT_EXIST: 2
};

const saleCompanyStatement = {
    READY_TO_SALE: 1,
    NOT_SALE: 2
};

const priceServiceStatement = {
    INCLUDED: 1,
    PARTLY: 2,
    NOT_INCLUDED: 3,
    UNKNOWN: 4
};

const typeStatement = {
    RENT: 1,
    SALE: 2,
    STORAGE: 3,
    SUBLEASE: 4
};

const statusStatement = {
    FOR_RENT: 1,
    RENTED_OUT: 2,
    SOLD_OUT: 3,
    UNKNOWN: 4,
    FREE: 5
};

export const dealOptions = {
    opex,
    publicServices,
    tax,
    servicePrice,
    commissionOwner,
    commissionStatement,
    contractStatement,
    contractTypeStatement,
    builtToSuitPlanStatement,
    saleCompanyStatement,
    priceServiceStatement,
    type,
    typeStatement,
    status,
    statusStatement
};
