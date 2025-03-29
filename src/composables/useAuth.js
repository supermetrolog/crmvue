import { computed, shallowRef } from 'vue';
import { hasAccessTokenInLocalStorage } from '@/services/localStorage.js';
import { useStore } from 'vuex';
import { userOptions } from '@/const/options/user.options.js';
import { createSharedComposable } from '@vueuse/core';

const isAuth = shallowRef(false);
const redirectRoute = shallowRef(null);

function login() {
    isAuth.value = true;
}

function logout() {
    isAuth.value = false;
}

function setRedirect(value) {
    redirectRoute.value = value;
}

function hasAccessToken() {
    return hasAccessTokenInLocalStorage();
}

export const useAuth = createSharedComposable(() => {
    const store = useStore();

    const currentUser = computed(() => store.state.User.user);

    const currentUserId = computed(() => Number(currentUser.value?.id));

    const currentUserIsModerator = computed(
        () => currentUser.value?.role === userOptions.roleStatement.MODERATOR
    );

    const currentUserIsModeratorOrHigher = computed(
        () => currentUser.value?.role >= userOptions.roleStatement.MODERATOR
    );

    const currentUserIsAdmin = computed(
        () => currentUser.value?.role === userOptions.roleStatement.ADMIN
    );

    const currentUserIsDirector = computed(
        () => currentUser.value?.role === userOptions.roleStatement.DIRECTOR
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
        currentUserIsModeratorOrHigher,
        currentUserIsDirector
    };
});
