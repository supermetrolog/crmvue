<template>
    <notifications position="bottom right" group="app" pause-on-hover />
    <component :is="layoutComponent" />
</template>

<script setup>
import Default from '@/layouts/default.vue';
import Login from '@/layouts/login.vue';
import Empty from '@/layouts/empty.vue';
import { Notifications } from '@kyvg/vue3-notification';
import Mobile from '@/layouts/mobile.vue';
import { computed } from 'vue';
import { initializeDevice } from '@/composables/useMobile.js';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

defineOptions({
    components: {
        Default,
        Login,
        Empty,
        Mobile,
        Notifications
    }
});

const route = useRoute();
const store = useStore();

const isMobile = initializeDevice();

const layoutComponent = computed(() => {
    if (isMobile) return Mobile;
    return route.meta.layout;
});

store.dispatch('INIT');
</script>
<style lang="scss">
@import '@/assets/scss/style.scss';
</style>
