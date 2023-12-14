export const DropdownList = new Map([
    [
        "comming_theme",
        [
            {value: 0, name: "(не выбрана)"},
            {value: 1, name: "Гражданское право"},
            {value: 2, name: "Пенсия"},
            {value: 3, name: "Мошенничество"},
            {value: 4, name: "ДТП"},
            {value: 5, name: "Кредиты"},
            {value: 6, name: "Авто"},
        ],
    ],
    [
        "comming_status",
        [
            {value: 0, name: "(не выбран)"},
            {value: 1, name: "Договор"},
            {value: 2, name: "БК"},
            {value: 3, name: "Бесплатные документы"},
            {value: 4, name: "Шел в гос учреждение"},
            {value: 5, name: "Нет 18 лет"},
            {value: 6, name: "Ушел с ресепа"},
        ],
    ],
]);

export const Timeline = new Map([
    [
        "param",
        [
            [
                0,
                {
                    stepName: "Meeting",
                    name: "Знакомство",
                    class: "primary",
                    icon: "fas phone-alt",
                },
            ],
            [
                1,
                {
                    stepName: "Offers",
                    name: "Предложение",
                    class: "success",
                    icon: "fas city",
                },
            ],
            [
                2,
                {
                    stepName: "Feedback",
                    name: "Обратная связь",
                    class: "dark-warning",
                    icon: "fas bullhorn",
                },
            ],
            [
                3,
                {
                    stepName: "Inspection",
                    name: "Организация осмотров",
                    class: "light-blue",
                    icon: "fab watchman-monitoring",
                },
            ],
            [
                4,
                {
                    stepName: "Visit",
                    name: "Показы",
                    class: "blue-green",
                    icon: "fas eye",
                },
            ],
            [
                5,
                {
                    stepName: "Interest",
                    name: "Интерес к объектам",
                    class: "danger",
                    icon: "fas heartbeat",
                },
            ],
            [
                6,
                {
                    stepName: "Talk",
                    name: "Переговоры",
                    class: "pale-red",
                    icon: "fas comments-dollar",
                },
            ],
            [
                7,
                {
                    stepName: "Deal",
                    name: "Сделка",
                    class: "black",
                    icon: "far handshake",
                },
            ],
        ],
    ],
]);
export const CallerTypeList = new Map([
    [
        "param",
        [
            [0, "клиент"],
            [1, "собсвтенник"],
            [2, "подрядчик"],
            [3, "посредник"],
            [4, "клиент - нецелевой"],
            [5, "спам/реклама"],
            [6, "оценщик"],
        ],
    ],
]);
export const FeedbackList = new Map([
    [
        "param",
        [
            [0, "Email"],
            [1, "Звонок: Я"],
            [2, "Звонок: Он"],
            [3, "WhatsApp"],
            [4, "Viber"],
            [5, "SMS"],
            [6, "Telegram"],
        ],
    ],
    [
        "contact",
        [
            [0, "Звонок", "fas phone"],
            [1, "Viber", "fab viber"],
            [2, "SMS", "fas sms"],
            [3, "Telegram", "fab telegram"],
            [4, "WhatsApp", "fab whatsapp-square"],
            [5, "Email", "fas at"],
        ],
    ],
]);
export const WayOfSending = new Map([
    [
        "param",
        [
            [0, {name: "Email", icon: "fas at"}],
            [1, {name: "SMS", icon: "fas sms"}],
            [2, {name: "WhatsApp", icon: "fab whatsapp-square"}],
            [3, {name: "Telegram", icon: "fab telegram"}],
            [4, {name: "Viber", icon: "fab viber"}],
        ],
    ],
]);
export const CompanyCategories = new Map([
    [
        "param",
        [
            [0, "клиент"],
            [1, "посредник"],
            [2, "мониторинг"],
            [3, "собственник"],
            [4, "оценщик"],
            [5, "подрядчик"],
        ],
    ],
]);
export const PassiveWhy = new Map([
    [
        "param",
        [
            {value: 0, label: "Временно приостановлена"},
            {value: 1, label: "Заблокировано модератором"},
            {value: 2, label: "Иное"},
        ],
    ],
]);
export const PassiveWhyContact = new Map([
    [
        "param",
        [
            {value: 0, label: "Телефоны неактуальны"},
            {value: 1, label: "Не работает в компании"},
            {value: 2, label: "Заблокировано модератором"},
            {value: 3, label: "Иное"},
        ],
    ],
]);
export const PassiveWhyRequest = new Map([
    [
        "param",
        [
            {value: 0, label: "Заблокировано модератором"},
            {value: 1, label: "Сняли"},
            {value: 2, label: "Купили"},
            {value: 3, label: "Запрос устарел"},
            {value: 4, label: "Отложил поиск"},
            {value: 5, label: "Иное"},
        ],
    ],
]);
export const CompanyFormOrganization = new Map([
    [
        "param",
        [
            {value: 0, label: "ООО"},
            {value: 1, label: "ОАО"},
            {value: 2, label: "ЗАО"},
            {value: 3, label: "ПАО"},
            {value: 4, label: "АО"},
            {value: 5, label: "ИП"},
        ],
    ],
]);
export const ActivePassive = new Map([
    [
        "param",
        [
            [0, "пассив"],
            [1, "актив"],
        ],
    ],
]);
export const ActivePassiveFUCK = new Map([
    [
        "param",
        [
            [1, "актив"],
            [2, "пассив"],
        ],
    ],
]);
export const YesNo = new Map([
    [
        "param",
        [
            [0, "Нет"],
            [1, "Да"],
        ],
    ],
]);
export const OutsideMkad = new Map([
    [
        "param",
        [
            [0, "Внутри МКАД"],
            [1, "Снаружи МКАД"],
        ],
    ],
]);
export const YesNoFUCK = new Map([
    [
        "param",
        [
            [2, "Нет"],
            [1, "Да"],
        ],
    ],
]);
export const FloorTypesFUCK = new Map([
    [
        "param",
        [
            [0, "Асфальт"],
            [1, "Антипыль"],
            [2, "Бет. плиты"],
            [3, "Тех. плиты"],
            [4, "Стяжка"],
        ],
    ],
]);
export const unknownMovingDate = new Map([
    [
        "param",
        [
            [0, "рассматривает постоянно"],
            [1, "нет конкретики по сроку"],
        ],
    ],
]);
export const ObjectClassList = new Map([
    [
        "param",
        [
            [0, "A"],
            [1, "B"],
            [2, "C"],
            [3, "D"],
        ],
    ],
]);
export const GateTypeList = new Map([
    [
        "param",
        [
            [0, "Докового типа"],
            [1, "Нулевой уровень"],
            [2, "Авторампа"],
            [3, "Ж/Д рампа"],
        ],
    ],
]);
export const ObjectTypesGeneralList = new Map([
    [
        "param",
        [
            [0, "Склад"],
            [1, "Производство"],
            [2, "Участок"],
        ],
    ],
]);
export const RatingList = new Map([
    [
        "param",
        [
            [1, {name: "", icon: "far star"}],
            [3, {name: "", icon: "far star"}],
            [5, {name: "", icon: "far star"}],
        ],
    ],
]);
export const ObjectTypeList = new Map([
    [
        "warehouse",
        [
            [0, {name: "сухой склад", icon: "fa-solid fa-warehouse"}],
            [1, {name: "холодильник (0/+5С)", icon: "fa-solid fa-temperature-half"}],
            [2, {name: "морозильник (до -25С)", icon: "fa-solid fa-snowflake"}],
            [3, {name: "алкогольный склад", icon: "fa-solid fa-beer-mug-empty"}],
            [4, {name: "фармацевтический склад", icon: "fa-solid fa-suitcase-medical"}],
            [5, {name: "овощехранилище", icon: "fa-solid fa-lemon"}],
            [6, {name: "грузоперевозки/логистика", icon: "fa-solid fa-truck"}],
            [7, {name: "опасные грузы", icon: "fa-solid fa-skull-crossbones"}],
            [8, {name: "холодный склад", icon: "fas fa-warehouse alt"}],
            [9, {name: "архив", icon: "fas fa-archive"}],
            [10, {name: "досуг/развлечения", icon: "fas fa-volleyball-ball"}],
            [11, {name: "пищевое (склад)", icon: "fas fa-utensils"}],
        ],
    ],
    [
        "production",
        [
            [12, {name: "сборочное", icon: "fas fa-industry"}],
            [13, {name: "швейное", icon: "fab fa-shirtsinbulk"}],
            [14, {name: "пищевое (пр-во)", icon: "fas fa-utensils"}],
            [15, {name: "автосервис/мойка", icon: "fas fa-car"}],
            [16, {name: "деревообработка", icon: "fas fa-tree"}],
            [17, {name: "металлообработка", icon: "fas fa-gavel"}],
            [18, {name: "ЖБИ/камень", icon: "fas fa-chess-rook"}],
            [19, {name: "машиностроение", icon: "fas fa-cogs"}],
            [20, {name: "ПВХ/полимеры/минералы", icon: "fas fa-bong"}],
            [21, {name: "фарм/косметика/алкоголь", icon: "fas fa-pills"}],
            [22, {name: "1-3 класс опасности", icon: "fas fa-biohazard"}],
            [23, {name: "прачечная", icon: "fas fa-tshirt"}],
            [24, {name: "типография", icon: "fas fa-print"}],
        ],
    ],
    [
        "plot",
        [
            [25, {name: "хранение/стоянка", icon: "fas fa-pallet"}],
            [26, {name: "автосервис/услуги (стройка)", icon: "fas fa-burn"}],
            [27, {name: "производство/склад (стройка)", icon: "far fa-square"}],
            [28, {name: "торговый центр (стройка)", icon: "fas fa-store-alt"}],
            [29, {name: "производство 1-3 класс опасности (уч)", icon: "fas fa-biohazard"}],
            [30, {name: "досуг/развлечения (уч)", icon: "fas fa-volleyball-ball"}],
            [31, {name: "АЗС (стройка)", icon: "fas fa-gas-pump"}],
        ],
    ],
]);
export const TaxFormList = [
    {value: 1, label: "Triple Net"},
    {value: 2, label: "усн"},
    {value: 3, label: "с ндс"},
    {value: 4, label: "без ндс"},
];
export const RegionList = new Map([
    [
        "param",
        [
            {value: 0, label: "москва"},
            {value: 1, label: "московская область"},
            {value: 2, label: "ростовская область"},
            {value: 3, label: "калужская область"},
            {value: 4, label: "владимирская область"},
            {value: 5, label: "тульская область"},
            {value: 6, label: "ленинградская область"},
            {value: 7, label: "ярославская область"},
            {value: 8, label: "тверская область"},
            {value: 9, label: "новосибирская область"},
            {value: 10, label: "челябинский"},
            {value: 11, label: "воронежский"},
            {value: 12, label: "владимирский"},
            {value: 13, label: "нижний новгород"},
            {value: 14, label: "башкорторстан республика"},
            {value: 15, label: "волгоградская область"},
        ],
    ],
]);
export const DealTypeList = new Map([
    [
        "param",
        [
            {value: 0, label: "Аренда"},
            {value: 1, label: "Продажа"},
            {value: 2, label: "Ответ-хранение"},
            {value: 3, label: "Субаренда"},
        ],
    ],
]);
export const DirectionList = new Map([
    [
        "param",
        [
            [0, "С", "Север"],
            [1, "В", "Восток"],
            [2, "Ю", "Юг"],
            [3, "З", "Запад"],
            [4, "С-В", "Северо-Восток"],
            [5, "Ю-В", "Юго-Восток"],
            [6, "С-З", "Северо-Запад"],
            [7, "Ю-З", "Юго-Запад"],
        ],
    ],
]);
export const RoleList = new Map([
    [
        "param",
        [
            [1, "Просмотр"],
            [2, "Консультант"],
            [3, "Модератор"],
            [4, "Директор"],
            [5, "Админ"],
        ],
    ],
]);

