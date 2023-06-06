export const Menu = new Map([
  [
    "admin",
    [
      {
        id: 0,
        name: "Компании",
        icon: "fas fa-industry",
        url: "/companies",
      },
      { id: 6, name: "Предложка", icon: "fas fa-city", url: "/offers" },
      {
        id: 1,
        name: "Статистика",
        icon: "far fa-chart-bar",
        url: "/statistic",
      },
      {
        id: 2,
        name: "Календарь",
        icon: "fas fa-calendar-alt",
        url: "/calendar",
        exact: true,
      },
      { id: 3, name: "Настройки", icon: "fas fa-cog", url: "/setting" },
      { id: 4, name: "Юзеры", icon: "fas fa-users", url: "/users" },
      {
        id: 5,
        name: "Аккаунт",
        icon: "fas fa-user-astronaut",
        url: "/account",
      },
    ],
  ],
  [
    "agent",
    [
      {
        id: 0,
        name: "Компании",
        icon: "fas fa-industry",
        url: "/companies",
      },
      { id: 6, name: "Предложка", icon: "fas fa-city", url: "/offers" },
      {
        id: 5,
        name: "Аккаунт",
        icon: "fas fa-user-astronaut",
        url: "/account",
      },
    ],
  ],
]);
export const InternalMenu = new Map([
  [
    "statistic",
    [
      { id: 0, name: "общая", url: "/statistic/", exact: true },
      { id: 1, name: "сделка", url: "/statistic/deal" },
      { id: 2, name: "брак", url: "/statistic/brak" },
    ],
  ],
  [
    "offers",
    [
      { id: 0, name: "главная", url: "/offers/", exact: true },
      { id: 1, name: "карта", url: "/offers/map" },
    ],
  ],
  [
    "companies",
    [
      { id: 0, name: "главная", url: "/companies", exact: true },
      { id: 1, name: "группы компаний", url: "/companies/groups" },
      { id: 2, name: "запросы", url: "/companies/requests" },
      { id: 3, name: "сделки", url: "/companies/deals" },
    ],
  ],
  [
    "setting",
    [
      { id: 0, name: "все", url: "/setting/", exact: true },
      { id: 1, name: "в работе", url: "/setting/in-work" },
      { id: 2, name: "сделка", url: "/setting/deal" },
      { id: 3, name: "брак", url: "/setting/brak" },
    ],
  ],
]);

