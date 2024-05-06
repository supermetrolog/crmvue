<template>
    <router-view v-slot="{ Component }">
        <AnimationTransition :speed="0.1">
            <component :is="Component"></component>
        </AnimationTransition>
    </router-view>
</template>

<script>
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'DashboardView',
    components: { AnimationTransition }
};
</script>
