<template>
    <AppVersionChecker />
    <notifications position="bottom right" group="app" pause-on-hover />
    <component :is="layoutComponent" v-if="isInitialized" />
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

const LAYOUTS = {
    login: Login,
    empty: Empty,
    default: Default
};

const isInitialized = ref(false);

const route = useRoute();
const router = useRouter();
const store = useStore();

const isMobile = initializeDevice();

const layoutComponent = computed(() => {
    if (route.meta.layout === 'login') return Login;
    if (isMobile) return Mobile;

    return LAYOUTS[route.meta.layout] ?? Default;
});

const disableSplash = () => {
    document.body.classList.add('splash-disabling');
    useTimeoutFn(() => {
        document.body.classList.remove('splash-disabling', 'splash');
    }, 250);
};

const initialize = async () => {
    const initialized = await store.dispatch('initialize');

    if (!initialized) {
        store.dispatch('destroy');
        await router.push({ name: 'login' });
    }

    isInitialized.value = true;
    disableSplash();
};

initialize();
</script>
<style lang="scss">
@import '@/assets/scss/style.scss';
</style>
