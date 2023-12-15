export const facingTypes = {
    1: 'Кирпич',
    2: 'Сайдинг',
    3: 'Сендвич-панели',
    4: 'Штукатурка',
    5: 'Бетонные панели',
    6: 'Керамическая плитка'
};

export const ownTypes = {
    1: 'Аренда',
    2: 'Собственность',
    3: 'Безвозмездное пользование',
    4: 'Бессрочная аренда'
};

export const objectClassTypes = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D'
};

export const objectPurposes = {
    1: { name: 'сухой склад', icon: 'fas fa-warehouse' },
    2: { name: 'сборочное производство', icon: 'fas fa-industry' },
    3: { name: 'холодильник (0/+5С)', icon: 'fas fa-thermometer-half' },
    4: { name: 'швейное', icon: 'fab fa-shirtsinbulk' },
    5: { name: 'пищевое (пр-во)', icon: 'fas fa-utensils' },
    6: { name: 'автосервис/мойка', icon: 'fas fa-car' },
    8: { name: 'морозильник (до -25С)', icon: 'fas fa-snowflake' },
    9: { name: 'хранение/стоянка', icon: 'fas fa-pallet' },
    10: { name: 'алкогольрный склад', icon: 'fas fa-beer' },
    11: { name: 'фармацевтический склад', icon: 'fas fa-medkit' },
    12: { name: 'овощехранилище', icon: 'fas fa-lemon' },
    13: { name: 'грузоперевозки/логистика', icon: 'fas fa-truck' },
    14: { name: 'автосервис/услуги (стройка)', icon: 'fas fa-burn' },
    15: { name: 'производство/склад (стройка)', icon: 'far fa-square' },
    16: { name: 'опасные грузы', icon: 'fas fa-skull-crossbones' },
    17: { name: 'деревообработка', icon: 'fas fa-tree' },
    18: { name: 'металлообработка', icon: 'fas fa-gavel' },
    19: { name: 'ЖБИ/камень', icon: 'fas fa-chess-rook' },
    20: { name: 'машиностроение', icon: 'fas fa-cogs' },
    21: { name: 'ПВХ/полимеры/минералы', icon: 'fas fa-bong' },
    22: { name: 'фарм/косметика/алкоголь', icon: 'fas fa-pills' },
    23: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
    24: { name: 'прачечная', icon: 'fas fa-tshirt' },
    26: { name: 'торговый центр (стройка)', icon: 'fas fa-store-alt' },
    27: { name: 'холодный склад', icon: 'fas fa-warehouse' },
    28: { name: 'архив', icon: 'fas fa-archive' },
    29: { name: 'досуг/развлечения', icon: 'fas fa-volleyball-ball' },
    30: { name: 'типография', icon: 'fas fa-print' },
    31: { name: 'производство 1-3 класс опасности (уч)', icon: 'fas fa-biohazard' },
    32: { name: 'досуг/развлечения (уч)', icon: 'fas fa-volleyball-ball' },
    33: { name: 'АЗС (стройка)', icon: 'fas fa-gas-pump' }
};

export const ownTypesLand = {
    1: 'Собственность',
    2: 'Аренда',
    3: 'Безвозмездное пользование',
    4: 'Бессрочная аренда'
};
export const landCategoryTypes = {
    1: 'Земли запаса',
    2: 'Земли лесного фонда',
    3: 'Земли особо охраняемых территорий и объектов',
    4: 'Земли населенных пунктов',
    5: 'Земли промышленности',
    6: 'Земли сельхозназначения'
};

export const landscapeTypes = {
    1: 'Ровный',
    2: 'С перепадами'
};

export const entryTerritoryTypes = {
    1: 'Свободный',
    2: 'По пропускам'
};

export const feeTypes = {
    1: 'Платно',
    2: 'Бесплатно'
};

export const waterTypes = {
    1: 'Скважина',
    2: 'Центральное'
};

export const gasTypes = {
    1: 'внутри',
    2: 'газопр. рядом',
    3: 'по границе'
};

export const internetTypes = {
    1: 'Опто-волокно',
    2: 'Беспроводной'
};

export const guardTypes = {
    1: 'МВД',
    2: 'ЧОП',
    3: 'Охрана собственника'
};

export const floorTypes = {
    1: 'Асфальт',
    2: 'Антипыль',
    3: 'Бет. плиты',
    4: 'Тех. плитка',
    5: 'Стяжка'
};

export const gridColumnTypes = {
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

export const entranceBlockTypes = {
    1: 'общие ворота/коридор',
    2: 'собственные ворота'
};

export const rackTypes = {
    1: 'Обычнопроходные',
    2: 'Узкопроходные',
    3: 'Мезанинные'
};

export const lightingTypes = {
    1: 'Лампы накаливания',
    2: 'Световые колодцы',
    3: 'Светодиодное'
};

export const ventilationTypes = {
    1: 'Естественная',
    2: 'Принудительная',
    3: 'Приточно-вытяжная',
    4: 'Сплит-системы'
};
export const gateTypes = {
    1: 'док. типа',
    2: 'нулевой уровень',
    3: 'авторампа',
    4: 'ж/д рампа'
};

export const firefightingTypes = {
    1: 'Гидрантная система',
    2: 'Спринклерная система',
    3: 'Порошковая система',
    4: 'Газовая система',
    5: 'Огнетушители'
};

export const heatingAutonomousTypes = {
    1: "дизельное",
    2: "газовое",
    3: "дровяное",
}