export const OldDbDirectionList = {
    2: {short: "С", long: "Север"},
    3: {short: "В", long: "Восток"},
    4: {short: "Ю", long: "Юг"},
    5: {short: "З", long: "Запад"},
    6: {short: "С-В", long: "Северо-Восток"},
    7: {short: "Ю-В", long: "Юго-Восток"},
    8: {short: "С-З", long: "Северо-Запад"},
    9: {short: "Ю-З", long: "Юго-Запад"},
};
export const DistrictList = new Map([
    [
        "param",
        [
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
        ],
    ],
]);

export const PositionList = new Map([
    [
        "param",
        [
            {value: 0, label: "Акционер"},
            {value: 1, label: "Генеральный директор"},
            {value: 2, label: "Коммерческий директор"},
            {value: 3, label: "Финансовый директор"},
            {value: 4, label: "Операционный директор"},
            {value: 5, label: "Управляющий директор"},
            {value: 6, label: "Директор по логистике"},
            {value: 7, label: "Начальник склада"},
            {value: 8, label: "Менеджер по проектам"},
            {value: 9, label: "Охранник"},
            {value: 10, label: "Главный инженер"},
            {value: 11, label: "Секретарь"},
            {value: 12, label: "Представитель управляющей компании"},
            {value: 13, label: "Представитель на объекте"},
            {value: 14, label: "Бухгалтер"},
            {value: 15, label: "Юрист"},
            {value: 16, label: "Агент"},
        ],
    ],
]);
export const ActivityGroupList = new Map([
    [
        "param",
        [
            {value: 0, label: "Складирование"},
            {value: 1, label: "Производство"},
            {value: 2, label: "Строительство с привлечением"},
            {value: 3, label: "Строительство собственными силами"},
            {value: 4, label: "Услуги"},
            {value: 5, label: "Управление активами/арендный бизнес"},
            {value: 6, label: "Другое"},
        ],
    ],
]);
export const ActivityProfileList = new Map([
    [
        "param",
        [
            {value: 0, label: "Продукты/Напитки"},
            {value: 1, label: "ТНП"},
            {value: 2, label: "Стройматериалы"},
            {value: 3, label: "Электротовары"},
            {value: 4, label: "Грузоперевозка/логистика"},
            {value: 5, label: "Алкоголь"},
            {value: 6, label: "Фармакология"},
            {value: 7, label: "Автозапчасти"},
            {value: 8, label: "Инструменты"},
            {value: 9, label: "Архив"},
            {value: 10, label: "Косметика"},
            {value: 11, label: "Бытовая/оргтехника"},
            {value: 12, label: "Мебель"},
            {value: 13, label: "Одежда/обувь"},
            {value: 14, label: "Климатич/вент. оборудование"},
            {value: 15, label: "Текстиль"},
            {value: 16, label: "Посуда/керамика"},
            {value: 17, label: "Детские/спорт товары"},
            {value: 18, label: "Оборудование/комплектующие"},
            {value: 19, label: "Досуг/развлечение"},
            {value: 20, label: "Опасные грузы/химия"},
            {value: 21, label: "Растения/цветы"},
            {value: 22, label: "Негабаритный товар"},
            {value: 23, label: "ПВХ/полимеры/минералы"},
            {value: 24, label: "Автоуслуги/клининг"},
            {value: 25, label: "Товары для животных"},
            {value: 26, label: "Транспорт/прицепная техника"},
            {value: 27, label: "Металлоизделия"},
            {value: 28, label: "Полиграфия/бумага"},
            {value: 29, label: "ЖБИ/камень"},
            {value: 30, label: "Садовая/складская техника"},
            {value: 31, label: "Другое"},
        ],
    ],
]);

