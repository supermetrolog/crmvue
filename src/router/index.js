import { createRouter, createWebHistory } from 'vue-router'
const routes = [{
        path: '/statistic',
        name: 'statistic',
        meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
        component: () =>
            import ('../views/Statistic.vue'),
        children: [{
            path: ':mod',
            name: 'statistic',
            meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
            component: () =>
                import ('../views/Setting.vue')
        }, ]
    },
    {
        path: '/setting',
        name: 'setting',
        meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
        component: () =>
            import ('../views/Setting.vue'),
        children: [{
            path: ':mod',
            name: 'setting',
            meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
            component: () =>
                import ('../views/Setting.vue')
        }, ]
    },
    {
        path: '/calendar',
        name: 'calendar',
        meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
        component: () =>
            import ('../views/Calendar.vue'),
    },
    {
        path: '/login',
        name: 'login',
        meta: { layout: 'login', auth: { isAuth: false } },
        component: () =>
            import ('../views/Login.vue'),
    },
    {
        path: '/companies',
        name: 'companies',
        meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
        component: () =>
            import ('../views/Companies/Companies.vue'),
        children: [{
                path: '/companies/:id',
                name: 'company',
                meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
                component: () =>
                    import ('../views/Companies/Company.vue'),
            },
            {
                path: '',
                name: 'CompaniesMain',
                meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
                component: () =>
                    import ('../views/Companies/Main.vue')
            },
            {
                path: 'requests',
                name: 'CompaniesRequests',
                meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
                component: () =>
                    import ('../views/Companies/Requests.vue')
            },
            {
                path: 'deals',
                name: 'CompaniesDeals',
                meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
                component: () =>
                    import ('../views/Companies/Deals.vue')
            },
            {
                path: 'groups',
                name: 'CompaniesGroups',
                meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
                component: () =>
                    import ('../views/Companies/Groups.vue')
            },
        ]
    },
    {
        path: '/users',
        name: 'users',
        meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
        component: () =>
            import ('../views/Users/Users.vue'),
        children: [{
                path: '/users/:id',
                name: 'user',
                meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
                component: () =>
                    import ('../views/Users/User.vue'),
            },
            {
                path: '',
                name: 'UsersMain',
                meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
                component: () =>
                    import ('../views/Users/Main.vue')
            },
        ]
    },
    {
        path: '/account',
        name: 'account',
        meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
        component: () =>
            import ('../views/Account/Account.vue'),
        children: [{
            path: '',
            name: 'Main',
            meta: { layout: 'main', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
            component: () =>
                import ('../views/Account/Main.vue')
        }, ]
    },
    {
        path: '/:catchAll(.*)',
        name: 'notfound',
        meta: { layout: 'empty', auth: { isAuth: true, role: ['moderator', 'administrator'] } },
        component: () =>
            import ('../views/NotFound.vue')
    },
    {
        path: '/',
        name: "root",
        redirect: { name: "CompaniesMain" }
    },


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
router.beforeEach((to, from, next) => {
    // console.log("To:", to, "From:", from, next);
    const access_token = localStorage.getItem('access_token');
    if (to.meta.auth.isAuth && !access_token) {
        return next({ name: "login" });
    }

    if (!to.meta.auth.isAuth && access_token) {
        return next({ name: from.name });
    }
    return next();
});
export default router