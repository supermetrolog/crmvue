export const Menu = {
    admin: [
        {
            id: 0,
            name: 'Компании',
            icon: 'fa-solid fa-industry',
            url: '/companies'
        },
        { id: 6, name: 'Предложка', icon: 'fas fa-city', url: '/offers' },
        {
            id: 1,
            name: 'Статистика',
            icon: 'fa-solid fa-chart-bar',
            url: '/statistic'
        },
        {
            id: 2,
            name: 'Календарь',
            icon: 'fa-solid fa-calendar',
            url: '/calendar'
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
        { id: 0, name: 'общая', url: '/statistic/', exact: true },
        { id: 1, name: 'сделка', url: '/statistic/deal' },
        { id: 2, name: 'брак', url: '/statistic/brak' }
    ],
    offers: [
        { id: 0, name: 'главная', url: '/offers/', exact: true },
        { id: 1, name: 'карта', url: '/offers/map' }
    ],
    companies: [
        { id: 0, name: 'главная', url: '/companies', exact: true },
        { id: 1, name: 'группы компаний', url: '/companies/groups' },
        { id: 2, name: 'запросы', url: '/companies/requests' },
        { id: 3, name: 'сделки', url: '/companies/deals' }
    ]
};
