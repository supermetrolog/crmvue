const floorTypes = {
    1: 'Асфальт',
    2: 'Антипыль',
    3: 'Бет. плиты',
    4: 'Тех. плитка',
    5: 'Стяжка',
    6: 'Асф. крошка',
    7: 'Грунт'
};

const gridColumn = {
    1: '6x6',
    2: '6x9',
    3: '6x12',
    4: '6x18',
    5: '6x24',
    6: '9x9',
    7: '9x12',
    8: '9x18',
    9: '9x24',
    10: '12x12',
    11: '12x18',
    12: '12x24',
    13: 'без колонн'
};

const gate = {
    1: 'Док. типа',
    2: 'Нулевой уровень',
    3: 'Авторампа',
    4: 'Ж/Р рампа'
};

const lighting = {
    1: 'Лампы накаливания',
    2: 'Световые колодцы',
    3: 'Светодиодное'
};

const ventilation = {
    1: 'Естественная',
    2: 'Принудительная',
    3: 'Приточно-вытяжная',
    4: 'Сплит-системы'
};

const firefighting = {
    1: 'Гидрантная система',
    2: 'Спринклерная система',
    3: 'Порошковая система',
    4: 'Газовая система',
    5: 'Огнетушители'
};

const name = {
    '-3': '-3 этаж',
    '-2': '-2 этаж',
    '-1': '-1 этаж',
    1: '1 этаж',
    2: '2 этаж',
    3: '3 этаж',
    4: '4 этаж',
    5: '5 этаж',
    6: '6 этаж',
    '1m': 'Мезонин, 1-ый ярус',
    '2m': 'Мезонин, 2-ой ярус',
    '3m': 'Мезонин, 3-ий ярус',
    '4m': 'Мезонин, 4-ый ярус'
};

export const floorOptions = {
    floorTypes,
    gridColumn,
    gate,
    lighting,
    ventilation,
    firefighting,
    name
};