const type = {
    1: 'Подъемник',
    2: 'Грузовой лифт',
    3: 'Гидроплатформа'
};

const location = {
    1: 'Внутри',
    2: 'Снаружи'
};

const controls = {
    1: 'С пола',
    2: 'Из кабины'
};

const condition = {
    1: 'Рабочий',
    2: 'Требует ремонта',
    3: 'Требуется техобслуживание'
};

const conditionStatement = {
    WORKING: 1,
    NEED_REPAIR: 2,
    NEED_MAINTENANCE: 3
};

export const elevatorOptions = {
    type,
    location,
    controls,
    condition,
    conditionStatement
};
