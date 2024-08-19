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

const statusList = [
    { value: 1, label: 'Новая' },
    { value: 2, label: 'В процессе' },
    { value: 3, label: 'Выполнено' },
    { value: 4, label: 'Отложено' }
];

const statusColor = {
    1: 'dashboard-bg-primary-l',
    2: 'dashboard-bg-warning-l',
    3: 'dashboard-bg-success-l',
    4: 'dashboard-bg-danger-l'
};

export const taskOptions = {
    statusTypes,
    statusNames,
    statusList,
    status,
    statusColor
};
