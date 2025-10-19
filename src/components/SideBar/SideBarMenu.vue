<template>
    <nav class="sidebar__nav">
        <ul class="sidebar__menu">
            <SideBarMenuItem v-for="item in preparedMenu" :key="item.key" :item="item.config" />
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { menu } from '@/const/menu.js';
import SideBarMenuItem from '@/components/SideBar/SideBarMenuItem.vue';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';

const { currentUser } = useAuth();

const preparedMenu = computed(() => {
    if (isNullish(currentUser.value)) return [];

    return menu
        .filter(menuItem => {
            if (menuItem.auth) return menuItem.auth.has(currentUser.value.role);
            return true;
        })
        .map((item, key) => ({ key, config: item }));
});
</script>
