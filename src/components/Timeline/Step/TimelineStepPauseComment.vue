<template>
    <div>
        <p class="text-grey mb-1">Комментарий к паузе:</p>
        <div class="timeline-step-comment">
            <Avatar :src="user.userProfile.avatar" :size="30" />
            <div class="timeline-step-comment__content">
                <div class="timeline-step-comment__header">
                    <span class="timeline-step-comment__username">
                        {{ user.userProfile.medium_name }}
                    </span>
                    <span class="timeline-step-comment__dot mx-1">·</span>
                    <span class="timeline-step-comment__date">{{ updatedAt }}</span>
                </div>
                <div>{{ step.comment }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import Avatar from '@/components/common/Avatar.vue';

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    step: {
        type: Object,
        required: true
    }
});

const updatedAt = computed(() => toBeautifulDateFormat(props.step.updated_at));
</script>
