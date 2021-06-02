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
        path: '/client',
        name: 'client',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Client/Client.vue'),
        children: [{
                path: '',
                name: 'ClientAll',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Client/All.vue')
            },
            {
                path: 'in-work',
                name: 'ClientInWork',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Client/InWork.vue')
            },
            {
                path: 'deal',
                name: 'ClientDeal',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Client/Deal.vue')
            },
            {
                path: 'brak',
                name: 'ClientBrak',
                meta: { layout: 'main' },
                component: () =>
                    import ('../views/Client/Brak.vue')
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
        redirect: { name: "client" }
    },


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router