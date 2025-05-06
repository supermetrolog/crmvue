<template>
    <nav class="sidebar__nav">
        <ul class="sidebar__menu">
            <SideBarMenuItem v-for="menuItem in preparedMenu" :key="menuItem.id" :item="menuItem" />
        </ul>
    </nav>
</template>

<script setup>
import { menu } from '@/const/menu.js';
import SideBarMenuItem from '@/components/SideBar/SideBarMenuItem.vue';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';

const { currentUser } = useAuth();

const preparedMenu = computed(() => {
    if (isNullish(currentUser.value)) return [];

    return menu.filter(menuItem => {
        if (menuItem.auth) return menuItem.auth.has(currentUser.value.role);
        return true;
    });
});
</script>
