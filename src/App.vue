<template>
    <AppVersionChecker />
    <AppUserNotifications />
    <notifications position="bottom right" group="app" pause-on-hover />
    <ElConfigProvider :locale="ru">
        <component :is="layoutComponent" v-if="isInitialized" />
    </ElConfigProvider>
</template>

<script setup>
import Default from '@/layouts/default.vue';
import Login from '@/layouts/login.vue';
import Empty from '@/layouts/empty.vue';
import { Notifications } from '@kyvg/vue3-notification';
import Mobile from '@/layouts/mobile.vue';
import { computed, ref } from 'vue';
import { initializeDevice } from '@/composables/useMobile.js';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useTimeoutFn } from '@vueuse/core';
import AppVersionChecker from '@/components/common/AppVersionChecker.vue';
import { captureException } from '@sentry/vue';
import AppUserNotifications from '@/components/common/AppUserNotifications.vue';
import { ElConfigProvider } from 'element-plus';
import ru from 'element-plus/es/locale/lang/ru';

const LAYOUTS = {
    login: Login,
    empty: Empty,
    mobile: Mobile,
    default: Default
};

const isInitialized = ref(false);

const route = useRoute();
const router = useRouter();
const store = useStore();

const isMobile = initializeDevice();

const layoutComponent = computed(() => {
    if (route.meta.layout === 'login') return LAYOUTS.login;
    if (isMobile) return LAYOUTS.mobile;

    return LAYOUTS[route.meta.layout] ?? LAYOUTS.default;
});

function disableSplash() {
    document.body.classList.add('splash-disabling');

    useTimeoutFn(() => {
        document.body.classList.remove('splash-disabling', 'splash');
    }, 250);
}

async function initialize() {
    try {
        const initialized = await store.dispatch('initialize');

        if (!initialized) {
            void store.dispatch('destroy');
            await router.push({ name: 'login' });
        }
    } catch (error) {
        captureException(error);
        void router.push({ name: 'unavailable' });
    } finally {
        isInitialized.value = true;
        disableSplash();
    }
}

initialize();
</script>
<style lang="scss">
@import '@/assets/scss/style.scss';
</style>
