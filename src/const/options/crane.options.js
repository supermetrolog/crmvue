const hoisting = {
    1: 'Подвесной',
    2: 'На тележке(опирается сверху)'
};

const location = {
    1: 'Внутри',
    2: 'Снаружи'
};

const controls = {
    1: 'С пола',
    2: 'Из кабины'
};

const beam = {
    1: 'Опорная',
    2: 'Подвесная',
    3: 'С передвижными опорами'
};

const beamAmount = {
    1: 'Одна',
    2: 'Две',
    3: 'Три',
    4: 'Четыре',
    5: 'Пять'
};

const condition = {
    1: 'Рабочий',
    2: 'Требует ремонта',
    3: 'Требуется техобслуживание'
};

const type = {
    1: 'Кран-балка',
    2: 'Мостовой',
    3: 'Козловой',
    4: 'Тельфер/Лебедка(неподвиж)'
};

const conditionStatement = {
    WORKING: 1,
    NEED_REPAIR: 2,
    NEED_MAINTENANCE: 3
};

export const craneOptions = {
    location,
    conditionStatement,
    beam,
    hoisting,
    controls,
    condition,
    type,
    beamAmount
};
