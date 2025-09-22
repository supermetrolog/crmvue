<template>
    <nav class="sidebar-mobile-menu">
        <ul class="sidebar-mobile-menu__list">
            <MobileSidebarMenuItem
                v-for="item in preparedMenu"
                :key="item.key"
                :item="item.config"
            />
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { menu } from '@/const/menu.ts';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import MobileSidebarMenuItem from '@/components/SideBar/MobileSidebarMenuItem.vue';

const { currentUser } = useAuth();

const preparedMenu = computed(() => {
    return menu
        .filter(menuItem => {
            if (menuItem.auth) return menuItem.auth.has(currentUser.value.role);
            return true;
        })
        .map((item, key) => ({ key, config: item }));
});
</script>
