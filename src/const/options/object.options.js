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

const landscape = {
    1: 'Ровный',
    2: 'С перепадами'
};

const purposes = {
    0: { name: 'сухой склад', icon: 'fa-solid fa-warehouse' },
    1: { name: 'холодильник (0/+5С)', icon: 'fa-solid fa-temperature-half' },
    2: { name: 'морозильник (до -25С)', icon: 'fa-solid fa-snowflake' },
    3: { name: 'алкогольный склад', icon: 'fa-solid fa-beer-mug-empty' },
    4: { name: 'фармацевтический склад', icon: 'fa-solid fa-suitcase-medical' },
    5: { name: 'овощехранилище', icon: 'fa-solid fa-lemon' },
    6: { name: 'грузоперевозки/логистика', icon: 'fa-solid fa-truck' },
    7: { name: 'опасные грузы', icon: 'fa-solid fa-skull-crossbones' },
    8: { name: 'холодный склад', icon: 'fas fa-warehouse alt' },
    9: { name: 'архив', icon: 'fas fa-archive' },
    10: { name: 'досуг/развлечения', icon: 'fas fa-volleyball-ball' },
    11: { name: 'пищевое (склад)', icon: 'fas fa-utensils' },
    12: { name: 'сборочное', icon: 'fas fa-industry' },
    13: { name: 'швейное', icon: 'fab fa-shirtsinbulk' },
    14: { name: 'пищевое (пр-во)', icon: 'fas fa-utensils' },
    15: { name: 'автосервис/мойка', icon: 'fas fa-car' },
    16: { name: 'деревообработка', icon: 'fas fa-tree' },
    17: { name: 'металлообработка', icon: 'fas fa-gavel' },
    18: { name: 'ЖБИ/камень', icon: 'fas fa-chess-rook' },
    19: { name: 'машиностроение', icon: 'fas fa-cogs' },
    20: { name: 'ПВХ/полимеры/минералы', icon: 'fas fa-bong' },
    21: { name: 'фарм/косметика/алкоголь', icon: 'fas fa-pills' },
    22: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
    23: { name: 'прачечная', icon: 'fas fa-tshirt' },
    24: { name: 'типография', icon: 'fas fa-print' },
    25: { name: 'хранение/стоянка', icon: 'fas fa-pallet' },
    26: { name: 'автосервис/услуги (стройка)', icon: 'fas fa-burn' },
    27: { name: 'производство/склад (стройка)', icon: 'far fa-square' },
    28: { name: 'торговый центр (стройка)', icon: 'fas fa-store-alt' },
    29: { name: 'производство 1-3 класс опасности (уч)', icon: 'fas fa-biohazard' },
    30: { name: 'досуг/развлечения (уч)', icon: 'fas fa-volleyball-ball' },
    31: { name: 'АЗС (стройка)', icon: 'fas fa-gas-pump' }
};

const purposesWithSections = {
    warehouse: [
        { id: 0, name: 'сухой склад', icon: 'fa-solid fa-warehouse' },
        { id: 1, name: 'холодильник (0/+5С)', icon: 'fa-solid fa-temperature-half' },
        { id: 2, name: 'морозильник (до -25С)', icon: 'fa-solid fa-snowflake' },
        { id: 3, name: 'алкогольный склад', icon: 'fa-solid fa-beer-mug-empty' },
        { id: 4, name: 'фармацевтический склад', icon: 'fa-solid fa-suitcase-medical' },
        { id: 5, name: 'овощехранилище', icon: 'fa-solid fa-lemon' },
        { id: 6, name: 'грузоперевозки/логистика', icon: 'fa-solid fa-truck' },
        { id: 7, name: 'опасные грузы', icon: 'fa-solid fa-skull-crossbones' },
        { id: 8, name: 'холодный склад', icon: 'fas fa-warehouse alt' },
        { id: 9, name: 'архив', icon: 'fas fa-archive' },
        { id: 10, name: 'досуг/развлечения', icon: 'fas fa-volleyball-ball' },
        { id: 11, name: 'пищевое (склад)', icon: 'fas fa-utensils' }
    ],
    production: [
        { id: 12, name: 'сборочное', icon: 'fas fa-industry' },
        { id: 13, name: 'швейное', icon: 'fab fa-shirtsinbulk' },
        { id: 14, name: 'пищевое (пр-во)', icon: 'fas fa-utensils' },
        { id: 15, name: 'автосервис/мойка', icon: 'fas fa-car' },
        { id: 16, name: 'деревообработка', icon: 'fas fa-tree' },
        { id: 17, name: 'металлообработка', icon: 'fas fa-gavel' },
        { id: 18, name: 'ЖБИ/камень', icon: 'fas fa-chess-rook' },
        { id: 19, name: 'машиностроение', icon: 'fas fa-cogs' },
        { id: 20, name: 'ПВХ/полимеры/минералы', icon: 'fas fa-bong' },
        { id: 21, name: 'фарм/косметика/алкоголь', icon: 'fas fa-pills' },
        { id: 22, name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
        { id: 23, name: 'прачечная', icon: 'fas fa-tshirt' },
        { id: 24, name: 'типография', icon: 'fas fa-print' }
    ],
    plot: [
        { id: 25, name: 'хранение/стоянка', icon: 'fas fa-pallet' },
        { id: 26, name: 'автосервис/услуги (стройка)', icon: 'fas fa-burn' },
        { id: 27, name: 'производство/склад (стройка)', icon: 'far fa-square' },
        { id: 28, name: 'торговый центр (стройка)', icon: 'fas fa-store-alt' },
        { id: 29, name: 'производство 1-3 класс опасности (уч)', icon: 'fas fa-biohazard' },
        { id: 30, name: 'досуг/развлечения (уч)', icon: 'fas fa-volleyball-ball' },
        { id: 31, name: 'АЗС (стройка)', icon: 'fas fa-gas-pump' }
    ]
};

const dealTypeString = {
    rent_or_sale: 'Аренда | Продажа',
    response_storage: 'Ответ-хранение',
    sublease: 'Субаренда'
};

const typeGeneralList = [{ name: 'Производство' }, { name: 'Склад' }, { name: 'Участок' }];

export const objectOptions = {
    class: _class,
    facing,
    ownType,
    ownTypeLand,
    landCategory,
    landscape,
    purposes,
    purposesWithSections,
    dealTypeString,
    typeGeneralList
};
