<template>
    <nav class="header-mobile-menu">
        <ul>
            <li v-for="menuItem in Menu.agent" :key="menuItem.id">
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
</script>
