export const Menu = {
    admin: [
        {
            id: 8,
            name: 'Дашборд',
            icon: 'fa-solid fa-chart-line',
            url: '/dashboard',
            key: 'dashboard',
            internal: [
                {
                    id: 0,
                    name: 'Сводка',
                    url: '/dashboard',
                    icon: 'fa-solid fa-chart-line',
                    exact: true
                },
                {
                    id: 1,
                    name: 'Запросы',
                    url: '/dashboard/requests',
                    icon: 'fa-solid fa-user-clock'
                }
            ]
        },
        {
            id: 0,
            name: 'Компании',
            icon: 'fa-solid fa-industry',
            url: '/companies',
            key: 'company',
            internal: [
                {
                    id: 0,
                    name: 'Выдача',
                    url: '/companies',
                    exact: true,
                    icon: 'fa-solid fa-industry'
                },
                {
                    id: 1,
                    name: 'Группы компаний',
                    url: '/companies/groups',
                    icon: 'fa-solid fa-people-group'
                },
                {
                    id: 2,
                    name: 'Запросы',
                    url: '/companies/requests',
                    icon: 'fa-solid fa-user-clock'
                },
                {
                    id: 3,
                    name: 'Сделки',
                    url: '/companies/deals',
                    icon: 'fa-regular fa-handshake'
                }
            ]
        },
        {
            id: 6,
            name: 'Предложка',
            icon: 'fas fa-city',
            url: '/offers',
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
            internal: [
                {
                    id: 0,
                    name: 'Опросник',
                    url: '/settings/survey',
                    icon: 'fa-solid fa-square-poll-horizontal',
                    exact: true
                },
                {
                    id: 1,
                    name: 'Мессенджер',
                    url: '/settings/messenger',
                    icon: 'fa-solid fa-message'
                },
                { id: 2, name: 'Задачи', url: '/settings/tasks', icon: 'fa-solid fa-list-check' }
            ]
        },
        {
            id: 4,
            name: 'Юзеры',
            icon: 'fas fa-users',
            url: '/users',
            key: 'users',
            internal: [
                {
                    id: 0,
                    name: 'Управление',
                    url: '/users',
                    icon: 'fa-solid fa-users',
                    exact: true
                },
                {
                    id: 1,
                    name: 'Безопасность',
                    url: '/users/sessions',
                    icon: 'fa-solid fa-shield-halved'
                }
            ]
        }
    ],
    agent: [
        {
            id: 8,
            name: 'Дашборд',
            icon: 'fa-solid fa-chart-line',
            url: '/dashboard',
            key: 'dashboard',
            internal: [
                {
                    id: 0,
                    name: 'Сводка',
                    url: '/dashboard',
                    icon: 'fa-solid fa-chart-line',
                    exact: true
                },
                {
                    id: 1,
                    name: 'Запросы',
                    url: '/dashboard/requests',
                    icon: 'fa-solid fa-user-clock'
                }
            ]
        },
        {
            id: 0,
            name: 'Компании',
            icon: 'fa-solid fa-industry',
            url: '/companies',
            key: 'company',
            internal: [
                {
                    id: 0,
                    name: 'Выдача',
                    url: '/companies',
                    icon: 'fa-solid fa-industry',
                    exact: true
                },
                {
                    id: 1,
                    name: 'Группы компаний',
                    url: '/companies/groups',
                    icon: 'fa-solid fa-people-group'
                },
                {
                    id: 2,
                    name: 'Запросы',
                    url: '/companies/requests',
                    icon: 'fa-solid fa-user-clock'
                },
                {
                    id: 3,
                    name: 'Сделки',
                    url: '/companies/deals',
                    icon: 'fa-regular fa-handshake'
                }
            ]
        },
        {
            id: 6,
            name: 'Предложка',
            icon: 'fa-solid fa-city',
            url: '/offers',
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
