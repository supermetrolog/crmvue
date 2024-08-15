<template>
    <nav class="sidebar-mobile-menu">
        <ul class="sidebar-mobile-menu__list">
            <li v-for="element in menu" :key="element.id" class="sidebar-mobile-menu__item">
                <MobileSidebarMenuExtra v-if="element.internal" :link="element" />
                <router-link
                    v-else
                    active-class="active"
                    class="sidebar-mobile-menu__link"
                    :to="element.url"
                >
                    <i :class="element.icon" />
                    <span>{{ element.name }}</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { Menu } from '@/const/menu.js';
import MobileSidebarMenuExtra from '@/components/SideBar/MobileSidebarMenuExtra.vue';
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
