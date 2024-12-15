<template>
    <DashboardChip class="dashboard-bg-success-l w-100">
        <p>{{ comment.comment }}</p>
        <p>
            <small>
                <span>{{ comment.author.userProfile.medium_name }}</span>
                <span class="text-grey ml-1">
                    {{ createdAt }}
                </span>
            </small>
        </p>
    </DashboardChip>
</template>
<script setup>
import { computed } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { toDateFormat } from '@/utils/formatters/date.js';

const props = defineProps({
    comment: {
        type: Object,
        required: true
    }
});

const createdAt = computed(() => toDateFormat(props.comment.created_at));
</script>
