<template>
    <div class="v-main-layout">
        <TheSideBar />
        <TheHeader />
        <!-- <CallerManager /> -->
        <main>
            <router-view v-slot="{ Component }">
                <AnimationTransition fast>
                    <component :is="Component" :key="$route.path"></component>
                </AnimationTransition>
            </router-view>
        </main>
    </div>
</template>

<script>
import TheSideBar from '@/components/SideBar/TheSideBar.vue';
import TheHeader from '@/components/Header/TheHeader.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'Default',
    components: {
        AnimationTransition,
        TheHeader,
        TheSideBar
    }
};
</script>