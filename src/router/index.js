import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { getAccessTokenFromLocalStorage } from '@/services/localStorage.js';
import { useDocumentTitle } from '@/composables/useDocumentTitle.js';
import OffersView from '@/views/Offers/Offers.vue';
import OffersMain from '@/views/Offers/Main.vue';
import CompaniesMain from '@/views/Companies/Companies.vue';
import CompaniesView from '@/views/Companies/Company.vue';
import CompaniesList from '@/views/Companies/Main.vue';
import { AUTH_ROLE } from '@/const/role.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const routes = [
    {
        path: '/statistic',
        name: 'statistic',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Статистика'
        },
        component: () => import('../views/Statistic.vue'),
        children: [
            {
                path: ':mod',
                name: 'statistic',
                meta: {
                    auth: { isAuth: true, roles: ['moderator', 'administrator'] }
                },
                component: () => import('@/views/Settings/Survey.vue')
            }
        ]
    },
    {
        path: '/settings',
        name: 'settings',
        meta: {
            layout: 'default',
            auth: { isAuth: true, roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER] },
            title: 'Настройки'
        },
        component: () => import('@/views/Settings/View.vue'),
        redirect: { name: 'settings-survey' },
        children: [
            {
                path: 'survey',
                name: 'settings-survey',
                meta: {
                    title: ['Опросник', 'Настройки']
                },
                component: () => import('../views/Settings/Survey.vue')
            },
            {
                path: 'messenger',
                name: 'settings-messenger',
                meta: {
                    title: ['Мессенджер', 'Настройки']
                },
                component: () => import('../views/Settings/Messenger.vue')
            },
            {
                path: 'tasks',
                name: 'settings-tasks',
                meta: {
                    title: ['Задачи', 'Настройки']
                },
                component: () => import('../views/Settings/Tasks.vue')
            },
            {
                path: 'utilities',
                name: 'settings-utilities',
                meta: {
                    title: ['Инструменты администратора', 'Настройки']
                },
                component: () => import('../views/Settings/Utilities.vue')
            }
        ]
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
                name: 'CompaniesMain',
                component: CompaniesList
            },
            {
                path: 'requests',
                name: 'CompaniesRequests',
                meta: {
                    title: 'Запросы клиентов'
                },
                component: () => import('../views/Companies/Requests.vue')
            },
            {
                path: 'deals',
                name: 'CompaniesDeals',
                meta: {
                    title: 'Сделки'
                },
                component: () => import('../views/Companies/Deals.vue')
            },
            {
                path: 'groups',
                name: 'CompaniesGroups',
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
            auth: { isAuth: true, roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER] },
            title: 'Сотрудники'
        },
        component: () => import('../views/Users/Users.vue'),
        children: [
            {
                path: '',
                name: 'users-table',
                meta: {
                    title: ['Управление', 'Сотрудники']
                },
                component: () => import('../views/Users/Main.vue')
            },
            {
                path: 'sessions',
                name: 'users-sessions',
                meta: {
                    title: ['Безопасность', 'Сотрудники']
                },
                component: () => import('../views/Users/Sessions.vue')
            },
            {
                path: ':id',
                name: 'user',
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
                name: 'profile-sessions',
                meta: {
                    title: ['Безопасность', 'Личный кабинет']
                },
                component: () => import('../views/Account/Sessions.vue')
            },
            {
                path: 'edit',
                name: 'profile-edit',
                meta: {
                    title: ['Редактирование', 'Личный кабинет']
                },
                component: () => import('../views/Account/Edit.vue')
            },
            {
                path: 'consultants',
                name: 'profile-consultants',
                meta: {
                    title: 'Коллеги'
                },
                component: () => import('../views/Account/Consultants.vue')
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
                name: 'dashboard-main',
                component: () => import('../views/Dashboard/Main.vue')
            },
            {
                path: 'requests',
                name: 'dashboard-requests',
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
                name: 'OffersMain',
                component: OffersMain
            },
            {
                path: 'map',
                name: 'OffersMap',
                meta: {
                    title: ['Карта', 'Предложения']
                },
                component: () => import('../views/Offers/Map.vue')
            }
        ]
    },
    {
        path: '/complex/:complex_id',
        name: 'ComplexView',
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
    // {
    //     path: '/surveys',
    //     name: 'surveys',
    //     meta: {
    //         layout: 'default',
    //         auth: { isAuth: true },
    //         title: 'Опросы'
    //     },
    //     component: () => import('../views/Surveys.vue')
    // },
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
        redirect: { name: 'CompaniesMain' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const notify = useNotify();

router.beforeEach((to, from) => {
    const { isAuth, setRedirect, login, currentUser } = useAuth();
    const { accessToken } = getAccessTokenFromLocalStorage();

    if (!isAuth.value && isNotNullish(accessToken)) login();

    if (to.meta.auth.isAuth) {
        if (!isAuth.value) {
            setRedirect(to.fullPath);

            notify.info('Для доступа к запрашиваемой странице необходимо авторизоваться');

            return { name: 'login' };
        }

        if (to.meta.auth.roles && !to.meta.auth.roles.includes(currentUser.value.role)) {
            notify.warning('У вас нет доступа к запрашиваемой странице');

            if (isNullish(from.name)) return { name: 'root' };
            return false;
        }
    } else if (isAuth.value) {
        notify.info('Вы уже авторизованы');

        return { name: 'root' };
    }
});

const { setTitle } = useDocumentTitle();

router.afterEach(to => {
    setTitle(to.meta.title);
});

export default router;
