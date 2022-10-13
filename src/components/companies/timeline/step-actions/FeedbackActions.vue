<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row">
          <div class="col-12">
            <Objects>
              <StepStage
                class="mb-2 sticky px-2"
                :title="
                  'Шаг 1. отметить объекты, которые заинтересовали клиента' +
                  (step.timelineStepObjects.length
                    ? ` (${step.timelineStepObjects.length})`
                    : '')
                "
                :isDone="!!step.timelineStepObjects.length"
                :closeSlotWhenDone="false"
                :isCurrent="!step.timelineStepObjects.length"
              >
                <ObjectsControllPanel
                  :viewMode="viewMode"
                  :buttons="buttons"
                  @reset="reset"
                  @done="done"
                  @send="send"
                  @alreadySent="alreadySent"
                  @negative="negative"
                />
              </StepStage>
              <StepStage
                class="mb-2 px-2"
                title="Шаг 2. Отметить каким способом была получена обратная связь"
                :isDone="!!step.timelineStepFeedbackways.length"
                :closeSlotWhenDone="false"
                :isCurrent="!step.timelineStepFeedbackways.length"
              >
                <Feedback
                  :step="step"
                  @updateItem="clickUpdateStep"
                  :disabled="disabled"
                />
              </StepStage>
              <ObjectsList
                :objects="preventStepObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :withSeparator="true"
                :loader="loader"
                :viewMode="viewMode"
                :currentStepId="step.id"
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
              />
            </Objects>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Feedback from "../steps/Feedback.vue";
import StepStage from "../steps/steps-stages/StepStage.vue";
import { MixinStepActions } from "../mixins";
import { MixinObject } from "../../objects/mixins";

export default {
  name: "FeedbackActions",
  mixins: [MixinStepActions, MixinObject],
  components: {
    Feedback,
    StepStage,
  },
  methods: {
    updatedObjects(data, fn) {
      this.$emit("updatedObjects", data, false, fn);
    },
  },
};
</script>

<style>
</style>