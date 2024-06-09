<template>
    <div class="timeline-tree">
        <p class="timeline-tree__title">Прогресс таймлайна</p>
        <div class="timeline-tree__progress">
            <span class="timeline-tree__line"></span>
            <TimelineTreeStep
                v-for="step in steps"
                :key="step.id"
                @select="$emit('select', $event)"
                :step="step"
                :selected="selected"
                :current="current"
            />
        </div>
    </div>
</template>

<script>
import TimelineTreeStep from '@/components/Timeline/TimelineTreeStep.vue';
import { Timeline } from '@/const/const.js';

export default {
    name: 'TimelineTree',
    components: { TimelineTreeStep },
    emits: ['select'],
    props: {
        current: {
            type: Array,
            default: () => []
        },
        selected: {
            type: Number,
            default: null
        }
    },
    computed: {
        steps: () => Timeline
    }
};
</script>
