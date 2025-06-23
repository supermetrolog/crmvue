export const CONTACT_CALL_REASONS = {
    AVAILABLE: 1,
    DELETE: 2,
    MOVE: 3,
    BUSY: 4
};

export const CALL_TYPES = {
    OUTGOING: 0,
    INCOMING: 1
};

export const CALL_STATUSES = {
    MISSED: 0,
    COMPLETED: 1,
    BUSY: 2,
    NOT_AVAILABLE: 3,
    REJECTED: 4,
    ANGY: 5,
    BLOCKED: 6
};

export const CALL_STATUSES_TEXT = {
    [CALL_STATUSES.MISSED]: 'Клиент не взял трубку',
    [CALL_STATUSES.COMPLETED]: 'Клиент ответил',
    [CALL_STATUSES.BUSY]: 'Телефон занят',
    [CALL_STATUSES.NOT_AVAILABLE]: 'Телефон недоступен',
    [CALL_STATUSES.REJECTED]: 'Вызов отклонен',
    [CALL_STATUSES.ANGY]: 'Клиент отказался отвечать',
    [CALL_STATUSES.BLOCKED]: 'Телефон заблокирован'
};
