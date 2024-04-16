<template>
    <div class="v-main-layout">
        <TheSideBar />
        <TheHeader />
        <!-- <CallerManager /> -->
        <main>
            <router-view v-slot="{ Component }">
                <AnimationTransition :speed="0.1">
                    <component :is="Component"></component>
                </AnimationTransition>
            </router-view>
        </main>
        <Messenger />
    </div>
</template>

<script>
import TheSideBar from '@/components/SideBar/TheSideBar.vue';
import TheHeader from '@/components/Header/TheHeader.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Messenger from '@/components/Messenger/Messenger.vue';

export default {
    name: 'Default',
    components: {
        Messenger,
        AnimationTransition,
        TheHeader,
        TheSideBar
    }
};
</script>
