import { unitTypes } from '@/const/unitTypes';

export const Timeline = [
    {
        id: 0,
        visual_id: '1',
        name: 'Meeting',
        label: 'Знакомство с клиентом',
        shortLabel: 'Знакомство',
        icon: 'fa-solid fa-phone-alt',
        checkPause: point => point.negative === 1,
        steps: [
            {
                id: 0,
                visual_id: '1.1',
                name: 'MeetingActivity',
                label: 'Изучение деятельности',
                checkDone: point => point.additional === 1 || point.status === 1,
                checkPause: point => point.negative === 1 && point.additional !== 1
            },
            {
                id: 1,
                visual_id: '1.2',
                name: 'MeetingConfirmation',
                label: 'Подтверждение запроса',
                checkDone: point => point.status === 1,
                checkPause: point => point.negative === 1 && point.additional === 1,
                checkDisable: point =>
                    point.negative === 1 && point.additional === 0 && point.status !== 1
            }
        ]
    },
    {
        id: 1,
        visual_id: '2',
        name: 'Offers',
        label: 'Предложение',
        icon: 'fa-solid fa-city'
    },
    {
        id: 2,
        visual_id: '3',
        name: 'Feedback',
        label: 'Обратная связь',
        icon: 'fa-solid fa-bullhorn',
        steps: [
            {
                id: 0,
                name: 'FeedbackInterest',
                label: 'Интерес клиента',
                visual_id: '3.1',
                checkDone: point => point.objects.length > 0
            },
            {
                id: 1,
                visual_id: '3.2',
                name: 'FeedbackCommunication',
                label: 'Способ связи',
                checkDone: point => point.feedback_ways.length > 0
            }
        ]
    },
    {
        id: 3,
        visual_id: '4',
        name: 'Inspection',
        label: 'Организация осмотров',
        shortLabel: 'Осмотр',
        icon: 'fa-solid fa-map-location-dot',
        steps: [
            {
                id: 0,
                visual_id: '4.1',
                name: 'InspectionObjects',
                label: 'Объекты для просмотра',
                checkDone: point => point.objects.length > 0
            },
            {
                id: 1,
                visual_id: '4.2',
                name: 'InspectionSending',
                label: 'Маршрутный лист',
                checkDone: point => point.additional === 1
            }
        ]
    },
    {
        id: 4,
        visual_id: '5',
        name: 'Visit',
        label: 'Показы',
        icon: 'fa-solid fa-eye'
    },
    {
        id: 5,
        visual_id: '6',
        name: 'Interest',
        label: 'Интерес к объектам',
        shortLabel: 'Интерес',
        icon: 'fa-solid fa-heartbeat'
    },
    {
        id: 6,
        visual_id: '7',
        name: 'Talk',
        label: 'Переговоры',
        icon: 'fa-solid fa-comments-dollar'
    },
    {
        id: 7,
        visual_id: '8',
        name: 'Deal',
        label: 'Сделка',
        icon: 'fa-regular fa-handshake',
        steps: [
            {
                id: 0,
                visual_id: '8.1',
                name: 'DealDecision',
                label: 'Решение по объекту',
                checkDone: point => point.objects.length > 0
            },
            {
                id: 1,
                visual_id: '8.2',
                name: 'DealConfirmation',
                label: 'Заключение сделки',
                checkDone: point => point.status === 1
            }
        ]
    }
];

