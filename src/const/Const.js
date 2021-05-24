export const Menu = new Map([
    ['admin', [{ "id": 0, "name": "Клиенты", "icon": "fas fa-users", "url": "/client" },
        { "id": 1, "name": "Статистика", "icon": "far fa-chart-bar", "url": "/statistic" },
        { "id": 2, "name": "Календарь", "icon": "fas fa-calendar-alt", "url": "/calendar", "exact": true },
        { "id": 3, "name": "Настройки", "icon": "fas fa-cog", "url": "/setting" },
    ]],
    ['agent', [{ "id": 0, "name": "Клиенты", "icon": "fas fa-users", "url": "/client" },
        { "id": 1, "name": "Статистика", "icon": "fas fa-handshake", "url": "/statistic" },
        { "id": 2, "name": "Календарь", "icon": "fas fa-th", "url": "/calendar", "exact": true },
        { "id": 3, "name": "Настройки", "icon": "fas fa-ruble-sign", "url": "/setting" },
    ]],
]);
export const InternalMenu = new Map([
    ['statistic', [{ "id": 0, "name": "общая", "url": "/statistic/", "exact": true },
        { "id": 1, "name": "сделка", "url": "/statistic/deal" },
        { "id": 2, "name": "брак", "url": "/statistic/brak" },
    ]],
    ['client', [{ "id": 0, "name": "все", "url": "/client/", "exact": true },
        { "id": 1, "name": "в работе", "url": "/client/in-work" },
        { "id": 2, "name": "сделка", "url": "/client/deal" },
        { "id": 3, "name": "брак", "url": "/client/brak" },
    ]],
    ['setting', [{ "id": 0, "name": "все", "url": "/setting/", "exact": true },
        { "id": 1, "name": "в работе", "url": "/setting/in-work" },
        { "id": 2, "name": "сделка", "url": "/setting/deal" },
        { "id": 3, "name": "брак", "url": "/setting/brak" },
    ]],
]);

export const DropdownList = new Map([
    ['comming_theme', [
        { "value": 0, "name": "(не выбрана)" },
        { "value": 1, "name": "Гражданское право" },
        { "value": 2, "name": "Пенсия" },
        { "value": 3, "name": "Мошенничество" },
        { "value": 4, "name": "ДТП" },
        { "value": 5, "name": "Кредиты" },
        { "value": 6, "name": "Авто" },
    ]],
    ['comming_status', [
        { "value": 0, "name": "(не выбран)" },
        { "value": 1, "name": "Договор" },
        { "value": 2, "name": "БК" },
        { "value": 3, "name": "Бесплатные документы" },
        { "value": 4, "name": "Шел в гос учреждение" },
        { "value": 5, "name": "Нет 18 лет" },
        { "value": 6, "name": "Ушел с ресепа" },
    ]],
]);