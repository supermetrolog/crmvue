<template>
    <div class="task-card-history-event__content">
        <div class="d-flex align-items-center">
            <div v-if="prevSnapshot" class="task-card-history-event__assigner">
                <Avatar
                    :src="prevSnapshot.user.userProfile.avatar"
                    :size="20"
                    :label="prevSnapshot.user.userProfile.medium_name"
                />
                <span>{{ prevSnapshot.user.userProfile.medium_name }}</span>
            </div>
            <div v-else class="task-card-history-event__assigner">
                <AvatarEmpty contact="Неизвестно.." :size="30" />
            </div>
            <i class="fa-solid fa-arrow-right-long mx-3"></i>
            <div class="task-card-history-event__assigner">
                <Avatar
                    :src="snapshot.user.userProfile.avatar"
                    :size="20"
                    :label="snapshot.user.userProfile.medium_name"
                />
                <span>{{ snapshot.user.userProfile.medium_name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from '@/components/common/Avatar.vue';
import AvatarEmpty from '@/components/common/AvatarEmpty.vue';

defineProps({
    snapshot: {
        type: Object,
        required: true
    },
    prevSnapshot: {
        type: Object,
        required: true
    }
});
</script>
