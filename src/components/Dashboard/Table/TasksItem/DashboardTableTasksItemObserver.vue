<template>
    <Tippy>
        <template #default>
            <Avatar
                :src="observer.user.userProfile.avatar"
                :size="size"
                class="dashboard-card-task__user"
                :class="{
                    'dashboard-card-task__not-viewed': !observer.viewed_at
                }"
            />
        </template>
        <template #content>
            <p>{{ observer.user.userProfile.medium_name }} наблюдает</p>
            <p v-if="observer.is_viewed" class="color-light">Задача просмотрена {{ viewedAt }}</p>
            <p v-else class="color-light">Не просмотрена</p>
        </template>
    </Tippy>
</template>

<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';
import { Tippy } from 'vue-tippy';

const props = defineProps({
    observer: {
        type: Object,
        required: true
    },
    size: {
        type: Number,
        default: 40
    }
});

const viewedAt = computed(() => {
    return toBeautifulDateFormat(props.observer.viewed_at);
});
</script>
