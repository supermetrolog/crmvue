const usedStatus = {
    1: 'Новое',
    2: 'Б/У',
    3: 'Требуется ремонт'
};

const category = {
    1: 'Стеллажное оборудование',
    2: 'Станки',
    3: 'Крановые устройства',
    4: 'Подъемные устройства',
    5: 'Погрузо-разгрузочная техника',
    6: 'Серверное оборудование',
    7: 'Другое'
};

const tax = {
    1: 'С НДС',
    2: 'Без НДС'
};

const availability = {
    1: 'В наличии',
    2: 'Под заказ'
};

const delivery = {
    1: 'Платная доставка',
    2: 'Доставка включена',
    3: 'Самовывоз'
};

const status = {
    1: 'Актив',
    2: 'Пассив'
};

const statusStatement = {
    ACTIVE: 1,
    PASSIVE: 2
};

const passiveType = {
    1: 'Продано',
    2: 'Устарело',
    3: 'Отменено',
    4: 'Удалено модератором',
    5: 'Иное'
};

export const equipmentOptions = {
    usedStatus,
    category,
    tax,
    availability,
    delivery,
    status,
    statusStatement,
    passiveType
};
