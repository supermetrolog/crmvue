const _class = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D'
};

const facing = {
    1: 'Кирпич',
    2: 'Сайдинг',
    3: 'Сендвич-панели',
    4: 'Штукатурка',
    6: 'Бетонные панели',
    7: 'Керамическая плитка'
};

const ownType = {
    1: 'Аренда',
    2: 'Собственность',
    3: 'Безвозмездное пользование',
    4: 'Бессрочная аренда'
};

const ownTypeLand = {
    1: 'Собственность',
    2: 'Аренда',
    3: 'Безвозмездное пользование',
    4: 'Бессрочная аренда'
};

const landCategory = {
    1: 'Земли запаса',
    2: 'Земли лесного фонда',
    3: 'Земли особо охраняемых территорий и объектов',
    4: 'Земли населенных пунктов',
    5: 'Земли промышленности',
    6: 'Земли сельхозназначения'
};

export const landscapeTypeOptions = {
    1: 'Ровный',
    2: 'С перепадами'
};

export const objectPurposesOptions = {
    1: { name: 'Сухой склад', icon: 'fa-solid fa-warehouse' },
    2: { name: 'Сборочное', icon: 'fas fa-industry' },
    3: { name: 'Холодильник (0/+5С)', icon: 'fa-solid fa-temperature-half' },
    4: { name: 'Швейное', icon: 'fab fa-shirtsinbulk' },
    5: { name: 'Пищевое (склад)', icon: 'fas fa-utensils' },
    6: { name: 'Автосервис/мойка', icon: 'fas fa-car' },
    7: { name: 'Пищевое (пр-во)', icon: 'fas fa-utensils' },
    8: { name: 'Морозильник (до -25С)', icon: 'fa-solid fa-snowflake' },
    9: { name: 'Хранение/стоянка', icon: 'fas fa-pallet' },
    10: { name: 'Алкогольный склад', icon: 'fa-solid fa-beer-mug-empty' },
    11: { name: 'Фармацевтический склад', icon: 'fa-solid fa-suitcase-medical' },
    12: { name: 'Овощехранилище', icon: 'fa-solid fa-lemon' },
    13: { name: 'Грузоперевозки/логистика', icon: 'fa-solid fa-truck' },
    14: { name: 'Автосервис/услуги (стройка)', icon: 'fas fa-burn' },
    15: { name: 'Производство/склад (стройка)', icon: 'far fa-square' },
    16: { name: 'Опасные грузы', icon: 'fa-solid fa-skull-crossbones' },
    17: { name: 'Деревообработка', icon: 'fas fa-tree' },
    18: { name: 'Металлообработка', icon: 'fas fa-gavel' },
    19: { name: 'ЖБИ/камень', icon: 'fas fa-chess-rook' },
    20: { name: 'Машиностроение', icon: 'fas fa-cogs' },
    21: { name: 'ПВХ/полимеры/минералы', icon: 'fas fa-bong' },
    22: { name: 'Фарм/косметика/алкоголь', icon: 'fas fa-pills' },
    23: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
    24: { name: 'Прачечная', icon: 'fas fa-tshirt' },
    25: { name: 'Ошибка..', icon: 'fas fa-warning' },
    26: { name: 'Торговый центр (стройка)', icon: 'fas fa-store-alt' },
    27: { name: 'Холодный склад', icon: 'fas fa-warehouse alt' },
    28: { name: 'Архив', icon: 'fas fa-archive' },
    29: { name: 'Досуг/развлечения', icon: 'fas fa-volleyball-ball' },
    30: { name: 'Типография', icon: 'fas fa-print' },
    31: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
    32: { name: 'Досуг/развлечения', icon: 'fas fa-volleyball-ball' },
    33: { name: 'АЗС (стройка)', icon: 'fas fa-gas-pump' }
};

export const objectType = {
    1: 'warehouse',
    2: 'production',
    3: 'plot'
};

