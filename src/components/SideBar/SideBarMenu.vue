<template>
    <nav class="sidebar__nav">
        <ul class="sidebar__menu">
            <SideBarMenuItem v-for="menuItem in menu" :key="menuItem.id" :item="menuItem" />
        </ul>
    </nav>
</template>

<script setup>
import { Menu } from '@/const/menu.js';
import { useStore } from 'vuex';
import SideBarMenuItem from '@/components/SideBar/SideBarMenuItem.vue';
import { computed } from 'vue';
import { userOptions } from '@/const/options/user.options.js';

const store = useStore();

const menu = computed(() => {
    if (
        store.getters.THIS_USER &&
        (store.getters.THIS_USER.username === 'admin' ||
            store.getters.THIS_USER.role === userOptions.roleStatement.ADMIN)
    )
        return Menu.admin;
    return Menu.agent;
});
</script>
