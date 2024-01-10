<template>
    <nav class="sidebar__nav">
        <ul class="sidebar__menu">
            <SideBarMenuItem v-for="menuItem in menu" :key="menuItem.id" :item="menuItem" />
        </ul>
    </nav>
</template>

<script>
import { Menu } from '@/const/menu.js';
import { mapGetters } from 'vuex';
import SideBarMenuItem from '@/components/SideBar/SideBarMenuItem.vue';

export default {
    name: 'SideBarMenu',
    components: {
        SideBarMenuItem
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        menu() {
            if (this.THIS_USER && this.THIS_USER.username === 'admin') {
                return Menu.admin;
            }
            return Menu.agent;
        }
    }
};
</script>
