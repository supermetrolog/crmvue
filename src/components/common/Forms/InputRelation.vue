<template>
    <div class="input-relation">
        <DashboardChip :class="hasWarning ? 'dashboard-bg-warning' : 'dashboard-bg-light'">
            <span class="mr-1">{{ label }}</span>
            <slot />
        </DashboardChip>
    </div>
</template>

<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';

const props = defineProps({
    label: {
        type: String,
        default: 'из'
    },
    original: {
        type: Number,
        required: true
    },
    related: {
        type: Number,
        required: true
    },
    less: {
        type: Boolean,
        default: false
    }
});

const hasWarning = computed(() => {
    if (props.less) return props.original < props.related;
    return props.original > props.related;
});
</script>
