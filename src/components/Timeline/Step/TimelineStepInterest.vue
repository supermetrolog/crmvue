<template>
    <div class="col-12 px-0">
        <TimelineStepStage
            class="mb-2"
            :title="
        'Шаг 1. Отметить объекты, которые осмотрели' +
        (data.timelineStepObjects.length
          ? ` (${data.timelineStepObjects.length})`
          : '')
      "
            :isDone="!!data.timelineStepObjects.length"
            :closeSlotWhenDone="false"
            :isCurrent="!data.timelineStepObjects.length"
        >
            <ButtonList
                v-if="!disabled"
                :buttons="buttons"
                @done="$emit('done')"
                @negative="$emit('negative')"
            />
        </TimelineStepStage>
    </div>
</template>

<script>
import {MixinSteps} from "@/components/Timeline/mixins.js";

export default {
    name: "TimelineStepInterest",
    mixins: [MixinSteps],
    emits: ["done", "negative"],
};
</script>

<style>
</style>