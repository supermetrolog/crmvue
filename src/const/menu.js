export const Menu = {
    admin: [
        {
            id: 8,
            name: 'Дашборд',
            icon: 'fa-solid fa-chart-line',
            url: '/dashboard',
            internal: 'dashboard',
            key: 'dashboard'
        },
        {
            id: 9,
            name: 'Задачи',
            icon: 'fa-solid fa-list-check',
            url: '/tasks',
            key: 'tasks'
        },
        {
            id: 0,
            name: 'Компании',
            icon: 'fa-solid fa-industry',
            url: '/companies',
            internal: 'companies',
            key: 'company'
        },
        {
            id: 6,
            name: 'Предложка',
            icon: 'fas fa-city',
            url: '/offers',
            internal: 'offers',
            key: 'offers'
        },
        {
            id: 7,
            name: 'Барахолка',
            icon: 'fa-solid fa-shop',
            url: '/equipments',
            key: 'equipments'
        },
        {
            id: 2,
            name: 'Календарь',
            icon: 'fa-solid fa-calendar-days',
            url: '/calendar',
            exact: true
        },
        {
            id: 5,
            name: 'Аккаунт',
            icon: 'fa-solid fa-user-astronaut',
            url: '/account',
            key: 'account'
        },
        {
            id: 3,
            name: 'Настройки',
            icon: 'fas fa-cog',
            url: '/settings',
            key: 'settings',
            internal: 'settings'
        },
        {
            id: 4,
            name: 'Юзеры',
            icon: 'fas fa-users',
            url: '/users',
            key: 'users',
            internal: 'users'
        }
    ],
    agent: [
        {
            id: 8,
            name: 'Дашборд',
            icon: 'fa-solid fa-chart-line',
            url: '/dashboard',
            internal: 'dashboard',
            key: 'dashboard'
        },
        {
            id: 9,
            name: 'Задачи',
            icon: 'fa-solid fa-list-check',
            url: '/tasks',
            key: 'tasks'
        },
        {
            id: 0,
            name: 'Компании',
            icon: 'fa-solid fa-industry',
            url: '/companies',
            internal: 'companies',
            key: 'company'
        },
        {
            id: 6,
            name: 'Предложка',
            icon: 'fa-solid fa-city',
            url: '/offers',
            internal: 'offers',
            key: 'offers'
        },
        {
            id: 7,
            name: 'Барахолка',
            icon: 'fa-solid fa-shop',
            url: '/equipments',
            key: 'equipments'
        },
        {
            id: 2,
            name: 'Календарь',
            icon: 'fa-solid fa-calendar-days',
            url: '/calendar',
            exact: true,
            key: 'calendar'
        },
        {
            id: 5,
            name: 'Аккаунт',
            icon: 'fa-solid fa-user-astronaut',
            url: '/account',
            key: 'account'
        }
    ]
};
export const InternalMenu = {
    statistic: [
        { id: 0, name: 'Общая', url: '/statistic/', exact: true },
        { id: 1, name: 'Сделка', url: '/statistic/deal' },
        { id: 2, name: 'Брак', url: '/statistic/brak' }
    ],
    offers: [
        { id: 0, name: 'Главная', url: '/offers/', exact: true },
        { id: 1, name: 'Карта', url: '/offers/map' }
    ],
    companies: [
        { id: 0, name: 'Главная', url: '/companies', exact: true },
        { id: 1, name: 'Группы компаний', url: '/companies/groups' },
        { id: 2, name: 'Запросы', url: '/companies/requests' },
        { id: 3, name: 'Сделки', url: '/companies/deals' }
    ],
    dashboard: [
        { id: 0, name: 'Главная', url: '/dashboard', exact: true },
        { id: 3, name: 'Запросы', url: '/dashboard/requests' }
    ],
    settings: [
        { id: 0, name: 'Опросник', url: '/settings/survey' },
        { id: 1, name: 'Мессенджер', url: '/settings/messenger' },
        { id: 1, name: 'Задачи', url: '/settings/tasks' }
    ],
    users: [
        { id: 0, name: 'Управление', url: '/users' },
        { id: 1, name: 'Безопасность', url: '/users/sessions' }
    ]
};
