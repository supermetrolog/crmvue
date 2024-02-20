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
    4: 'Не известно'
};

const commissionOwner = {
    1: 'Деньгами',
    2: 'Деньгами (гарантировано)',
    3: 'Через каникулы',
    4: 'Не платит'
};

const builtToSuit = {
    1: 'BTS',
    2: 'BTR'
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
    EXCLUSIVE: 1,
    SIMPLE: 2
};

const builtToSuitPlanStatement = {
    EXIST: 1,
    NOT_EXIST: 2
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
    builtToSuit,
    builtToSuitPlanStatement
};
