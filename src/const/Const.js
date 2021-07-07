export const Menu = new Map([
    ['admin', [{ "id": 0, "name": "Компании", "icon": "fas fa-users", "url": "/companies" },
        { "id": 1, "name": "Статистика", "icon": "far fa-chart-bar", "url": "/statistic" },
        { "id": 2, "name": "Календарь", "icon": "fas fa-calendar-alt", "url": "/calendar", "exact": true },
        { "id": 3, "name": "Настройки", "icon": "fas fa-cog", "url": "/setting" },
    ]],
    ['agent', [{ "id": 0, "name": "Клиенты", "icon": "fas fa-users", "url": "/companies" },
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
    ['companies', [{ "id": 0, "name": "все", "url": "/companies/", "exact": true },
        { "id": 1, "name": "запрос", "url": "/companies/request" },
        { "id": 2, "name": "сделка", "url": "/companies/deal" },
        { "id": 3, "name": "брак", "url": "/companies/brak" },
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

export const Timeline = new Map(
    [
        ['param', [
            [0, { "stepName": "Meeting", "name": "Знакомство с клиентом", "class": "primary", "icon": "far fa-grin-wink" }, ],
            [1, { "stepName": "Offers", "name": "Предложения", "class": "success", "icon": "far fa-grin-wink" }, ],
            [2, { "stepName": "Feedback", "name": "Обратная связь", "class": "warning", "icon": "far fa-grin-wink" }, ],
            [3, { "stepName": "Inspection", "name": "Организация осмотра", "class": "danger", "icon": "far fa-grin-wink" }, ],
            [4, { "stepName": "Visit", "name": "Осмотр", "class": "blue", "icon": "far fa-grin-wink" }, ],
            [5, { "stepName": "Interest", "name": "Заинтересованность/переговоры", "class": "green", "icon": "far fa-grin-wink" }, ],
            [6, { "stepName": "Deal", "name": "Сделка", "class": "secondary", "icon": "far fa-grin-wink" }, ],
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

    ]
);
export const CompanyCategories = new Map(
    [
        ['param', [
            [0, "клиент"],
            [1, "посредник"],
            [2, "мониторинг"],
            [3, "собственник"],
            [4, "оценщик"],
            [5, "подрядчик"],
        ]],

    ]
);