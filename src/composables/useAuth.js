import { computed, shallowRef } from 'vue';
import { hasAccessTokenInLocalStorage } from '@/services/localStorage.js';
import { useStore } from 'vuex';
import { userOptions } from '@/const/options/user.options.js';

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
    const currentUserId = computed(() => Number(currentUser.value.id));
    const currentUserIsModerator = computed(
        () => currentUser.value.role >= userOptions.roleStatement.MODERATOR
    );
    const currentUserIsAdmin = computed(
        () => currentUser.value.role === userOptions.roleStatement.ADMIN
    );
    const currentUserIsDirector = computed(
        () => currentUser.value.role === userOptions.roleStatement.DIRECTOR
    );

    return {
        isAuth,
        login,
        logout,
        setRedirect,
        redirectRoute,
        hasAccessToken,
        currentUser,
        currentUserId,
        currentUserIsAdmin,
        currentUserIsModerator,
        currentUserIsDirector
    };
}
