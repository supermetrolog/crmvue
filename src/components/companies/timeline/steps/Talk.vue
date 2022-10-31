<template>
  <div class="col-12 px-0">
    <StepStage
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
        :buttons="buttons"
        @done="$emit('done')"
        @negative="$emit('negative')"
      />
    </StepStage>
  </div>
</template>

<script>
import { MixinSteps } from "../mixins";
export default {
  name: "Offers",
  emits: ["done", "negative"],
  mixins: [MixinSteps],
};
</script>

<style>
</style>