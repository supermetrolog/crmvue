import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useNotify } from '@/utils/use/useNotify.js';
import { getAccessTokenFromLocalStorage } from '@/services/localStorage.js';
import { setTitle } from '@/composables/useDocumentTitle';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { GetRoutesNames, routes } from '@/router/config';

export type TRoutes = typeof routes;
export type TRoutesNames = GetRoutesNames<TRoutes>;

export const router = createRouter({
    history: createWebHistory(),
    routes: routes as unknown as RouteRecordRaw[]
});

router.beforeEach((to, from) => {
    if (to.name === 'unavailable') return;

    const notify = useNotify();

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

router.afterEach(to => {
    setTitle(to.meta.title);
});
