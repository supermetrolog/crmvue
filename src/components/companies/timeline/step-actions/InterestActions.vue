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
                :disabled="disabled"
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