export const NotificationTypeList = new Map([
    [
        "param",
        [
            [0, "fas atom text-success_alt"], // SYSTEM
            [1, "fas atom text-warning"],
            [2, "fas atom text-danger"],
            [3, "fas home text-success_alt"], // COMPANY
            [4, "fas home text-warning"],
            [5, "fas home text-danger"],
            [6, "fas clipboard-list text-success_alt"], // REQUEST
            [7, "fas clipboard-list text-danger"],
            [8, "fas clipboard-list text-warning"],
            [9, "far calendar-alt text-success_alt"], // CALENDAR
            [10, "far calendar-alt text-danger"],
            [11, "far calendar-alt text-warning"],
            [12, "fas stream text-success_alt"], // TIMELINE
            [13, "fas stream text-danger"],
            [14, "fas stream text-warning"],
            [15, "fas binoculars text-success_alt"], // COLLECTION
            [16, "fas binoculars text-danger"],
            [17, "fas binoculars text-warning"],
        ],
    ],
]);

export const DealStatusType = {
    FOR_RENT: 1,
    RENTED_OUT: 2,
    SOLD_OUT: 3,
    UNKNOWN: 4,
    FREE: 5,
};

export const DealStatusList = {
    [DealStatusType.FOR_RENT]: "Сдается",
    [DealStatusType.RENTED_OUT]: "Сдано",
    [DealStatusType.SOLD_OUT]: "Продано",
    [DealStatusType.UNKNOWN]: "Неизвестно",
    [DealStatusType.FREE]: "Свободно, размечено",
};