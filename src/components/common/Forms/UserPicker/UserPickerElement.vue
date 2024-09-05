<template>
    <div class="user-picker-element" :class="{ disabled: !selected }">
        <Avatar :src="user.userProfile.avatar" size="50" />
        <div class="user-picker-element__description">
            <p class="user-picker-element__username">{{ user.userProfile.medium_name }}</p>
            <p class="user-picker-element__role">{{ role }}</p>
        </div>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed } from 'vue';
import { userOptions } from '@/const/options/user.options.js';

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    }
});

const role = computed(() => userOptions.role[props.user.role] || 'Должность не установлена');
</script>
