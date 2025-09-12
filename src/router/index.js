import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useNotify } from '@/utils/use/useNotify.js';
import { getAccessTokenFromLocalStorage } from '@/services/localStorage.js';
import { useDocumentTitle } from '@/composables/useDocumentTitle.ts';
import OffersView from '@/views/Offers/Offers.vue';
import OffersMain from '@/views/Offers/Main.vue';
import CompaniesMain from '@/views/Companies/Companies.vue';
import CompaniesView from '@/views/Companies/Company.vue';
import CompaniesList from '@/views/Companies/Main.vue';
import { AUTH_ROLE } from '@/const/role.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import Unavailable from '@/views/Unavailable.vue';

const routes = [
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
            auth: { isAuth: true, roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.OWNER, AUTH_ROLE.MODERATOR] },
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
                path: 'edit-password',
                name: 'profile-edit-password',
                meta: {
                    title: ['Смена пароля', 'Личный кабинет']
                },
                component: () => import('../views/Account/EditPassword.vue')
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
        name: 'surveys-main',
        meta: {
            layout: 'default',
            auth: { isAuth: true },
            title: 'Список опросов'
        },
        children: [
            {
                path: '',
                name: 'surveys',
                component: () => import('../views/Surveys/Surveys.vue')
            },
            {
                path: 'drafts',
                name: 'survey-drafts',
                meta: {
                    title: ['Черновики', 'Список опросов']
                },
                component: () => import('../views/Surveys/Drafts.vue')
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
        component: () => import('@/views/Admin/View.vue'),
        redirect: { name: 'admin-tours' },
        children: [
            {
                path: 'tours',
                name: 'admin-tours',
                meta: {
                    title: ['Админка', 'Туры']
                },
                component: () => import('../views/Admin/Tours.vue')
            },
            {
                path: 'messages',
                name: 'admin-messages',
                meta: {
                    title: ['Админка', 'Сообщения']
                },
                component: () => import('../views/Admin/ChatMemberMessages.vue')
            },
            {
                path: 'notifications',
                name: 'admin-notifications',
                meta: {
                    title: ['Админка', 'Уведомления']
                },
                component: () => import('../views/Admin/Notifications.vue')
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
        redirect: { name: 'CompaniesMain' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const notify = useNotify();

router.beforeEach((to, from) => {
    if (to.name === 'unavailable') return;

    const { isAuth, setRedirect, login, currentUser } = useAuth();
    const { accessToken } = getAccessTokenFromLocalStorage();

    if (!isAuth.value && isNotNullish(accessToken)) login();

    if (to.meta.auth?.isAuth) {
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
