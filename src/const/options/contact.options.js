const wayOfCommunicate = {
    0: { label: 'Звонок', icon: 'fa-solid fa-phone' },
    1: { label: 'Viber', icon: 'fa-brands fa-viber' },
    2: { label: 'SMS', icon: 'fa-solid fa-comment' },
    3: { label: 'Telegram', icon: 'fa-solid fa-paper-plane' },
    4: { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
    5: { label: 'Email', icon: 'fa-solid fa-at' }
};

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
    typeStatement,
    wayOfCommunicate,
    statusStatement,
    passiveWhy
};
