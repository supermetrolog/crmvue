const statusTypes = {
    ALL: 0,
    NEW: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    CANCELED: 4,
    EXPIRED: 5,
    DELETED: 6
};

const statusNames = {
    0: 'all',
    1: 'new',
    2: 'in_Progress',
    3: 'completed',
    4: 'canceled',
    5: 'expired',
    6: 'deleted'
};

const status = {
    1: 'Новая',
    2: 'В процессе',
    3: 'Выполнено',
    4: 'Отложено'
};

export const taskOptions = {
    statusTypes,
    statusNames,
    status
};
