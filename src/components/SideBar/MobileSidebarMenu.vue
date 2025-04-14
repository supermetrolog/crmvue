<template>
    <nav class="sidebar-mobile-menu">
        <ul class="sidebar-mobile-menu__list">
            <MobileSidebarMenuItem v-for="item in preparedMenu" :key="item.id" :item="item" />
        </ul>
    </nav>
</template>

<script setup>
import { menu } from '@/const/menu.js';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import MobileSidebarMenuItem from '@/components/SideBar/MobileSidebarMenuItem.vue';

const { currentUser } = useAuth();

const preparedMenu = computed(() => {
    return menu.filter(menuItem => {
        if (menuItem.auth) return menuItem.auth.has(currentUser.value.role);
        return true;
    });
});
</script>
