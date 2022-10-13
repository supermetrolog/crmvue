<template>
  <div class="col-12">
    <StepStage
      class="mb-2 px-2"
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
      <ObjectsControllPanel
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
  mixins: [MixinSteps],
  emits: ["done", "negative"],
};
</script>

<style>
</style>