export const objectPurposesWithSectionsOptions = {
    warehouse: {
        1: { name: 'Сухой склад', icon: 'fa-solid fa-warehouse' },
        3: { name: 'Холодильник (0/+5С)', icon: 'fa-solid fa-temperature-half' },
        5: { name: 'Пищевое (склад)', icon: 'fas fa-utensils' },
        8: { name: 'Морозильник (до -25С)', icon: 'fa-solid fa-snowflake' },
        10: { name: 'Алкогольный склад', icon: 'fa-solid fa-beer-mug-empty' },
        11: { name: 'Фармацевтический склад', icon: 'fa-solid fa-suitcase-medical' },
        12: { name: 'Овощехранилище', icon: 'fa-solid fa-lemon' },
        13: { name: 'Грузоперевозки/логистика', icon: 'fa-solid fa-truck' },
        16: { name: 'Опасные грузы', icon: 'fa-solid fa-skull-crossbones' },
        27: { name: 'Холодный склад', icon: 'fas fa-warehouse alt' },
        28: { name: 'Архив', icon: 'fas fa-archive' },
        29: { name: 'Досуг/развлечения', icon: 'fas fa-volleyball-ball' }
    },
    production: {
        2: { name: 'Сборочное', icon: 'fas fa-industry' },
        4: { name: 'Швейное', icon: 'fab fa-shirtsinbulk' },
        6: { name: 'Автосервис/мойка', icon: 'fas fa-car' },
        7: { name: 'Пищевое (пр-во)', icon: 'fas fa-utensils' },
        17: { name: 'Деревообработка', icon: 'fas fa-tree' },
        18: { name: 'Металлообработка', icon: 'fas fa-gavel' },
        19: { name: 'ЖБИ/камень', icon: 'fas fa-chess-rook' },
        20: { name: 'Машиностроение', icon: 'fas fa-cogs' },
        21: { name: 'ПВХ/полимеры/минералы', icon: 'fas fa-bong' },
        22: { name: 'Фарм/косметика/алкоголь', icon: 'fas fa-pills' },
        23: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
        24: { name: 'Прачечная', icon: 'fas fa-tshirt' },
        30: { name: 'Типография', icon: 'fas fa-print' }
    },
    plot: {
        9: { name: 'Хранение/стоянка', icon: 'fas fa-pallet' },
        14: { name: 'Автосервис/услуги (стройка)', icon: 'fas fa-burn' },
        15: { name: 'Производство/склад (стройка)', icon: 'far fa-square' },
        26: { name: 'Торговый центр (стройка)', icon: 'fas fa-store-alt' },
        31: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
        32: { name: 'Досуг/развлечения', icon: 'fas fa-volleyball-ball' },
        33: { name: 'АЗС (стройка)', icon: 'fas fa-gas-pump' }
    }
};

const dealTypeString = {
    rent_or_sale: 'Аренда | Продажа',
    response_storage: 'Ответ-хранение',
    sublease: 'Субаренда'
};

const typeGeneral = {
    0: { name: 'Склад', icon: 'fa-solid fa-warehouse' },
    1: { name: 'Производство', icon: 'fa-solid fa-industry' },
    2: { name: 'Участок', icon: 'fa-solid fa-mountain-sun' }
};

const typeGeneralList = [
    { name: 'Склад', icon: 'fa-solid fa-warehouse' },
    { name: 'Производство', icon: 'fa-solid fa-industry' },
    { name: 'Участок', icon: 'fa-solid fa-mountain-sun' }
];

export const objectOptions = {
    class: _class,
    facing,
    ownType,
    ownTypeLand,
    landCategory,
    landscape: landscapeTypeOptions,
    purposes: objectPurposesOptions,
    purposesWithSections: objectPurposesWithSectionsOptions,
    dealTypeString,
    typeGeneralList,
    typeGeneral,
    objectType
};
