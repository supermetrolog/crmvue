<template>
    <div class="timeline-tree-item">
        <TimelineTreeStepRowSkeleton :step :icon="step.icon" />
        <div v-if="step.steps?.length" class="timeline-tree-item__steps">
            <TimelineTreeStepPointSkeleton
                v-for="point in step.steps"
                :key="point.id"
                point
                :step="point"
            />
        </div>
    </div>
</template>

<script setup>
import TimelineTreeStepPointSkeleton from '@/components/Timeline/Tree/Skeleton/TimelineTreeStepPointSkeleton.vue';
import TimelineTreeStepRowSkeleton from '@/components/Timeline/Tree/Skeleton/TimelineTreeStepRowSkeleton.vue';

defineProps({
    step: {
        type: Object,
        required: true
    }
});
</script>