export const DropdownList = new Map([
  [
    "comming_theme",
    [
      { value: 0, name: "(не выбрана)" },
      { value: 1, name: "Гражданское право" },
      { value: 2, name: "Пенсия" },
      { value: 3, name: "Мошенничество" },
      { value: 4, name: "ДТП" },
      { value: 5, name: "Кредиты" },
      { value: 6, name: "Авто" },
    ],
  ],
  [
    "comming_status",
    [
      { value: 0, name: "(не выбран)" },
      { value: 1, name: "Договор" },
      { value: 2, name: "БК" },
      { value: 3, name: "Бесплатные документы" },
      { value: 4, name: "Шел в гос учреждение" },
      { value: 5, name: "Нет 18 лет" },
      { value: 6, name: "Ушел с ресепа" },
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
          icon: "fas fa-phone-alt",
        },
      ],
      [
        1,
        {
          stepName: "Offers",
          name: "Предложение",
          class: "success",
          icon: "fas fa-city",
        },
      ],
      [
        2,
        {
          stepName: "Feedback",
          name: "Обратная связь",
          class: "dark-warning",
          icon: "fas fa-bullhorn",
        },
      ],
      [
        3,
        {
          stepName: "Inspection",
          name: "Организация осмотров",
          class: "light-blue",
          icon: "fab fa-watchman-monitoring",
        },
      ],
      [
        4,
        {
          stepName: "Visit",
          name: "Показы",
          class: "blue-green",
          icon: "fas fa-eye",
        },
      ],
      [
        5,
        {
          stepName: "Interest",
          name: "Интерес к объектам",
          class: "danger",
          icon: "fas fa-heartbeat",
        },
      ],
      [
        6,
        {
          stepName: "Talk",
          name: "Переговоры",
          class: "pale-red",
          icon: "fas fa-comments-dollar",
        },
      ],
      [
        7,
        {
          stepName: "Deal",
          name: "Сделка",
          class: "black",
          icon: "far fa-handshake",
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
      [0, "Звонок", "fas fa-phone"],
      [1, "Viber", "fab fa-viber"],
      [2, "SMS", "fas fa-sms"],
      [3, "Telegram", "fab fa-telegram"],
      [4, "WhatsApp", "fab fa-whatsapp-square"],
      [5, "Email", "fas fa-at"],
    ],
  ],
]);
export const WayOfSending = new Map([
  [
    "param",
    [
      [0, { name: "Email", icon: "fas fa-at" }],
      [1, { name: "SMS", icon: "fas fa-sms" }],
      [2, { name: "WhatsApp", icon: "fab fa-whatsapp-square" }],
      [3, { name: "Telegram", icon: "fab fa-telegram" }],
      [4, { name: "Viber", icon: "fab fa-viber" }],
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
      { value: 0, label: "Временно приостановлена" },
      { value: 1, label: "Заблокировано модератором" },
      { value: 2, label: "Иное" },
    ],
  ],
]);
export const PassiveWhyContact = new Map([
  [
    "param",
    [
      { value: 0, label: "Телефоны неактуальны" },
      { value: 1, label: "Не работает в компании" },
      { value: 2, label: "Заблокировано модератором" },
      { value: 3, label: "Иное" },
    ],
  ],
]);
export const PassiveWhyRequest = new Map([
  [
    "param",
    [
      { value: 0, label: "Заблокировано модератором" },
      { value: 1, label: "Сняли" },
      { value: 2, label: "Купили" },
      { value: 3, label: "Запрос устарел" },
      { value: 4, label: "Отложил поиск" },
      { value: 5, label: "Иное" },
    ],
  ],
]);
export const CompanyFormOrganization = new Map([
  [
    "param",
    [
      { value: 0, label: "ООО" },
      { value: 1, label: "ОАО" },
      { value: 2, label: "ЗАО" },
      { value: 3, label: "ПАО" },
      { value: 4, label: "АО" },
      { value: 5, label: "ИП" },
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
      [1, "асфальт"],
      [2, "антипыль"],
      [3, "бет. плиты"],
      [4, "тех. плиты"],
      [5, "стяжка"],
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
      [0, "докового типа"],
      [1, "нулевой уровень"],
      [2, "авторампа"],
      [3, "ж/д рампа"],
    ],
  ],
]);
export const ObjectTypesGeneralList = new Map([
  [
    "param",
    [
      [0, "склад"],
      [1, "производство"],
      [2, "участок"],
    ],
  ],
]);
export const RatingList = new Map([
  [
    "param",
    [
      [1, { name: "", icon: "far fa-star" }],
      [3, { name: "", icon: "far fa-star" }],
      [5, { name: "", icon: "far fa-star" }],
    ],
  ],
]);
export const ObjectTypeList = new Map([
  [
    "warehouse",
    [
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
      [11, { name: "пищевое (склад)", icon: "fas fa-utensils" }],
    ],
  ],
  [
    "production",
    [
      [12, { name: "сборочное", icon: "fas fa-industry" }],
      [13, { name: "швейное", icon: "fab fa-shirtsinbulk" }],
      [14, { name: "пищевое (пр-во)", icon: "fas fa-utensils" }],
      [15, { name: "автосервис/мойка", icon: "fas fa-car" }],
      [16, { name: "деревообработка", icon: "fas fa-tree" }],
      [17, { name: "металлообработка", icon: "fas fa-gavel" }],
      [18, { name: "ЖБИ/камень", icon: "fas fa-chess-rook" }],
      [19, { name: "машиностроение", icon: "fas fa-cogs" }],
      [20, { name: "ПВХ/полимеры/минералы", icon: "fas fa-bong" }],
      [21, { name: "фарм/косметика/алкоголь", icon: "fas fa-pills" }],
      [22, { name: "1-3 класс опасности", icon: "fas fa-biohazard" }],
      [23, { name: "прачечная", icon: "fas fa-tshirt" }],
      [24, { name: "типография", icon: "fas fa-print" }],
    ],
  ],
  [
    "plot",
    [
      [25, { name: "хранение/стоянка", icon: "fas fa-pallet" }],
      [26, { name: "автосервис/услуги (стройка)", icon: "fas fa-burn" }],
      [27, { name: "производство/склад (стройка)", icon: "far fa-square" }],
      [28, { name: "торговый центр (стройка)", icon: "fas fa-store-alt" }],
      [
        29,
        {
          name: "производство 1-3 класс опасности (уч)",
          icon: "fas fa-biohazard",
        },
      ],
      [30, { name: "досуг/развлечения (уч)", icon: "fas fa-volleyball-ball" }],
      [31, { name: "АЗС (стройка)", icon: "fas fa-gas-pump" }],
    ],
  ],
]);

