const buttons = {
    tasks: {
        plural: [
            'У вас %d непрочитанная задача',
            'У вас %d непрочитанные задачи',
            'У вас %d непрочитанных задач'
        ],
        empty: 'У вас нет новых задач'
    },
    alerts: {
        plural: [
            'У вас %d новое уведомление',
            'У вас %d новых уведомления',
            'У вас %d новых уведомлений'
        ],
        empty: 'У вас нет новых уведомлений'
    },
    calls: {
        plural: [
            'У вас %d устаревший чат',
            'У вас %d устаревших чата',
            'У вас %d устаревших чатов'
        ],
        empty: 'У вас нет устаревших чатов'
    },
    calls_all: {
        plural: [
            'Всего в базе %d устаревший чат',
            'Всего в базе %d устаревших чата',
            'Всего в базе %d устаревших чатов'
        ],
        empty: 'У вас нет устаревших чатов'
    },
    messages: {
        plural: [
            'У вас %d непрочитанное сообщение',
            'У вас %d непрочитанных сообщения',
            'У вас %d непрочитанных сообщений'
        ],
        empty: 'У вас нет непрочитанных сообщений'
    }
};

const categories = {
    1: 'Аренда',
    2: 'Продажа',
    3: 'Развитие',
    4: 'Арендаторы'
};

const additions = {
    1: 'Task',
    2: 'Alert',
    3: 'Reminder'
};

const tabs = {
    OBJECTS: 'object',
    REQUESTS: 'request',
    USERS: 'user',
    COMPANIES: 'company'
};

const tabsPlural = {
    request: 'requests',
    company: 'companies',
    user: 'users',
    object: 'objects'
};

const tabsGroups = {
    [tabs.OBJECTS]: 'objects',
    [tabs.REQUESTS]: 'objects',
    [tabs.USERS]: 'users',
    [tabs.COMPANIES]: 'objects'
};

const tabFilters = {
    CALL: 'call',
    TASK: '-task',
    NOTIFICATION: '-notification',
    MESSAGE: '-message'
};

const dialogTypes = {
    USER: 'user',
    OBJECT: 'object',
    REQUEST: 'request',
    COMPANY: 'company'
};
export const SIZE_TO_COMPRESSION = 2097152; // 2 megabyte
export const MAX_FILES_COUNT = 20;
export const MAX_FILE_SIZE = 8388608; // 8 megabyte
export const MAX_FILE_SIZE_HUMANIZE = '8МБ';

export const messenger = {
    buttons,
    categories,
    additions,
    tabs,
    tabsGroups,
    tabsPlural,
    dialogTypes,
    tabFilters
};
