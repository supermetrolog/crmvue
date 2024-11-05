import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';
import { useNotify } from '@/utils/useNotify.js';
import { LOCALSTORAGE_PREFIX, LS_ACCESS_TOKEN_KEY } from '@/utils/localStorage.js';
import { useDocumentTitle } from '@/composables/useDocumentTitle.js';
import OffersView from '@/views/Offers/Offers.vue';

const routes = [
    {
        path: '/statistic',
        name: 'statistic',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
            title: 'Статистика'
        },
        component: () => import('../views/Statistic.vue'),
        children: [
            {
                path: ':mod',
                name: 'statistic',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
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
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
            title: 'Настройки'
        },
        component: () => import('@/views/Settings/View.vue'),
        redirect: { name: 'settings-survey' },
        children: [
            {
                path: 'survey',
                name: 'settings-survey',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
                    title: ['Опросник', 'Настройки']
                },
                component: () => import('../views/Settings/Survey.vue')
            },
            {
                path: 'messenger',
                name: 'settings-messenger',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
                    title: ['Мессенджер', 'Настройки']
                },
                component: () => import('../views/Settings/Messenger.vue')
            },
            {
                path: 'tasks',
                name: 'settings-tasks',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
                    title: ['Задачи', 'Настройки']
                },
                component: () => import('../views/Settings/Tasks.vue')
            }
        ]
    },
    {
        path: '/calendar',
        name: 'calendar',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
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
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
            title: 'Список компаний'
        },
        component: () => import('../views/Companies/Companies.vue'),
        children: [
            {
                path: '/companies/:id',
                name: 'company',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
                    title: 'Обзор компании'
                },
                component: () => import('../views/Companies/Company.vue')
            },
            {
                path: '',
                name: 'CompaniesMain',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
                },
                component: () => import('../views/Companies/Main.vue')
            },
            {
                path: 'requests',
                name: 'CompaniesRequests',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
                    title: 'Запросы клиентов'
                },
                component: () => import('../views/Companies/Requests.vue')
            },
            {
                path: 'deals',
                name: 'CompaniesDeals',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
                    title: 'Сделки'
                },
                component: () => import('../views/Companies/Deals.vue')
            },
            {
                path: 'groups',
                name: 'CompaniesGroups',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
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
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
            title: 'Сотрудники'
        },
        component: () => import('../views/Users/Users.vue'),
        children: [
            {
                path: '',
                name: 'users-table',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
                    title: ['Управление', 'Сотрудники']
                },
                component: () => import('../views/Users/Main.vue')
            },
            {
                path: 'sessions',
                name: 'users-sessions',
                meta: {
                    layout: 'default',
                    auth: {
                        isAuth: true,
                        role: ['moderator', 'administrator']
                    },
                    title: ['Безопасность', 'Сотрудники']
                },
                component: () => import('../views/Users/Sessions.vue')
            },
            {
                path: ':id',
                name: 'user',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
                },
                component: () => import('../views/Users/User.vue')
            }
        ]
    },
    {
        path: '/account',
        name: 'account',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
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
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
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
                path: 'company',
                name: 'dashboard-company',
                component: () => import('../views/Dashboard/Company.vue')
            },
            {
                path: 'tasks',
                name: 'dashboard-tasks',
                meta: {
                    title: ['Задачи', 'Дашборд']
                },
                component: () => import('../views/Dashboard/Tasks/Main.vue'),
                redirect: { name: 'dashboard-tasks-board' },
                children: [
                    {
                        path: 'board',
                        name: 'dashboard-tasks-board',
                        component: () => import('../views/Dashboard/Tasks/Board.vue')
                    },
                    {
                        path: 'table',
                        name: 'dashboard-tasks-table',
                        component: () => import('../views/Dashboard/Tasks/Table.vue')
                    }
                ]
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
        path: '/offers',
        name: 'offers',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
            title: 'Предложения'
        },
        component: OffersView,
        children: [
            {
                path: '',
                name: 'OffersMain',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
                },
                component: () => import('../views/Offers/Main.vue')
            },
            {
                path: 'map',
                name: 'OffersMap',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] },
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
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
            title: 'Просмотр комплекса'
        },
        component: () => import('@/views/ComplexView.vue')
    },
    {
        path: '/equipments',
        name: 'equipments',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
            title: 'Барахолка'
        },
        component: () => import('../views/Equipments.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'notfound',
        meta: {
            layout: 'empty',
            auth: { isAuth: true, role: ['moderator', 'administrator'] },
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

router.beforeEach(to => {
    const { isAuth, setRedirect, login } = useAuth();
    if (!isAuth.value && localStorage.getItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_KEY)) login();

    if (to.meta.auth.isAuth) {
        if (!isAuth.value) {
            setRedirect(to.fullPath);

            const notify = useNotify();
            notify.info('Для доступа к запрашиваемой странице необходимо авторизоваться');

            return { name: 'login' };
        }
    } else if (isAuth.value) {
        const notify = useNotify();
        notify.info('Вы уже авторизованы');

        return { name: 'root' };
    }
});

const { setTitle } = useDocumentTitle();

router.afterEach(to => {
    setTitle(to.meta.title);
});
export default router;
