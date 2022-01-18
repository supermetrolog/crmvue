export const Menu = new Map([
    ['admin', [{ "id": 0, "name": "Компании", "icon": "fas fa-industry", "url": "/companies" },
        { "id": 1, "name": "Статистика", "icon": "far fa-chart-bar", "url": "/statistic" },
        { "id": 2, "name": "Календарь", "icon": "fas fa-calendar-alt", "url": "/calendar", "exact": true },
        { "id": 3, "name": "Настройки", "icon": "fas fa-cog", "url": "/setting" },
        { "id": 4, "name": "Юзеры", "icon": "fas fa-users", "url": "/users" },
        { "id": 5, "name": "Аккаунт", "icon": "fas fa-user-astronaut", "url": "/account" },
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
    ['companies', [{ "id": 0, "name": "главная", "url": "/companies/", "exact": true },
        { "id": 1, "name": "группы компаний", "url": "/companies/groups" },
        { "id": 2, "name": "запросы", "url": "/companies/requests" },
        { "id": 3, "name": "сделки", "url": "/companies/deals" },
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
            [0, { "stepName": "Meeting", "name": "Знакомство с клиентом", "class": "primary", "icon": "fas fa-phone-alt" }, ],
            [1, { "stepName": "Offers", "name": "Предложения", "class": "success", "icon": "fas fa-city" }, ],
            [2, { "stepName": "Feedback", "name": "Обратная связь", "class": "warning", "icon": "fas fa-bullhorn" }, ],
            [3, { "stepName": "Inspection", "name": "Организация осмотра", "class": "blue", "icon": "fab fa-watchman-monitoring" }, ],
            [4, { "stepName": "Visit", "name": "Осмотр", "class": "green", "icon": "fas fa-eye" }, ],
            [5, { "stepName": "Interest", "name": "Заинтересованность", "class": "danger", "icon": "fas fa-heartbeat" }, ],
            [6, { "stepName": "Talk", "name": "Переговоры", "class": "pale-red", "icon": "fas fa-comments-dollar" }, ],
            [7, { "stepName": "Deal", "name": "Сделка", "class": "black", "icon": "far fa-handshake" }, ],
        ]],

    ]
);
export const FeedbackList = new Map(
    [
        ['param', [
            [0, "Email"],
            [1, "Звонок: Я"],
            [2, "Звонок: Он"],
            [3, "WhatsApp"],
            [4, "Viber"],
            [5, "SMS"],
            [6, "Telegram"],
        ]],
        ['contact', [
            [0, "Звонок", 'fas fa-phone'],
            [1, "Viber", 'fab fa-viber'],
            [2, "SMS", 'fas fa-sms'],
            [3, "Telegram", 'fab fa-telegram'],
            [4, "WhatsApp", 'fab fa-whatsapp-square'],
            [5, "Email", 'fas fa-at'],
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
export const CompanyFormOrganization = new Map(
    [
        ['param', [
            { value: 0, label: 'ООО' },
            { value: 1, label: 'ОАО' },
            { value: 2, label: 'ЗАО' },
            { value: 3, label: 'ПАО' },
            { value: 4, label: 'АО' },
            { value: 5, label: 'ИП' },
        ]],

    ]
);
export const ActivePassive = new Map(
    [
        ['param', [
            [1, "актив"],
            [0, "пассив"],
        ]],

    ]
);
export const YesNo = new Map(
    [
        ['param', [
            [1, "Да"],
            [0, "Нет"],
        ]],

    ]
);
export const unknownMovingDate = new Map(
    [
        ['param', [
            [1, "нет конкретики по сроку"],
            [0, "рассматривает постоянно"],
        ]],

    ]
);
export const ObjectClassList = new Map(
    [
        ['param', [
            [0, "A"],
            [1, "B"],
            [2, "C"],
            [3, "D"],
        ]],

    ]
);
export const GateTypeList = new Map(
    [
        ['param', [
            [0, "докового типа"],
            [1, "нулевой уровень"],
            [2, "авторампа"],
            [3, "ж/д рампа"],
        ]],

    ]
);
export const ObjectTypeList = new Map(
    [
        ['warehouse', [
            [0, { name: "сухой склад", icon: "fas fa-warehouse" }],
            [1, { name: "холодильник (0/+5С)", icon: "fas fa-thermometer-half" }],
            [2, { name: "морозильник (до -25С)", icon: "fas fa-snowflake" }],
            [3, { name: "алкогольрный склад", icon: "fas fa-beer" }],
            [4, { name: "фармацевтический склад", icon: "fas fa-medkit" }],
            [5, { name: "овощехранилище", icon: "fas fa-lemon" }],
            [6, { name: "грузоперевозки/логистика", icon: "fas fa-truck" }],
            [7, { name: "опасные грузы", icon: "fas fa-skull-crossbones" }],
            [8, { name: "холодный склад", icon: "fas fa-warehouse alt" }],
            [9, { name: "архив", icon: "fas fa-archive" }],
            [10, { name: "досуг/развлечения", icon: "fas fa-volleyball-ball" }],
        ]],
        ['production', [
            [11, { name: "сборочное", icon: "fas fa-industry" }],
            [12, { name: "швейное", icon: "fab fa-shirtsinbulk" }],
            [13, { name: "пищевое", icon: "fas fa-utensils" }],
            [14, { name: "автосервис/мойка", icon: "fas fa-car" }],
            [15, { name: "деревообработка", icon: "fas fa-tree" }],
            [16, { name: "металлообработка", icon: "fas fa-gavel" }],
            [17, { name: "ЖБИ/камень", icon: "fas fa-chess-rook" }],
            [18, { name: "машиностроение", icon: "fas fa-cogs" }],
            [19, { name: "ПВХ/полимеры/минералы", icon: "fas fa-bong" }],
            [20, { name: "фарм/косметика/алкоголь", icon: "fas fa-pills" }],
            [21, { name: "1-3 класс опасности", icon: "fas fa-biohazard" }],
            [22, { name: "прачечная", icon: "fas fa-tshirt" }],
            [23, { name: "типография", icon: "fas fa-print" }],
        ]],
        ['plot', [
            [24, { name: "хранение/стоянка", icon: "fas fa-pallet" }],
            [25, { name: "автосервис/услуги (стройка)", icon: "fas fa-burn" }],
            [26, { name: "производство/склад (стройка)", icon: "far fa-square" }],
            [27, { name: "торговый центр (стройка)", icon: "fas fa-store-alt" }],
            [28, { name: "производство 1-3 класс опасности (уч)", icon: "fas fa-biohazard" }],
            [29, { name: "досуг/развлечения (уч)", icon: "fas fa-volleyball-ball" }],
            [30, { name: "АЗС (стройка)", icon: "fas fa-gas-pump" }],
        ]],
    ]
);

// export const RegionList = new Map(
//     [
//         ['param', [
//             [0, "москва"],
//             [1, "московская область"],
//             [2, "ростовская область"],
//             [3, "калужская область"],
//             [4, "владимирская область"],
//             [5, "тульская область"],
//             [6, "ленинградская область"],
//             [7, "ярославская область"],
//             [8, "тверская область"],
//             [9, "новосибирская область"],
//             [10, "челябинский"],
//             [11, "воронежский"],
//             [12, "владимирский"],
//             [13, "нижний новгород"],
//             [14, "башкорторстан республика"],
//         ]],

//     ]
// );
export const RegionList = new Map(
    [
        ['param', [
            { value: 0, label: "москва" },
            { value: 1, label: "московская область" },
            { value: 2, label: "ростовская область" },
            { value: 3, label: "калужская область" },
            { value: 4, label: "владимирская область" },
            { value: 5, label: "тульская область" },
            { value: 6, label: "ленинградская область" },
            { value: 7, label: "ярославская область" },
            { value: 8, label: "тверская область" },
            { value: 9, label: "новосибирская область" },
            { value: 10, label: "челябинский" },
            { value: 11, label: "воронежский" },
            { value: 12, label: "владимирский" },
            { value: 13, label: "нижний новгород" },
            { value: 14, label: "башкорторстан республика" },
        ]],

    ]
);
export const DealTypeList = new Map(
    [
        ['param', [
            { value: 0, label: "аренда" },
            { value: 1, label: "продажа" },
            { value: 2, label: "ответ-хранение" },
            { value: 3, label: "субаренда" },
        ]],

    ]
);
export const DirectionList = new Map(
    [
        ['param', [
            [0, "С", "Север"],
            [1, "В", "Восток"],
            [2, "Ю", "Юг"],
            [3, "З", "Запад"],
            [4, "С-В", "Северо-Восток"],
            [5, "Ю-В", "Юго-Восток"],
            [6, "С-З", "Северо-Запад"],
            [7, "Ю-З", "Юго-Запад"],
        ]],

    ]
);
export const DistrictList = new Map(
    [
        ['param', [
            [0, "ЦАО"],
            [1, "ЗАО"],
            [2, "СЗАО"],
            [3, "ЮЗАО"],
            [4, "ЮАО"],
            [5, "САО"],
            [6, "СВАО"],
            [7, "ЮВАО"],
            [8, "ВАО"],
            [9, "НОВ. МОСКВА"],
            [10, "ЗЕЛЕНОГРАД"],
        ]],

    ]
);

export const PositionList = new Map(
    [
        ['param', [
            { value: 0, label: "Акционер" },
            { value: 1, label: "Генеральный директор" },
            { value: 2, label: "Коммерческий директор" },
            { value: 3, label: "Финансовый директор" },
            { value: 4, label: "Операционный директор" },
            { value: 5, label: "Управляющий директор" },
            { value: 6, label: "Директор по логистике" },
            { value: 7, label: "Начальник склада" },
            { value: 8, label: "Менеджер по проектам" },
            { value: 9, label: "Охранник" },
            { value: 10, label: "Главный инженер" },
            { value: 11, label: "Секретарь" },
            { value: 12, label: "Представитель управляющей компании" },
            { value: 13, label: "Представитель на объекте" },
            { value: 14, label: "Бухгалтер" },
            { value: 15, label: "Юрист" },
            { value: 16, label: "Агент" },

        ]],

    ]
);
export const ActivityGroupList = new Map(
    [
        ['param', [
            { value: 0, label: "Складирование" },
            { value: 1, label: "Производство" },
            { value: 2, label: "Строительство с привлечением" },
            { value: 3, label: "Строительство собственными силами" },
            { value: 4, label: "Услуги" },
            { value: 5, label: "Управление активами/арендный бизнес" },
            { value: 6, label: "Другое" },
        ]],

    ]
);
export const ActivityProfileList = new Map(
    [
        ['param', [
            { value: 0, label: "Продукты/Напитки" },
            { value: 1, label: "ТНП" },
            { value: 2, label: "Стройматериалы" },
            { value: 3, label: "Электротовары" },
            { value: 4, label: "Грузоперевозка/логистика" },
            { value: 5, label: "Алкоголь" },
            { value: 6, label: "Фармакология" },
            { value: 7, label: "Автозапчасти" },
            { value: 8, label: "Инструменты" },
            { value: 9, label: "Архив" },
            { value: 10, label: "Косметика" },
            { value: 11, label: "Бытовая/оргтехника" },
            { value: 12, label: "Мебель" },
            { value: 13, label: "Одежда/обувь" },
            { value: 14, label: "Климатич/вент. оборудование" },
            { value: 15, label: "Текстиль" },
            { value: 16, label: "Посуда/Керамика" },
            { value: 17, label: "Детские/спорт товары" },
            { value: 18, label: "Оборудование комплектующие" },
            { value: 19, label: "Досуг/развлечение" },
            { value: 20, label: "Опасные грузы/химия" },
            { value: 21, label: "Растения/цветы" },
            { value: 22, label: "Негабаритный товар" },
            { value: 23, label: "ПВХ/полимеры/минералы" },
            { value: 24, label: "Автоуслуги/клининг" },
            { value: 25, label: "Товары для животных" },
            { value: 26, label: "Транспорт/прицепная техника" },
            { value: 27, label: "Металлоизделия" },
            { value: 28, label: "Полиграфия/Бумага" },
            { value: 29, label: "ЖБИ/Камень" },
            { value: 30, label: "Садовая/складская техника" },
        ]],

    ]
);
export const NotificationTypeList = new Map(
    [
        ['param', [
            [0, "fas fa-calendar-alt text-success_alt"], //Calendar
            [1, "fas fa-calendar-alt text-danger"],
            [2, "fas fa-calendar-alt text-warning"],
            [3, "fas fa-city text-success_alt"], // selection
            [4, "fas fa-city text-danger"],
            [5, "fas fa-building text-warning"],
            [6, "fas fa-stream text-success_alt"],
            [7, "fas fa-stream text-danger"],
            [8, "fas fa-stream text-warning"],
        ]],

    ]
);