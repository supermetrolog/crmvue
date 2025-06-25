<template>
    <div class="sidebar">
        <div class="sidebar__avatar">
            <router-link to="/dashboard">
                <Avatar :src="currentUser?.userProfile?.avatar" />
            </router-link>
        </div>
        <hr />
        <SideBarMenu />
        <Tippy class="sidebar__version" tag="p">
            ver. {{ currentVersion }}
            <template #content>
                <p class="mb-1">Версия приложения - {{ currentVersion }}</p>
                <p>Дата публикации - {{ formattedLastBuildDate }}</p>
            </template>
        </Tippy>
    </div>
</template>

<script setup lang="ts">
import SideBarMenu from '@/components/SideBar/SideBarMenu.vue';
import Avatar from '@/components/common/Avatar.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useClientVersion } from '@/composables/useClientVersion';
import { Tippy } from 'vue-tippy';
import { toDateFormat } from '@/utils/formatters/date';
import { computed } from 'vue';

const { currentUser } = useAuth();

const { currentVersion, lastBuildDate } = useClientVersion();

const formattedLastBuildDate = computed(() => {
    return toDateFormat(lastBuildDate.value);
});
</script>
