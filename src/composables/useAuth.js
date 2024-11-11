import { computed, shallowRef } from 'vue';
import { hasAccessTokenInLocalStorage } from '@/utils/localStorage.js';
import { useStore } from 'vuex';

const isAuth = shallowRef(false);
const redirectRoute = shallowRef(null);

/**
 * Залогинить пользователя
 */
function login() {
    isAuth.value = true;
}

/**
 * Разлогинить пользователя
 */
function logout() {
    isAuth.value = false;
}

/**
 * Установить редирект после следующего логина
 * @param value - Full path для `router`
 */
function setRedirect(value) {
    redirectRoute.value = value;
}

function hasAccessToken() {
    return hasAccessTokenInLocalStorage();
}

export function useAuth() {
    const store = useStore();

    const currentUser = computed(() => store.state.User.user);

    return { isAuth, login, logout, setRedirect, redirectRoute, hasAccessToken, currentUser };
}
