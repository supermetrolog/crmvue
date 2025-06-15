const position = {
    0: 'Акционер',
    1: 'Генеральный директор',
    2: 'Коммерческий директор',
    3: 'Финансовый директор',
    4: 'Операционный директор',
    5: 'Управляющий директор',
    6: 'Директор по логистике',
    7: 'Начальник склада',
    8: 'Менеджер по проектам',
    9: 'Охранник',
    10: 'Главный инженер',
    11: 'Секретарь',
    12: 'Представитель управляющей компании',
    13: 'Представитель на объекте',
    14: 'Бухгалтер',
    15: 'Юрист',
    16: 'Агент'
};

const wayOfCommunicate = {
    0: { label: 'Звонок', icon: 'fa-solid fa-phone' },
    1: { label: 'Viber', icon: 'fa-brands fa-viber' },
    2: { label: 'SMS', icon: 'fa-solid fa-comment' },
    3: { label: 'Telegram', icon: 'fa-solid fa-paper-plane' },
    4: { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
    5: { label: 'Email', icon: 'fa-solid fa-at' }
};

const positionList = [
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

const typeStatement = {
    GENERAL: 1,
    PERSONAL: 0
};

const statusStatement = {
    ACTIVE: 1,
    PASSIVE: 0
};

const passiveWhy = {
    0: 'Телефоны неактуальны',
    1: 'Не работает в компании',
    2: 'Заблокировано модератором',
    3: 'Иное',
    4: 'Компания архивирована'
};

export const contactOptions = {
    positionList,
    position,
    typeStatement,
    wayOfCommunicate,
    statusStatement,
    passiveWhy
};
