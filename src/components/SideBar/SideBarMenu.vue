<template>
    <nav class="sidebar__nav">
        <ul class="sidebar__menu">
            <SideBarMenuItem v-for="menuItem in menu" :key="menuItem.id" :item="menuItem" />
        </ul>
    </nav>
</template>

<script setup>
import { Menu } from '@/const/menu.js';
import SideBarMenuItem from '@/components/SideBar/SideBarMenuItem.vue';
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth.js';

const { currentUserId, currentUserIsAdmin, currentUserIsDirector } = useAuth();

const menu = computed(() => {
    if (currentUserId.value && (currentUserIsAdmin.value || currentUserIsDirector.value))
        return Menu.admin;
    return Menu.agent;
});
</script>
