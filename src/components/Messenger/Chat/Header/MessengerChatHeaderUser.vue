<template>
    <div class="messenger-chat-header-user">
        <Avatar :src="dialog.model.userProfile.avatar" class="messenger-chat-header-user__avatar" />
        <div class="messenger-chat-header-user__description">
            <p class="messenger-chat-header-user__title">
                Чат с {{ dialog.model.userProfile.medium_name }}
            </p>
        </div>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';

defineProps({
    dialog: {
        type: Object,
        required: true
    }
});
</script>
