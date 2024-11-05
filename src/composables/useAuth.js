import { shallowRef } from 'vue';
import { hasAccessTokenInLocalStorage } from '@/utils/localStorage.js';

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

/**
 * Composable для взаимодействия с состоянием авторизации пользователя
 * @returns {{setRedirect: setRedirect, isAuth: shallowRef<boolean>, logout: logout,
 * redirectRoute: shallowRef<string|null>, login: login}}
 */
export function useAuth() {
    return { isAuth, login, logout, setRedirect, redirectRoute, hasAccessToken };
}
