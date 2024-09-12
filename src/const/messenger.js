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

export const messenger = {
    buttons,
    categories,
    additions
};
