import { createRouter, createWebHistory } from 'vue-router'
const routes = [{
        path: '/process',
        name: 'process',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Process.vue'),
        children: [{
            path: ':mod',
            name: 'process',
            meta: { layout: 'main' },
            component: () =>
                import ('../views/Process.vue')
        }]
    },
    {
        path: '/agreements',
        name: 'agreements',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Agreements.vue')
    },
    {
        path: '/cashbox',
        name: 'cashbox',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Cashbox.vue')
    },
    {
        path: '/court',
        name: 'court',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Court.vue')
    },
    {
        path: '/personal',
        name: 'personal',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Personal.vue'),
        children: [{
            path: ':mod',
            name: 'personal',
            meta: { layout: 'main' },
            component: () =>
                import ('../views/Personal.vue')
        }]
    },
    {
        path: '/rate',
        name: 'rate',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Rate.vue')
    },
    {
        path: '/salary',
        name: 'salary',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Salary.vue')
    },
    {
        path: '/comming',
        name: 'comming',
        meta: { layout: 'main' },
        component: () =>
            import ('../views/Comming.vue'),
        children: [{
            path: ':mod',
            name: 'comming',
            meta: { layout: 'main' },
            component: () =>
                import ('../views/Comming.vue')
        }]
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
        redirect: { name: "comming" }
    },


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router