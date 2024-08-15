<template>
    <nav class="header-mobile-menu">
        <ul>
            <li v-for="menuItem in menu" :key="menuItem.id">
                <router-link
                    class="header-mobile-menu__link"
                    active-class="active"
                    :to="menuItem.url"
                    :exact="menuItem.exact"
                >
                    <i class="sidebar__icon" :class="menuItem.icon"></i>
                    {{ menuItem.name }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>
<script setup>
import { Menu } from '@/const/menu.js';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { userOptions } from '@/const/options/user.options.js';

const store = useStore();

const menu = computed(() => {
    if (
        store.getters.THIS_USER &&
        (store.getters.THIS_USER.username === 'admin' ||
            store.getters.THIS_USER.role === userOptions.roleStatement.ADMIN ||
            store.getters.THIS_USER.role === userOptions.roleStatement.DIRECTOR)
    )
        return Menu.admin;
    return Menu.agent;
});
</script>
