<template>
    <div class="sidebar">
        <div class="sidebar__avatar">
            <router-link to="/dashboard">
                <Avatar :src="currentUser?.userProfile?.avatar" />
            </router-link>
        </div>
        <hr />
        <SideBarMenu />
        <p ref="versionEl" class="sidebar__version">ver. {{ currentVersion }}</p>
    </div>
</template>

<script setup lang="ts">
import SideBarMenu from '@/components/SideBar/SideBarMenu.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useClientVersion } from '@/composables/useClientVersion.ts';
import { useTippy } from 'vue-tippy';
import { computed, useTemplateRef } from 'vue';

const { currentUser } = useAuth();

const { currentVersion } = useClientVersion();

useTippy(useTemplateRef('versionEl'), {
    content: computed(() => `Версия приложения - ${currentVersion}`)
});
</script>