export const CallerTypeList = {
    0: 'клиент',
    1: 'собсвтенник',
    2: 'подрядчик',
    3: 'посредник',
    4: 'клиент - нецелевой',
    5: 'спам/реклама',
    6: 'оценщик'
};
export const FeedbackList = {
    0: { label: 'Email', icon: 'fa-solid fa-envelope-circle-check' },
    1: { label: 'Звонок: Я', icon: 'fa-solid fa-headset' },
    2: { label: 'Звонок: Он', icon: 'fa-solid fa-phone-volume' },
    3: { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
    4: { label: 'Viber', icon: 'fa-brands fa-viber' },
    5: { label: 'SMS', icon: 'fa-regular fa-comments' },
    6: { label: 'Telegram', icon: 'fa-brands fa-telegram' }
};

export const FeedbackIcons = {
    0: { name: 'Звонок', icon: 'fa-solid fa-phone' },
    1: { name: 'Viber', icon: null },
    2: { name: 'SMS', icon: 'fa-solid fa-comment' },
    3: { name: 'Telegram', icon: 'fa-solid fa-paper-plane' },
    4: { name: 'WhatsApp', icon: null },
    5: { name: 'Email', icon: 'fa-solid fa-at' }
};
export const WayOfSending = {
    0: { name: 'Email', icon: 'fas fa-at' },
    1: { name: 'SMS', icon: 'fas fa-sms' },
    2: { name: 'WhatsApp', icon: 'fab fa-whatsapp-square' },
    3: { name: 'Telegram', icon: 'fab fa-telegram' },
    4: { name: 'Viber', icon: 'fab fa-viber' }
};

export const WayOfSendingList = [
    { id: 0, name: 'Email', icon: 'fas fa-at' },
    { id: 1, name: 'SMS', icon: 'fas fa-sms' },
    { id: 2, name: 'WhatsApp', icon: 'fab fa-whatsapp-square' },
    { id: 3, name: 'Telegram', icon: 'fab fa-telegram' },
    { id: 4, name: 'Viber', icon: 'fab fa-viber' }
];

export const CompanyCategories = {
    0: 'Клиент',
    1: 'Посредник',
    2: 'Мониторинг',
    3: 'Собственник',
    4: 'Оценщик',
    5: 'Подрядчик'
};
export const PassiveWhy = [
    { value: 0, label: 'Временно приостановлена', short: 'Приостановлена' },
    { value: 1, label: 'Заблокировано модератором', short: 'Заблокирована' },
    { value: 2, label: 'Иное' },
    { value: 3, label: 'Компания ликвидирована', short: 'Ликвидирована' }
];
export const PassiveWhyContact = [
    { value: 0, label: 'Телефоны неактуальны' },
    { value: 1, label: 'Не работает в компании' },
    { value: 2, label: 'Заблокировано модератором' },
    { value: 3, label: 'Иное' },
    { value: 4, label: 'Компания архивирована' }
];
export const PassiveWhyRequest = [
    { value: 0, label: 'Заблокировано модератором' },
    { value: 1, label: 'Сняли' },
    { value: 2, label: 'Купили' },
    { value: 3, label: 'Запрос устарел' },
    { value: 4, label: 'Отложил поиск' },
    { value: 5, label: 'Иное' }
];
export const CompanyFormOrganization = [
    { value: 0, label: 'ООО' },
    { value: 1, label: 'ОАО' },
    { value: 2, label: 'ЗАО' },
    { value: 3, label: 'ПАО' },
    { value: 4, label: 'АО' },
    { value: 5, label: 'ИП' }
];
export const ActivePassive = {
    0: 'Пассив',
    1: 'Актив'
};
export const ActivePassiveFUCK = {
    1: 'Актив',
    2: 'Пассив'
};
export const YesNo = {
    0: 'Нет',
    1: 'Да'
};
export const OutsideMkad = {
    0: 'Внутри МКАД',
    1: 'Снаружи МКАД'
};
export const YesNoFUCK = {
    2: 'Нет',
    1: 'Да'
};
export const FloorTypesFUCK = {
    0: 'Асфальт',
    1: 'Антипыль',
    2: 'Бет. плиты',
    3: 'Тех. плиты',
    4: 'Стяжка'
};
export const unknownMovingDate = {
    0: 'Рассматривает постоянно',
    1: 'Нет конкретики по сроку'
};
export const ObjectClassList = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D'
};
export const GateTypeList = {
    0: 'Докового типа',
    1: 'Нулевой уровень',
    2: 'Авторампа',
    3: 'Ж/Д рампа'
};
export const ObjectTypesGeneralList = {
    0: 'Склад',
    1: 'Производство',
    2: 'Участок'
};
export const RatingList = {
    1: { name: '', icon: 'far star' },
    3: { name: '', icon: 'far star' },
    5: { name: '', icon: 'far star' }
};
export const ObjectTypeList = {
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
export const TaxFormList = [
    { value: 1, label: 'Triple Net' },
    { value: 2, label: 'усн' },
    { value: 3, label: 'с ндс' },
    { value: 4, label: 'без ндс' }
];
export const RegionList = [
    { value: 0, label: 'москва' },
    { value: 1, label: 'московская область' },
    { value: 2, label: 'ростовская область' },
    { value: 3, label: 'калужская область' },
    { value: 4, label: 'владимирская область' },
    { value: 5, label: 'тульская область' },
    { value: 6, label: 'ленинградская область' },
    { value: 7, label: 'ярославская область' },
    { value: 8, label: 'тверская область' },
    { value: 9, label: 'новосибирская область' },
    { value: 10, label: 'челябинский' },
    { value: 11, label: 'воронежский' },
    { value: 12, label: 'владимирский' },
    { value: 13, label: 'нижний новгород' },
    { value: 14, label: 'башкорторстан республика' },
    { value: 15, label: 'волгоградская область' }
];
export const DealTypeList = [
    { value: 0, label: 'Аренда' },
    { value: 1, label: 'Продажа' },
    { value: 2, label: 'Ответ-хранение' },
    { value: 3, label: 'Субаренда' }
];
export const DirectionList = {
    0: { short: 'С', full: 'Север' },
    1: { short: 'В', full: 'Восток' },
    2: { short: 'Ю', full: 'Юг' },
    3: { short: 'З', full: 'Запад' },
    4: { short: 'С-В', full: 'Северо-Восток' },
    5: { short: 'Ю-В', full: 'Юго-Восток' },
    6: { short: 'С-З', full: 'Северо-Запад' },
    7: { short: 'Ю-З', full: 'Юго-Запад' }
};
export const RoleList = {
    1: 'Просмотр',
    2: 'Консультант',
    3: 'Модератор',
    4: 'Директор',
    5: 'Админ',
    6: 'Системный'
};

export const OldDbDirectionList = {
    2: { short: 'С', long: 'Север' },
    3: { short: 'В', long: 'Восток' },
    4: { short: 'Ю', long: 'Юг' },
    5: { short: 'З', long: 'Запад' },
    6: { short: 'С-В', long: 'Северо-Восток' },
    7: { short: 'Ю-В', long: 'Юго-Восток' },
    8: { short: 'С-З', long: 'Северо-Запад' },
    9: { short: 'Ю-З', long: 'Юго-Запад' }
};
export const DistrictList = {
    0: 'ЦАО',
    1: 'ЗАО',
    2: 'СЗАО',
    3: 'ЮЗАО',
    4: 'ЮАО',
    5: 'САО',
    6: 'СВАО',
    7: 'ЮВАО',
    8: 'ВАО',
    9: 'НОВ. МОСКВА',
    10: 'ЗЕЛЕНОГРАД'
};

export const PositionList = [
    { value: 0, label: 'Акционер' },
    { value: 1, label: 'Генеральный директор' },
    { value: 2, label: 'Коммерческий директор' },
    { value: 3, label: 'Финансовый директор' },
    { value: 4, label: 'Операционный директор' },
    { value: 5, label: 'Управляющий директор' },
    { value: 6, label: 'Директор по логистике' },
    { value: 7, label: 'Начальник склада' },
    { value: 8, label: 'Менеджер по проектам' },
    { value: 9, label: 'Охранник' },
    { value: 10, label: 'Главный инженер' },
    { value: 11, label: 'Секретарь' },
    { value: 12, label: 'Представитель управляющей компании' },
    { value: 13, label: 'Представитель на объекте' },
    { value: 14, label: 'Бухгалтер' },
    { value: 15, label: 'Юрист' },
    { value: 16, label: 'Агент' }
];
export const ActivityGroupList = [
    { value: 0, label: 'Складирование' },
    { value: 1, label: 'Производство' },
    { value: 2, label: 'Инвестиции' },
    { value: 3, label: 'Строительство' },
    { value: 4, label: 'Услуги' },
    { value: 5, label: 'Управление активами' },
    { value: 6, label: 'Другое' }
];
export const ActivityProfileList = [
    { value: 0, label: 'Продукты/Напитки' },
    { value: 1, label: 'ТНП' },
    { value: 2, label: 'Стройматериалы' },
    { value: 3, label: 'Электротовары' },
    { value: 4, label: 'Грузоперевозка/логистика' },
    { value: 5, label: 'Алкоголь' },
    { value: 6, label: 'Фармакология' },
    { value: 7, label: 'Автозапчасти' },
    { value: 8, label: 'Инструменты' },
    { value: 9, label: 'Архив' },
    { value: 10, label: 'Косметика' },
    { value: 11, label: 'Бытовая/оргтехника' },
    { value: 12, label: 'Мебель' },
    { value: 13, label: 'Одежда/обувь' },
    { value: 14, label: 'Климатич/вент. оборудование' },
    { value: 15, label: 'Текстиль' },
    { value: 16, label: 'Посуда/керамика' },
    { value: 17, label: 'Детские/спорт товары' },
    { value: 18, label: 'Оборудование/комплектующие' },
    { value: 19, label: 'Досуг/развлечение' },
    { value: 20, label: 'Опасные грузы/химия' },
    { value: 21, label: 'Растения/цветы' },
    { value: 22, label: 'Негабаритный товар' },
    { value: 23, label: 'ПВХ/полимеры/минералы' },
    { value: 24, label: 'Автоуслуги/клининг' },
    { value: 25, label: 'Товары для животных' },
    { value: 26, label: 'Транспорт/прицепная техника' },
    { value: 27, label: 'Металлоизделия' },
    { value: 28, label: 'Полиграфия/бумага' },
    { value: 29, label: 'ЖБИ/камень' },
    { value: 30, label: 'Садовая/складская техника' },
    { value: 31, label: 'Другое' },
    { value: 32, label: 'Маркетплэйс' }
];

export const NotificationTypeList = {
    0: 'fa-solid fa-atom text-success_alt', // SYSTEM
    1: 'fa-solid fa-atom text-warning',
    2: 'fa-solid fa-atom text-danger',
    3: 'fa-solid fa-home text-success_alt', // COMPANY
    4: 'fa-solid fa-home text-warning',
    5: 'fa-solid fa-home text-danger',
    6: 'fa-solid fa-clipboard-list text-success_alt', // REQUEST
    7: 'fa-solid fa-clipboard-list text-danger',
    8: 'fa-solid fa-clipboard-list text-warning',
    9: 'fa-regular fa-calendar text-success_alt', // CALENDAR
    10: 'fa-regular fa-calendar text-danger',
    11: 'fa-regular fa-calendar text-warning',
    12: 'fas fa-stream text-success_alt', // TIMELINE
    13: 'fas fa-stream text-danger',
    14: 'fas fa-stream text-warning',
    15: 'fas fa-binoculars text-success_alt', // COLLECTION
    16: 'fas fa-binoculars text-danger',
    17: 'fas fa-binoculars text-warning'
};

export const PriceOptionTypes = {
    RUB_PER_SQUARE_METERS_PER_YEAR: 1,
    RUB_PER_SQUARE_METERS_PER_MONTH: 2,
    RUB_PER_MONTH: 3,
    RUB_PER_SQUARE_METERS: 4,
    RUB_PER_ALL: 5,
    RUB_PER_PALLET_PLACE_PER_DAY: 6
};

export const PriceOptionList = {
    [PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR]: {
        id: PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
        unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR,
        func: value => value
    },
    [PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_MONTH]: {
        id: PriceOptionTypes.RUB_PER_SQUARE_METERS_PER_MONTH,
        unitType: unitTypes.RUB_PER_SQUARE_METERS_PER_MONTH,
        func: value => Math.floor(value / 12)
    },
    [PriceOptionTypes.RUB_PER_MONTH]: {
        id: PriceOptionTypes.RUB_PER_MONTH,
        unitType: unitTypes.RUB_PER_MONTH
    },
    [PriceOptionTypes.RUB_PER_SQUARE_METERS]: {
        id: PriceOptionTypes.RUB_PER_SQUARE_METERS,
        unitType: unitTypes.RUB_PER_SQUARE_METERS,
        func: value => value
    },
    [PriceOptionTypes.RUB_PER_ALL]: {
        id: PriceOptionTypes.RUB_PER_ALL,
        unitType: unitTypes.RUB,
        func: (priceValue, areaValue) => priceValue * areaValue
    },
    [PriceOptionTypes.RUB_PER_PALLET_PLACE_PER_DAY]: {
        id: PriceOptionTypes.RUB_PER_PALLET_PLACE_PER_DAY,
        unitType: unitTypes.RUB_PER_PALLET_PLACE_PER_DAY,
        func: value => value
    }
};

export const TimelineRecommendedDescriptions = {
    RENT: {
        TOTAL: [
            'Вид сделки',
            'Цена +30%',
            'Площадь',
            'Направление и регион',
            'Высота потолков',
            'Качество пола',
            'Расстояние от МКАД +30%',
            'Тип ворот',
            'Этажность',
            'Наличие к/б',
            'Отапливаемость',
            'Электричество'
        ],
        MEDIUM: [
            'Вид сделки',
            'Площадь +/- 20%',
            'Высота потолков -2 метра',
            'Направление и регион',
            'Качество пола',
            'Расстояние от МКАД +30%',
            'Этажность',
            'Наличие к/б'
        ],
        LITE: ['Площадь объекта целиком', 'Направление и регион', 'Расстояние от МКАД +30%']
    },
    SALE: {
        TOTAL: [
            'Вид сделки',
            'Цена +30%',
            'Площадь +/- 30%',
            'Направление и регион',
            'Высота потолков',
            'Качество пола',
            'Расстояние от МКАД +30%',
            'Тип ворот',
            'Этажность',
            'Наличие к/б',
            'Отапливаемость',
            'Электричество'
        ],
        MEDIUM: ['Вид сделки', 'Цена +50%', 'Расстояние от МКАД +50%', 'Этажность'],
        LITE: ['Площадь объекта целиком +/- 30%', 'Направление и регион', 'Расстояние от МКАД +50%']
    }
};

export const weekdays = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресение'
];
