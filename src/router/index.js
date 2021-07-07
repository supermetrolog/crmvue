import { createRouter, createWebHistory } from 'vue-router'
const routes = [{
        path: '/statistic',
        name: 'statistic',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Statistic.vue'),
        children: [{
            path: ':mod',
            name: 'statistic',
            meta: { layout: 'main' },
            component: () =>
                import ('../views/Setting.vue')
        }, ]
    },
    {
        path: '/setting',
        name: 'setting',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Setting.vue'),
        children: [{
            path: ':mod',
            name: 'setting',
            meta: { layout: 'main' },
            component: () =>
                import ('../views/Setting.vue')
        }, ]
    },
    {
        path: '/calendar',
        name: 'calendar',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Calendar.vue'),
    },
    {
        path: '/companies',
        name: 'companies',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Companies/Companies.vue'),
        children: [{
                path: '/companies/:id',
                name: 'company',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Companies/Company.vue'),
            },
            {
                path: '',
                name: 'CompaniesAll',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Companies/All.vue')
            },
            {
                path: 'request',
                name: 'CompaniesRequest',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Companies/Request.vue')
            },
            {
                path: 'deal',
                name: 'CompaniesDeal',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Companies/Deal.vue')
            },
            {
                path: 'brak',
                name: 'CompaniesBrak',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Companies/Brak.vue')
            },
        ]
    },

    {
        path: '/:catchAll(.*)',
        name: 'notfound',
        meta: { layout: 'empty' },
        component: () =>
            import ('../views/NotFound.vue')
    },
    {
        path: '/',
        redirect: { name: "CompaniesAll" }
    },


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router