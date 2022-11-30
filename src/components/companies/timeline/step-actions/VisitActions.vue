<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row">
          <div class="col-12">
            <Objects>
              <Visit
                :step="step"
                :buttons="buttons"
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
import Visit from "../steps/Visit.vue";
import { VisitDoneComment, VisitOffersNotFound } from "../comments/commenst";
export default {
  name: "VisitActions",
  mixins: [MixinStepActions, MixinObject],
  components: {
    Visit,
  },
  methods: {
    updatedObjects(data) {
      this.$emit("updatedObjects", data, true);
    },
    getNegativeComment(step) {
      return [new VisitOffersNotFound(step)];
    },
    getDoneComment(step) {
      return [new VisitDoneComment(step, this.selectedObjects)];
    },
  },
};
</script>

<style>
</style>