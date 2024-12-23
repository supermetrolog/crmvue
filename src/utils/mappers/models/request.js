const GENERAL_OBJECT_TYPES = {
    0: 'Под склад',
    1: 'Под производство',
    2: 'Участок'
};

export function mapRequestGeneralObjectTypes(data) {
    return data.map(item => ({ id: item.id, label: GENERAL_OBJECT_TYPES[item.type] }));
}

const OBJECT_TYPES = {
    0: { name: 'Сухой склад', icon: 'fa-solid fa-warehouse' },
    1: { name: 'Сборочное', icon: 'fas fa-industry' },
    2: { name: 'Холодильник (0/+5С)', icon: 'fa-solid fa-temperature-half' },
    3: { name: 'Швейное', icon: 'fab fa-shirtsinbulk' },
    4: { name: 'Пищевое (склад)', icon: 'fas fa-utensils' },
    5: { name: 'Автосервис/мойка', icon: 'fas fa-car' },
    6: { name: 'Пищевое (пр-во)', icon: 'fas fa-utensils' },
    7: { name: 'Морозильник (до -25С)', icon: 'fa-solid fa-snowflake' },
    8: { name: 'Хранение/стоянка', icon: 'fas fa-pallet' },
    9: { name: 'Алкогольный склад', icon: 'fa-solid fa-beer-mug-empty' },
    10: { name: 'Фармацевтический склад', icon: 'fa-solid fa-suitcase-medical' },
    11: { name: 'Овощехранилище', icon: 'fa-solid fa-lemon' },
    12: { name: 'Грузоперевозки/логистика', icon: 'fa-solid fa-truck' },
    13: { name: 'Автосервис/услуги (стройка)', icon: 'fas fa-burn' },
    14: { name: 'Производство/склад (стройка)', icon: 'far fa-square' },
    15: { name: 'Опасные грузы', icon: 'fa-solid fa-skull-crossbones' },
    16: { name: 'Деревообработка', icon: 'fas fa-tree' },
    17: { name: 'Металлообработка', icon: 'fas fa-gavel' },
    18: { name: 'ЖБИ/камень', icon: 'fas fa-chess-rook' },
    19: { name: 'Машиностроение', icon: 'fas fa-cogs' },
    20: { name: 'ПВХ/полимеры/минералы', icon: 'fas fa-bong' },
    21: { name: 'Фарм/косметика/алкоголь', icon: 'fas fa-pills' },
    22: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
    23: { name: 'Прачечная', icon: 'fas fa-tshirt' },
    24: { name: 'Ошибка..', icon: 'fas fa-warning' },
    25: { name: 'Торговый центр (стройка)', icon: 'fas fa-store-alt' },
    26: { name: 'Холодный склад', icon: 'fas fa-warehouse alt' },
    27: { name: 'Архив', icon: 'fas fa-archive' },
    28: { name: 'Досуг/развлечения', icon: 'fas fa-volleyball-ball' },
    29: { name: 'Типография', icon: 'fas fa-print' },
    30: { name: '1-3 класс опасности', icon: 'fas fa-biohazard' },
    31: { name: 'Досуг/развлечения', icon: 'fas fa-volleyball-ball' },
    32: { name: 'АЗС (стройка)', icon: 'fas fa-gas-pump' },
    33: { name: 'АЗС (стройка)', icon: 'fas fa-gas-pump' }
};

export function mapRequestObjectTypes(data) {
    return data.map(item => ({ id: item.id, object: OBJECT_TYPES[item.object_type] }));
}
