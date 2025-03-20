<template>
    <div class="sidebar">
        <div class="sidebar__avatar">
            <router-link to="/dashboard">
                <Avatar :src="currentUser?.userProfile?.avatar" />
            </router-link>
        </div>
        <hr />
        <SideBarMenu />
    </div>
</template>

<script setup>
import SideBarMenu from '@/components/SideBar/SideBarMenu.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useAuth } from '@/composables/useAuth.js';

const { currentUser } = useAuth();
</script>
