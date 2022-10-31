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