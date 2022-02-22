<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2">
          <div class="col-12">
            <div class="timeline-actions row">
              <Feedback
                :step="step"
                @updateItem="clickUpdateStep"
                :disabled="disabled"
              />
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <Objects>
              <ObjectsControllPanel
                :viewMode="viewMode"
                :buttons="buttons"
                @reset="reset"
                @done="done"
                @send="send"
                @negative="negative"
                @changeViewMode="changeViewMode"
              />
              <ObjectsList
                :objects="preventStepObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :withSeparator="true"
                :loader="loader"
                :viewMode="viewMode"
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
  },
};
</script>

<style>
</style>