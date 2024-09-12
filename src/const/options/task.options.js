const statusTypes = {
    ALL: 0,
    NEW: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    CANCELED: 4,
    EXPIRED: 5,
    DELETED: 6
};

const clearStatusTypes = {
    NEW: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    CANCELED: 4,
    EXPIRED: 5
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
    1: 'dashboard-cl-primary',
    2: 'dashboard-cl-warning',
    3: 'dashboard-cl-success',
    4: 'dashboard-cl-danger'
};

const statusIcon = {
    1: 'fa-solid fa-plus',
    2: 'fa-regular fa-hourglass-half',
    3: 'fa-solid fa-check',
    4: 'fa-solid fa-pause'
};

const typeStatement = {
    RECEIVED: 'user_id',
    GIVEN: 'created_by_id',
    VIEWING: 'observer_id'
};

export const taskOptions = {
    statusTypes,
    statusNames,
    statusList,
    status,
    statusColor,
    statusIcon,
    typeStatement,
    clearStatusTypes
};
