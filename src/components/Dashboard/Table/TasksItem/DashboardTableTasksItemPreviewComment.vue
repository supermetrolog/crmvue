<template>
    <div class="dashboard-task-item-preview-comment">
        <div class="dashboard-task-item-preview-comment__content">
            <p>{{ comment.message }}</p>
        </div>
        <div class="dashboard-task-item-preview-comment__footer">
            <span>{{ comment.created_by.userProfile.medium_name }}</span>
            <span>{{ createdAt }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatter.js';

const props = defineProps({
    comment: {
        type: Object,
        required: true
    }
});

const createdAt = computed(() => toDateFormat(props.comment.created_at));
</script>
