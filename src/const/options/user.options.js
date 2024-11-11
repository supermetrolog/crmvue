const statusStatement = {
    ACTIVE: 10,
    INACTIVE: 9,
    DELETED: 0
};

const role = {
    1: 'Просмотр',
    2: 'Консультант',
    3: 'Модератор',
    4: 'Директор',
    5: 'Админ',
    6: 'Системный'
};

const roleStatement = {
    VIEW_ONLY: 1,
    CONSULTANT: 2,
    MODERATOR: 3,
    DIRECTOR: 4,
    ADMIN: 5,
    SYSTEM: 6
};

export const userOptions = {
    statusStatement,
    role,
    roleStatement
};
