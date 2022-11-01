<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row">
          <div class="col-12">
            <Objects>
              <Interest
                :step="step"
                :buttons="buttons"
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
import { MixinStepActions } from "../mixins";
import { MixinObject } from "../../objects/mixins";
import Interest from "../steps/Interest.vue";
import {
  InterestDoneComment,
  InterestOffersNotFound,
} from "../comments/commenst";

export default {
  name: "InterestActions",
  mixins: [MixinStepActions, MixinObject],
  components: {
    Interest,
  },
  methods: {
    updatedObjects(data, fn = null) {
      this.$emit("updatedObjects", data, true, fn);
    },
    getNegativeComment(step) {
      return [new InterestOffersNotFound(step)];
    },
    getDoneComment(step) {
      return [new InterestDoneComment(step, this.selectedObjects)];
    },
  },
};
</script>

<style>
</style>