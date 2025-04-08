<template>
    <div class="timeline-tree skeleton-body">
        <div class="timeline-tree__progress">
            <span class="timeline-tree__line"></span>
            <TimelineTreeStepSkeleton v-for="step in steps" :key="step.id" :step="step" />
        </div>
    </div>
</template>

<script setup>
import { Timeline as steps } from '@/const/const.js';
import TimelineTreeStepSkeleton from '@/components/Timeline/Tree/Skeleton/TimelineTreeStepSkeleton.vue';
</script>
