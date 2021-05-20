export const Menu = new Map([
    ['admin', [{ "id": 0, "name": "Приход", "icon": "fas fa-users", "url": "/comming" },
        { "id": 1, "name": "Договоры", "icon": "fas fa-handshake", "url": "/agreements" },
        { "id": 2, "name": "Процесс", "icon": "fas fa-th", "url": "/process", "exact": true },
        { "id": 3, "name": "Касса", "icon": "fas fa-ruble-sign", "url": "/cashbox" },
        { "id": 4, "name": "Рейтинг", "icon": "fas fa-star", "url": "/rate" },
        { "id": 5, "name": "Зарплаты", "icon": "fas fa-wallet", "url": "/salary" },
        { "id": 6, "name": "Суды", "icon": "fas fa-gavel", "url": "/court" },
        { "id": 7, "name": "Персонал", "icon": "fas fa-address-card", "url": "/personal" }
    ]],
    ['okk', [{ "id": 0, "name": "Приход", "icon": "fas fa-users", "url": "/comming" },
        { "id": 1, "name": "Договоры", "icon": "fas fa-handshake", "url": "/agreements" },
        { "id": 2, "name": "Процесс", "icon": "fas fa-th", "url": "/", "exact": true },
        { "id": 3, "name": "Суды", "icon": "fas fa-gavel", "url": "/court" },
    ]],
]);
export const InternalMenu = new Map([
    ['personal', [{ "id": 0, "name": "все", "url": "/personal/", "exact": true },
        { "id": 1, "name": "it", "url": "/personal/it" },
        { "id": 2, "name": "ресепшн", "url": "/personal/recep" },
        { "id": 3, "name": "эпод", "url": "/personal/epod" },
        { "id": 4, "name": "окк", "url": "/personal/okk" },
        { "id": 5, "name": "hr", "url": "/personal/hr" },
        { "id": 6, "name": "представители", "url": "/personal/represent" },
        { "id": 7, "name": "управление", "url": "/personal/control" }
    ]],
    ['process', [{ "id": 0, "name": "все", "url": "/process/", "exact": true },
        { "id": 1, "name": "оплаченные", "url": "/process/paid" },
        { "id": 2, "name": "не оплаченные", "url": "/process/no-paid" },
    ]],
    ['comming', [{ "id": 0, "name": "все", "url": "/comming/", "exact": true },
        { "id": 1, "name": "первичные", "url": "/comming/primary" },
        { "id": 2, "name": "вторичные", "url": "/comming/secondary" },
        { "id": 3, "name": "бк", "url": "/comming/bk" },
        { "id": 4, "name": "договоры", "url": "/comming/agreements" },
        { "id": 5, "name": "брак", "url": "/comming/brak" },
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