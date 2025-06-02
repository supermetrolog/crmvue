import { AUTH_ROLE } from '@/const/role.js';

export const menu = [
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
    // {
    //     id: 7,
    //     name: 'Барахолка',
    //     icon: 'fa-solid fa-shop',
    //     url: '/equipments',
    //     key: 'equipments'
    // },
    {
        id: 12,
        name: 'Опросы',
        icon: 'fa-solid fa-square-poll-horizontal',
        url: '/surveys',
        key: 'surveys',
        internal: [
            {
                id: 0,
                name: 'Список',
                url: '/surveys',
                icon: 'fa-solid fa-square-poll-horizontal',
                exact: true
            },
            {
                id: 1,
                name: 'Черновики',
                url: '/surveys/drafts',
                icon: 'fa-solid fa-pen-ruler'
            }
        ]
    },
    {
        id: 10,
        name: 'Звонки',
        icon: 'fa-solid fa-phone-volume',
        url: '/calls',
        key: 'calls'
    },
    // {
    //     id: 2,
    //     name: 'Календарь',
    //     icon: 'fa-solid fa-calendar-days',
    //     url: '/calendar',
    //     key: 'calendar'
    // },
    {
        id: 11,
        name: 'Инструменты',
        icon: 'fa-solid fa-screwdriver-wrench',
        url: '/utilities',
        key: 'utilities',
        auth: new Set([AUTH_ROLE.MODERATOR, AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER])
    },
    {
        id: 5,
        name: 'Профиль',
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
                exact: true,
                auth: new Set([AUTH_ROLE.ADMIN])
            },
            {
                id: 1,
                name: 'Мессенджер',
                url: '/settings/messenger',
                icon: 'fa-solid fa-message'
            },
            { id: 2, name: 'Задачи', url: '/settings/tasks', icon: 'fa-solid fa-list-check' }
        ],
        auth: new Set([AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER])
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
        ],
        auth: new Set([AUTH_ROLE.ADMIN])
    }
];
