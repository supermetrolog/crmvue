<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row">
          <div class="col-12">
            <Objects>
              <Feedback
                :step="step"
                :disabled="disabled"
                :buttons="buttons"
                @updateItem="clickUpdateStep"
                @done="done"
                @negative="negative"
              />
              <ObjectsList
                :objects="submittedObjects"
                :disabled="true"
                :loader="loader"
                :viewMode="viewMode"
                :currentStepId="step.id"
                :label="
                  'Выбранные предложения' +
                  (submittedObjects.length
                    ? ` (${submittedObjects.length})`
                    : '')
                "
                class="success"
                v-if="submittedObjects?.length"
              />
              <ObjectsList
                :objects="notSubmittedObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :withSeparator="true"
                :loader="loader"
                :viewMode="viewMode"
                :currentStepId="step.id"
                :label="
                  submittedObjects?.length
                    ? `Оставшиеся предложения (${notSubmittedObjects.length})`
                    : ''
                "
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
                v-if="
                  notSubmittedObjects.length ||
                  (!submittedObjects.length && !notSubmittedObjects.length)
                "
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
import { MixinStepActions } from "../mixins";
import { MixinObject } from "../../objects/mixins";
import {
  FeedbackDoneComment,
  FeedbackOffersNotFoundComment,
} from "../comments/commenst";

export default {
  name: "FeedbackActions",
  mixins: [MixinStepActions, MixinObject],
  components: {
    Feedback,
  },
  methods: {
    updatedObjects(data, fn) {
      this.$emit("updatedObjects", data, false, fn);
    },
    getNegativeComment(step) {
      return [new FeedbackOffersNotFoundComment(step)];
    },
    getDoneComment(step) {
      return [new FeedbackDoneComment(step)];
    },
  },
};
</script>

<style>
</style>