// export const ObjectTypeList = new Map(
//     [
//         ['warehouse', [
//             [0, { name: "сухой склад", icon: "fas fa-warehouse" }],
//             [1, { name: "холодильник (0/+5С)", icon: "fas fa-thermometer-half" }],
//             [2, { name: "морозильник (до -25С)", icon: "fas fa-snowflake" }],
//             [3, { name: "алкогольрный склад", icon: "fas fa-beer" }],
//             [4, { name: "фармацевтический склад", icon: "fas fa-medkit" }],
//             [5, { name: "овощехранилище", icon: "fas fa-lemon" }],
//             [6, { name: "грузоперевозки/логистика", icon: "fas fa-truck" }],
//             [7, { name: "опасные грузы", icon: "fas fa-skull-crossbones" }],
//             [8, { name: "холодный склад", icon: "fas fa-warehouse alt" }],
//             [9, { name: "архив", icon: "fas fa-archive" }],
//             [10, { name: "досуг/развлечения", icon: "fas fa-volleyball-ball" }],
//         ]],
//         ['production', [
//             [11, { name: "сборочное", icon: "fas fa-industry" }],
//             [12, { name: "швейное", icon: "fab fa-shirtsinbulk" }],
//             [13, { name: "пищевое", icon: "fas fa-utensils" }],
//             [14, { name: "автосервис/мойка", icon: "fas fa-car" }],
//             [15, { name: "деревообработка", icon: "fas fa-tree" }],
//             [16, { name: "металлообработка", icon: "fas fa-gavel" }],
//             [17, { name: "ЖБИ/камень", icon: "fas fa-chess-rook" }],
//             [18, { name: "машиностроение", icon: "fas fa-cogs" }],
//             [19, { name: "ПВХ/полимеры/минералы", icon: "fas fa-bong" }],
//             [20, { name: "фарм/косметика/алкоголь", icon: "fas fa-pills" }],
//             [21, { name: "1-3 класс опасности", icon: "fas fa-biohazard" }],
//             [22, { name: "прачечная", icon: "fas fa-tshirt" }],
//             [23, { name: "типография", icon: "fas fa-print" }],
//         ]],
//         ['plot', [
//             [24, { name: "хранение/стоянка", icon: "fas fa-pallet" }],
//             [25, { name: "автосервис/услуги (стройка)", icon: "fas fa-burn" }],
//             [26, { name: "производство/склад (стройка)", icon: "far fa-square" }],
//             [27, { name: "торговый центр (стройка)", icon: "fas fa-store-alt" }],
//             [28, { name: "производство 1-3 класс опасности (уч)", icon: "fas fa-biohazard" }],
//             [29, { name: "досуг/развлечения (уч)", icon: "fas fa-volleyball-ball" }],
//             [30, { name: "АЗС (стройка)", icon: "fas fa-gas-pump" }],
//         ]],
//     ]
// );
export const TaxFormList = [
  { value: 1, label: "Triple Net" },
  { value: 2, label: "усн" },
  { value: 3, label: "с ндс" },
  { value: 4, label: "без ндс" },
];
export const RegionList = new Map([
  [
    "param",
    [
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
      { value: 15, label: "волгоградская область" },
    ],
  ],
]);
export const DealTypeList = new Map([
  [
    "param",
    [
      { value: 0, label: "Аренда" },
      { value: 1, label: "Продажа" },
      { value: 2, label: "Ответ-хранение" },
      { value: 3, label: "Субаренда" },
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
  2: { short: "С", long: "Север" },
  3: { short: "В", long: "Восток" },
  4: { short: "Ю", long: "Юг" },
  5: { short: "З", long: "Запад" },
  6: { short: "С-В", long: "Северо-Восток" },
  7: { short: "Ю-В", long: "Юго-Восток" },
  8: { short: "С-З", long: "Северо-Запад" },
  9: { short: "Ю-З", long: "Юго-Запад" },
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
    ],
  ],
]);
export const ActivityGroupList = new Map([
  [
    "param",
    [
      { value: 0, label: "Складирование" },
      { value: 1, label: "Производство" },
      { value: 2, label: "Строительство с привлечением" },
      { value: 3, label: "Строительство собственными силами" },
      { value: 4, label: "Услуги" },
      { value: 5, label: "Управление активами/арендный бизнес" },
      { value: 6, label: "Другое" },
    ],
  ],
]);
export const ActivityProfileList = new Map([
  [
    "param",
    [
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
      { value: 16, label: "Посуда/керамика" },
      { value: 17, label: "Детские/спорт товары" },
      { value: 18, label: "Оборудование/комплектующие" },
      { value: 19, label: "Досуг/развлечение" },
      { value: 20, label: "Опасные грузы/химия" },
      { value: 21, label: "Растения/цветы" },
      { value: 22, label: "Негабаритный товар" },
      { value: 23, label: "ПВХ/полимеры/минералы" },
      { value: 24, label: "Автоуслуги/клининг" },
      { value: 25, label: "Товары для животных" },
      { value: 26, label: "Транспорт/прицепная техника" },
      { value: 27, label: "Металлоизделия" },
      { value: 28, label: "Полиграфия/бумага" },
      { value: 29, label: "ЖБИ/камень" },
      { value: 30, label: "Садовая/складская техника" },
      { value: 31, label: "Другое" },
    ],
  ],
]);

