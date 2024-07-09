import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';
import { notify } from '@kyvg/vue3-notification';

const routes = [
    {
        path: '/statistic',
        name: 'statistic',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
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
                component: () => import('@/views/Settings.vue')
            }
        ]
    },
    {
        path: '/settings',
        name: 'settings',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
        },
        component: () => import('@/views/Settings.vue')
    },
    {
        path: '/calendar',
        name: 'calendar',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
        },
        component: () => import('../views/Calendar.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: { layout: 'login', auth: { isAuth: false } },
        component: () => import('../views/Login.vue')
    },
    {
        path: '/companies',
        name: 'companies',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
        },
        component: () => import('../views/Companies/Companies.vue'),
        children: [
            {
                path: '/companies/:id',
                name: 'company',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
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
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
                },
                component: () => import('../views/Companies/Requests.vue')
            },
            {
                path: 'deals',
                name: 'CompaniesDeals',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
                },
                component: () => import('../views/Companies/Deals.vue')
            },
            {
                path: 'groups',
                name: 'CompaniesGroups',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
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
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
        },
        component: () => import('../views/Users/Users.vue'),
        children: [
            {
                path: '/users/:id',
                name: 'user',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
                },
                component: () => import('../views/Users/User.vue')
            },
            {
                path: '',
                name: 'UsersMain',
                meta: {
                    layout: 'default',
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
                },
                component: () => import('../views/Users/Main.vue')
            }
        ]
    },
    {
        path: '/account',
        name: 'account',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
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
                path: 'activity',
                name: 'profile-activity',
                component: () => import('../views/Account/Activity.vue')
            },
            {
                path: 'edit',
                name: 'profile-edit',
                component: () => import('../views/Account/Edit.vue')
            },
            {
                path: 'consultants',
                name: 'profile-consultants',
                component: () => import('../views/Account/Consultants.vue')
            }
        ]
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
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
                component: () => import('../views/Dashboard/Requests.vue')
            }
        ]
    },
    {
        path: '/offers',
        name: 'offers',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
        },
        component: () => import('../views/Offers/Offers.vue'),
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
                    auth: { isAuth: true, role: ['moderator', 'administrator'] }
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
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
        },
        component: () => import('@/views/ComplexView.vue')
    },
    {
        path: '/equipments',
        name: 'equipments',
        meta: {
            layout: 'default',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
        },
        component: () => import('../views/Equipments.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'notfound',
        meta: {
            layout: 'empty',
            auth: { isAuth: true, role: ['moderator', 'administrator'] }
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

const { isAuth, setRedirect } = useAuth();

router.beforeEach(to => {
    const accessToken = localStorage.getItem('access_token');

    if (to.meta.auth.isAuth) {
        if (!accessToken || !isAuth.value) {
            setRedirect(to.fullPath);
            notify({
                text: 'Для доступа к запрашиваемой странице необходимо авторизоваться',
                duration: 3000
            });
            return { name: 'login' };
        }
    } else if (isAuth.value || accessToken) {
        notify({
            text: 'Вы уже авторизованы',
            duration: 2000
        });
        return { name: 'root' };
    }
});
export default router;
