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
            import ('../views/Client.vue'),
        children: [{
            path: ':mod',
            name: 'client',
            meta: { layout: 'main' },
            component: () =>
                import ('../views/Client.vue')
        }, ]
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