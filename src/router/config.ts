import { AUTH_ROLE } from '@/const/role';
import CompaniesMain from '@/views/Companies/Companies.vue';
import CompaniesView from '@/views/Companies/Company.vue';
import CompaniesList from '@/views/Companies/Main.vue';
import OffersView from '@/views/Offers/Offers.vue';
import OffersMain from '@/views/Offers/Main.vue';
import Unavailable from '@/views/Unavailable.vue';
import { RouteRecordRaw } from 'vue-router';

export type AppRouteRecordMeta = {
    layout?: string;
    auth?: {
        isAuth?: boolean;
        roles?: (string | number)[];
    };
    title?: string | string[];
};

type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & {
    name: string;
    children?: readonly AppRouteRecord[];
    meta?: AppRouteRecordMeta;
};

export type GetRouteName<T extends AppRouteRecord> = T extends {
    children: readonly AppRouteRecord[];
}
    ? T['name'] | GetRoutesNames<T['children']>
    : T['name'];

export type GetRoutesNames<T extends readonly AppRouteRecord[]> = GetRouteName<T[number]>;

export const routes = [
    {
        path: '/statistic',
        name: 'statistic',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Статистика'
        },
        component: () => import('../views/Statistic.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        meta: {
            layout: 'default',
            auth: { isAuth: true, roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER] },
            title: 'Настройки'
        },
        component: () => import('../views/Settings/View.vue'),
        redirect: { name: 'settings.survey' },
        children: [
            {
                path: 'survey',
                name: 'settings.survey',
                meta: {
                    title: ['Опросник', 'Настройки']
                },
                component: () => import('../views/Settings/Survey.vue')
            },
            {
                path: 'messenger',
                name: 'settings.messenger',
                meta: {
                    title: ['Мессенджер', 'Настройки']
                },
                component: () => import('../views/Settings/Messenger.vue')
            },
            {
                path: 'tasks',
                name: 'settings.tasks',
                meta: {
                    title: ['Задачи', 'Настройки']
                },
                component: () => import('../views/Settings/Tasks.vue')
            }
        ]
    },
    {
        path: '/utilities',
        name: 'utilities',
        meta: {
            title: 'Инструменты модератора',
            auth: { isAuth: true, roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER, AUTH_ROLE.MODERATOR] }
        },
        component: () => import('../views/Settings/Utilities.vue')
    },
    {
        path: '/calendar',
        name: 'calendar',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Календарь'
        },
        component: () => import('../views/Calendar.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            layout: 'login',
            auth: { isAuth: false },
            title: 'Авторизация'
        },
        component: () => import('../views/Login.vue')
    },
    {
        path: '/companies',
        name: 'companies',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Список компаний'
        },
        component: CompaniesMain,
        children: [
            {
                path: '/companies/:id',
                name: 'company',
                meta: {
                    title: 'Обзор компании'
                },
                component: CompaniesView
            },
            {
                path: '',
                name: 'companies.table',
                component: CompaniesList
            },
            {
                path: 'requests',
                name: 'companies.requests',
                meta: {
                    title: 'Запросы клиентов'
                },
                component: () => import('../views/Companies/Requests.vue')
            },
            {
                path: 'deals',
                name: 'companies.deals',
                meta: {
                    title: 'Сделки'
                },
                component: () => import('../views/Companies/Deals.vue')
            },
            {
                path: 'groups',
                name: 'companies.groups',
                meta: {
                    title: 'Группы компаний'
                },
                component: () => import('../views/Companies/Groups.vue')
            }
        ]
    },
    {
        path: '/users',
        name: 'users',
        meta: {
            layout: 'default',
            auth: { isAuth: true, roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER, AUTH_ROLE.MODERATOR] },
            title: 'Сотрудники'
        },
        component: () => import('../views/Users/Users.vue'),
        children: [
            {
                path: '',
                name: 'users.table',
                meta: {
                    title: ['Управление', 'Сотрудники']
                },
                component: () => import('../views/Users/Main.vue')
            },
            {
                path: 'sessions',
                name: 'users.sessions',
                meta: {
                    title: ['Безопасность', 'Сотрудники']
                },
                component: () => import('../views/Users/Sessions.vue')
            },
            {
                path: ':id',
                name: 'users.view',
                component: () => import('../views/Users/User.vue')
            }
        ]
    },
    {
        path: '/account',
        name: 'account',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Личный кабинет'
        },
        component: () => import('../views/Account/View.vue'),
        redirect: { name: 'profile' },
        children: [
            {
                path: '',
                name: 'profile',
                component: () => import('../views/Account/Profile.vue')
            },
            {
                path: 'sessions',
                name: 'profile.sessions',
                meta: {
                    title: ['Безопасность', 'Личный кабинет']
                },
                component: () => import('../views/Account/Sessions.vue')
            },
            {
                path: 'edit',
                name: 'profile.edit',
                meta: {
                    title: ['Редактирование', 'Личный кабинет']
                },
                component: () => import('../views/Account/Edit.vue')
            },
            {
                path: 'edit-password',
                name: 'profile.edit-password',
                meta: {
                    title: ['Смена пароля', 'Личный кабинет']
                },
                component: () => import('../views/Account/EditPassword.vue')
            },
            {
                path: 'consultants',
                name: 'profile.consultants',
                meta: {
                    title: 'Коллеги'
                },
                component: () => import('../views/Account/Consultants.vue')
            },
            {
                path: 'integrations',
                name: 'profile.integrations',
                meta: {
                    title: ['Интеграции', 'Личный кабинет']
                },
                component: () => import('../views/Account/Integrations.vue')
            }
        ]
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Дашборд'
        },
        component: () => import('../views/Dashboard/View.vue'),
        children: [
            {
                path: '',
                name: 'dashboard.main',
                component: () => import('../views/Dashboard/Main.vue')
            },
            {
                path: 'requests',
                name: 'dashboard.requests',
                meta: {
                    title: ['Запросы', 'Дашборд']
                },
                component: () => import('../views/Dashboard/Requests.vue')
            }
        ]
    },
    {
        path: '/tasks',
        name: 'tasks',
        meta: {
            layout: 'default',
            title: 'Задачи',
            auth: { isAuth: true }
        },
        component: () => import('../views/Tasks/Main.vue')
    },
    {
        path: '/offers',
        name: 'offers',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Предложения'
        },
        component: OffersView,
        children: [
            {
                path: '',
                name: 'offers.table',
                component: OffersMain
            }
        ]
    },
    {
        path: '/complex/:complex_id',
        name: 'complex.view',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Просмотр комплекса'
        },
        component: () => import('@/views/ComplexView.vue')
    },
    {
        path: '/equipments',
        name: 'equipments',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Барахолка'
        },
        component: () => import('../views/Equipments.vue')
    },
    {
        path: '/calls',
        name: 'calls',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Звонки'
        },
        component: () => import('../views/Calls.vue')
    },
    {
        path: '/surveys',
        name: 'surveys',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Опросы'
        },
        children: [
            {
                path: '',
                name: 'surveys.main',
                component: () => import('../views/Surveys/Surveys.vue')
            },
            {
                path: 'drafts',
                name: 'surveys.drafts',
                meta: {
                    title: ['Черновики', 'Опросы']
                },
                component: () => import('../views/Surveys/Drafts.vue')
            },
            {
                path: 'statistics',
                name: 'surveys.statistics',
                meta: {
                    title: ['Результаты', 'Опросы'],
                    auth: {
                        isAuth: true,
                        roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER, AUTH_ROLE.MODERATOR]
                    }
                },
                component: () => import('../views/Surveys/Statistics.vue')
            }
        ]
    },
    {
        path: '/admin',
        name: 'admin',
        meta: {
            layout: 'default',
            auth: { isAuth: true, roles: [AUTH_ROLE.ADMIN] },
            title: 'Админка'
        },
        component: () => import('../views/Admin/View.vue'),
        redirect: { name: 'admin.tours' },
        children: [
            {
                path: 'tours',
                name: 'admin.tours',
                meta: {
                    title: ['Админка', 'Туры']
                },
                component: () => import('../views/Admin/Tours.vue')
            },
            {
                path: 'messages',
                name: 'admin.messages',
                meta: {
                    title: ['Админка', 'Сообщения']
                },
                component: () => import('../views/Admin/ChatMemberMessages.vue')
            },
            {
                path: 'notifications',
                name: 'admin.notifications',
                meta: {
                    title: ['Админка', 'Уведомления']
                },
                component: () => import('../views/Admin/Notifications.vue')
            },
            {
                path: 'integrations',
                name: 'admin.integrations',
                meta: {
                    title: ['Админка', 'Интеграции']
                },
                component: () => import('../views/Admin/Integrations.vue')
            }
        ]
    },
    {
        path: '/unavailable',
        name: 'unavailable',
        meta: {
            layout: 'empty',
            auth: { isAuth: false },
            title: 'Сервис недоступен'
        },
        component: Unavailable
    },
    {
        path: '/:catchAll(.*)',
        name: 'notfound',
        meta: {
            layout: 'empty',
            auth: { isAuth: true },
            title: 'Страница не найдена'
        },
        component: () => import('../views/NotFound.vue')
    },
    {
        path: '/',
        name: 'root',
        redirect: { name: 'companies.table' }
    }
] as const satisfies readonly AppRouteRecord[];
