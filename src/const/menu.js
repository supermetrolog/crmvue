export const Menu = {
    admin: [
        {
            id: 8,
            name: 'Дашборд',
            icon: 'fa-solid fa-chart-line',
            url: '/dashboard'
        },
        {
            id: 0,
            name: 'Компании',
            icon: 'fa-solid fa-industry',
            url: '/companies'
        },
        { id: 6, name: 'Предложка', icon: 'fas fa-city', url: '/offers' },
        {
            id: 7,
            name: 'Барахолка',
            icon: 'fa-solid fa-shop',
            url: '/equipments'
        },
        {
            id: 2,
            name: 'Календарь',
            icon: 'fa-solid fa-calendar-days',
            url: '/calendar',
            exact: true
        },
        { id: 3, name: 'Настройки', icon: 'fas fa-cog', url: '/settings' },
        { id: 4, name: 'Юзеры', icon: 'fas fa-users', url: '/users' },
        {
            id: 5,
            name: 'Аккаунт',
            icon: 'fa-solid fa-user-astronaut',
            url: '/account'
        }
    ],
    agent: [
        {
            id: 8,
            name: 'Дашборд',
            icon: 'fa-solid fa-chart-line',
            url: '/dashboard'
        },
        {
            id: 0,
            name: 'Компании',
            icon: 'fa-solid fa-industry',
            url: '/companies'
        },
        {
            id: 6,
            name: 'Предложка',
            icon: 'fa-solid fa-city',
            url: '/offers'
        },
        {
            id: 7,
            name: 'Барахолка',
            icon: 'fa-solid fa-shop',
            url: '/equipments'
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
            url: '/account'
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
        { id: 1, name: 'Сводка', url: '/dashboard/company' },
        { id: 2, name: 'Задачи', url: '/dashboard/tasks/board' },
        { id: 3, name: 'Запросы', url: '/dashboard/requests' }
    ]
};
