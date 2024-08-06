<template>
    <div class="sidebar">
        <div class="sidebar__avatar">
            <router-link to="/dashboard">
                <Avatar v-if="THIS_USER" :src="THIS_USER.userProfile?.avatar" />
            </router-link>
        </div>
        <hr />
        <SideBarMenu />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SideBarMenu from '@/components/SideBar/SideBarMenu.vue';
import Avatar from '@/components/common/Avatar.vue';

export default {
    name: 'TheSideBar',
    components: {
        Avatar,
        SideBarMenu
    },
    computed: {
        ...mapGetters(['THIS_USER'])
    }
};
</script>