//<i class="fas fa-binoculars"></i>
//<i class="fas fa-clipboard-list"></i>
//<i class="fas fa-atom"></i>
//<i class="fas fa-layer-group"></i>
export const NotificationTypeList = new Map([
  [
    "param",
    [
      [0, "fas fa-atom text-success_alt"], // SYSTEM
      [1, "fas fa-atom text-warning"],
      [2, "fas fa-atom text-danger"],
      [3, "fas fa-home text-success_alt"], // COMPANY
      [4, "fas fa-home text-warning"],
      [5, "fas fa-home text-danger"],
      [6, "fas fa-clipboard-list text-success_alt"], // REQUEST
      [7, "fas fa-clipboard-list text-danger"],
      [8, "fas fa-clipboard-list text-warning"],
      [9, "far fa-calendar-alt text-success_alt"], // CALENDAR
      [10, "far fa-calendar-alt text-danger"],
      [11, "far fa-calendar-alt text-warning"],
      [12, "fas fa-stream text-success_alt"], // TIMELINE
      [13, "fas fa-stream text-danger"],
      [14, "fas fa-stream text-warning"],
      [15, "fas fa-binoculars text-success_alt"], // COLLECTION
      [16, "fas fa-binoculars text-danger"],
      [17, "fas fa-binoculars text-warning"],
    ],
  ],
]);

// export const UnitTypesList = new Map([
//   [1, "м<sup>2</sup>"],
//   [2, "₽/мес"],
//   [3, "м"],
//   [4, "кВт"],
//   [5, "м<sup>3</sup>/ч"],
//   [6, "бар"],
//   [7, "этаж(а)"],
//   [8, "м<sup>2</sup>/год"],
//   [9, "₽"],
//   [10, "мес"],
//   [11, "%"],
//   [12, "год"],
//   [13, "в год"],
// ]);

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
