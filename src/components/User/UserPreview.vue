<template>
    <div class="user-preview">
        <div class="user-preview__content">
            <div class="user-preview__avatar">
                <Avatar :src="user.userProfile.avatar" :size="50" />
            </div>
            <div class="user-preview__info">
                <p class="user-preview__title mb-1">
                    <span class="user-preview__name">{{ user.userProfile.medium_name }}</span>
                    <span class="user-preview__role">{{ role }}{{ isSelf ? ' (Вы)' : '' }}</span>
                </p>
                <span
                    v-if="user.is_online"
                    class="user-preview__status dashboard-bg-success dashboard-cl-white"
                >
                    Онлайн
                </span>
                <span
                    v-else
                    v-tippy="'Был активен последний раз'"
                    class="user-preview__status dashboard-bg-gray-l"
                >
                    {{ lastSeen }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { userOptions } from '@/const/options/user.options.js';
import { dayjsFromMoscow } from '@/utils/index.js';
import { useStore } from 'vuex';

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const store = useStore();

const role = computed(() => userOptions.role[props.user.role]);
const lastSeen = computed(() => {
    if (!props.user.last_seen) return 'Неизвестно..';

    const dayjsDate = dayjsFromMoscow(props.user.last_seen);

    return dayjsDate.fromNow();
});

const isSelf = computed(() => {
    return props.user.id === store.state.User.user.id;
});
</script>
