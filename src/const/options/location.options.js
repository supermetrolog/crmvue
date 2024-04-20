const direction = {
    2: 'Север',
    3: 'Восток',
    4: 'Юг',
    5: 'Запад',
    6: 'Серево-Восток',
    7: 'Юго-Восток',
    8: 'Серево-Запад',
    9: 'Юго-Запад'
};

const cianRegion = {
    1: 'Москва',
    2: 'Ближнее подмосковье',
    3: 'Дальнее подмосковье'
};

const directionWithShort = {
    0: { short: 'С', full: 'Север' },
    1: { short: 'В', full: 'Восток' },
    2: { short: 'Ю', full: 'Юг' },
    3: { short: 'З', full: 'Запад' },
    4: { short: 'С-В', full: 'Северо-Восток' },
    5: { short: 'Ю-В', full: 'Юго-Восток' },
    6: { short: 'С-З', full: 'Северо-Запад' },
    7: { short: 'Ю-З', full: 'Юго-Запад' }
};

const district = {
    0: 'ЦАО',
    1: 'ЗАО',
    2: 'СЗАО',
    3: 'ЮЗАО',
    4: 'ЮАО',
    5: 'САО',
    6: 'СВАО',
    7: 'ЮВАО',
    8: 'ВАО',
    9: 'НОВ. МОСКВА',
    10: 'ЗЕЛЕНОГРАД'
};

export const locationOptions = {
    direction,
    cianRegion,
    directionWithShort,
    district
};
