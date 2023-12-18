<template>
    <div class="col-12 px-0">
        <TimelineStepStage
            class="mb-2"
            :title="
                'Шаг 1. Отметить объекты, которые осмотрели' +
                (data.timelineStepObjects.length ? ` (${data.timelineStepObjects.length})` : '')
            "
            :is-done="!!data.timelineStepObjects.length"
            :close-slot-when-done="false"
            :is-current="!data.timelineStepObjects.length"
        >
            <ButtonList v-if="!disabled" @done="$emit('done')" @negative="$emit('negative')" :buttons="buttons" />
        </TimelineStepStage>
    </div>
</template>

<script>
import { MixinSteps } from '@/components/Timeline/mixins.js';

export default {
    name: 'TimelineStepInterest',
    mixins: [MixinSteps],
    emits: ['done', 'negative']
};
</script>

<style></style>
