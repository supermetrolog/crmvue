const buttons = {
    tasks: {
        plural: [
            'У вас %d невыполненная задача',
            'У вас %d невыполненные задачи',
            'У вас %d невыполненных задач'
        ],
        empty: 'У вас нет невыполненных задач'
    },
    notifications: {
        plural: [
            'У вас %d новое уведомление',
            'У вас %d новых уведомления',
            'У вас %d новых уведомлений'
        ],
        empty: 'У вас нет новых уведомлений'
    },
    reminders: {
        plural: ['У вас %d напоминание', 'У вас %d напоминания', 'У вас %d напоминаний'],
        empty: 'У вас нет напоминаний'
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

export const messenger = {
    buttons
};
