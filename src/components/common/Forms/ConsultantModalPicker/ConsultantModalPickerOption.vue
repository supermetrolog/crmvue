<template>
    <div class="consultant-picker-option consultant-picker-option-chip">
        <Avatar
            ref="avatar"
            class="consultant-picker-option-chip__avatar"
            :src="option.avatar"
            :size="25"
        />
        <span>{{ option.userProfile.medium_name }}</span>
        <i
            @click="$emit('remove')"
            class="fa-regular fa-circle-xmark consultant-picker-option-chip__close"
        ></i>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';

defineEmits(['remove']);

defineProps({
    option: {
        type: Object,
        required: true
    }
});
</script>
