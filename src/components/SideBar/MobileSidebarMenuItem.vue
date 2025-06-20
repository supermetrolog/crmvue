<template>
    <li class="sidebar-mobile-menu__item">
        <MobileSidebarMenuExtra v-if="internalMenu.length" :link="item" :internal="internalMenu" />
        <router-link v-else active-class="active" class="sidebar-mobile-menu__link" :to="item.url">
            <i :class="item.icon" />
            <span>{{ item.name }}</span>
        </router-link>
    </li>
</template>

<script setup>
import MobileSidebarMenuExtra from '@/components/SideBar/MobileSidebarMenuExtra.vue';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

const { currentUser } = useAuth();

const internalMenu = computed(() => {
    if (isNullish(props.item.internal)) return [];

    return props.item.internal.filter(menuItem => {
        if (isNotNullish(menuItem.auth)) return menuItem.auth.has(currentUser.value.role);
        return true;
    });
});
</script>
