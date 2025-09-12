<template>
    <header class="mobile-header">
        <div class="mobile-header__wrapper">
            <button @click.prevent="toggle" class="mobile-header__button">
                <i class="fa-solid fa-bars"></i>
            </button>
            <div class="mobile-header__avatar">
                <router-link to="/account">
                    <Avatar :size="45" :src="currentUser.userProfile?.avatar" />
                </router-link>
            </div>
            <div v-if="route.meta?.title" class="mobile-header__title ml-auto">
                <DashboardChip class="dashboard-bg-success-l text-white">
                    {{ currentRouteTitle }}
                </DashboardChip>
            </div>
        </div>
        <AnimationTransition :speed="0.3">
            <div v-if="sidebarIsOpen" @click="toggle" class="mobile-header__backdrop"></div>
        </AnimationTransition>
        <TheMobileSidebar @close="toggle" :class="{ active: sidebarIsOpen }" />
    </header>
</template>

<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed, shallowRef } from 'vue';
import TheMobileSidebar from '@/components/SideBar/TheMobileSidebar.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { isArray } from '@/utils/helpers/array/isArray.ts';

const { currentUser } = useAuth();
const route = useRoute();

const sidebarIsOpen = shallowRef(false);

const toggle = () => {
    sidebarIsOpen.value = !sidebarIsOpen.value;
};

const currentRouteTitle = computed(() => {
    if (isArray(route.meta.title)) return route.meta.title.join(' | ');
    return route.meta.title;
});
</script>
