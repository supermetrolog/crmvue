import { AUTH_ROLE } from '@/const/role.js';
import { TRoutesNames } from '@/router/router';

export type MenuItemConfig = {
    name: string;
    icon: string;
    to: TRoutesNames;
    key?: string;
    auth?: Set<string | number>;
};

export type GeneralMenuItemConfig = MenuItemConfig & {
    internal?: InternalMenuItemConfig[];
};

export type InternalMenuItemConfig = MenuItemConfig & {
    exact?: boolean;
};

export const menu: GeneralMenuItemConfig[] = [
    {
        name: 'Дашборд',
        icon: 'fa-solid fa-chart-line',
        to: 'dashboard.main',
        internal: [
            {
                name: 'Сводка',
                to: 'dashboard.main',
                icon: 'fa-solid fa-chart-line',
                exact: true
            },
            {
                name: 'Запросы',
                to: 'dashboard.requests',
                icon: 'fa-solid fa-user-clock'
            }
        ]
    },
    {
        name: 'Задачи',
        icon: 'fa-solid fa-list-check',
        to: 'tasks'
    },
    {
        name: 'Компании',
        icon: 'fa-solid fa-industry',
        to: 'companies.table',
        internal: [
            {
                name: 'Выдача',
                to: 'companies.table',
                icon: 'fa-solid fa-industry',
                exact: true
            },
            {
                name: 'Группы компаний',
                to: 'companies.groups',
                icon: 'fa-solid fa-people-group'
            },
            {
                name: 'Запросы',
                to: 'companies.requests',
                icon: 'fa-solid fa-user-clock'
            },
            {
                name: 'Сделки',
                to: 'companies.deals',
                icon: 'fa-regular fa-handshake'
            }
        ]
    },
    {
        name: 'Предложка',
        icon: 'fa-solid fa-city',
        to: 'offers.table'
    },
    // {
    //     id: 7,
    //     name: 'Барахолка',
    //     icon: 'fa-solid fa-shop',
    //     url: '/equipments',
    //     key: 'equipments'
    // },
    {
        name: 'Опросы',
        icon: 'fa-solid fa-square-poll-horizontal',
        to: 'surveys.main',
        internal: [
            {
                name: 'Список',
                to: 'surveys.main',
                icon: 'fa-solid fa-square-poll-horizontal',
                exact: true
            },
            {
                name: 'Черновики',
                to: 'surveys.drafts',
                icon: 'fa-solid fa-pen-ruler'
            },
            {
                name: 'Статистика',
                to: 'surveys.statistics',
                icon: 'fa-solid fa-chart-simple',
                auth: new Set([AUTH_ROLE.MODERATOR, AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER])
            }
        ]
    },
    {
        name: 'Звонки',
        icon: 'fa-solid fa-phone-volume',
        to: 'calls'
    },
    // {
    //     id: 2,
    //     name: 'Календарь',
    //     icon: 'fa-solid fa-calendar-days',
    //     url: '/calendar',
    //     key: 'calendar'
    // },
    {
        name: 'Инструменты',
        icon: 'fa-solid fa-screwdriver-wrench',
        to: 'utilities',
        auth: new Set([AUTH_ROLE.MODERATOR, AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER])
    },
    {
        name: 'Профиль',
        icon: 'fa-solid fa-user-astronaut',
        to: 'account'
    },
    {
        name: 'Настройки',
        icon: 'fas fa-cog',
        to: 'settings',
        internal: [
            {
                name: 'Опросник',
                to: 'settings.survey',
                icon: 'fa-solid fa-square-poll-horizontal',
                exact: true,
                auth: new Set([AUTH_ROLE.ADMIN])
            },
            {
                name: 'Мессенджер',
                to: 'settings.messenger',
                icon: 'fa-solid fa-message'
            },
            { name: 'Задачи', to: 'settings.tasks', icon: 'fa-solid fa-list-check' }
        ],
        auth: new Set([AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER])
    },
    {
        name: 'Админка',
        icon: 'fas fa-poop',
        to: 'admin',
        auth: new Set([AUTH_ROLE.ADMIN]),
        internal: [
            {
                name: 'Туры',
                to: 'admin.tours',
                icon: 'fa-solid fa-plane-departure',
                exact: true
            },
            {
                name: 'Сообщения',
                to: 'admin.messages',
                icon: 'fa-solid fa-comment'
            },
            {
                name: 'Уведомления',
                to: 'admin.notifications',
                icon: 'fa-solid fa-bell'
            },
            {
                name: 'Интеграции',
                to: 'admin.integrations',
                icon: 'fa-solid fa-link'
            }
        ]
    },
    {
        name: 'Юзеры',
        icon: 'fas fa-users',
        to: 'users.table',
        internal: [
            {
                name: 'Управление',
                to: 'users.table',
                icon: 'fa-solid fa-users',
                exact: true
            },
            {
                name: 'Безопасность',
                to: 'users.sessions',
                icon: 'fa-solid fa-shield-halved'
            }
        ],
        auth: new Set([AUTH_ROLE.ADMIN, AUTH_ROLE.MODERATOR])
    }
];
