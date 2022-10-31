<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row">
          <div class="col-12">
            <Objects>
              <Talk
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
import Talk from "../steps/Talk.vue";
import { TalkDoneComment, TalkOffersNotFound } from "../comments/commenst";

export default {
  name: "TalkActions",
  mixins: [MixinStepActions, MixinObject],
  components: {
    Talk,
  },
  methods: {
    updatedObjects(data) {
      this.$emit("updatedObjects", data, true);
    },
    getNegativeComment(step) {
      return [new TalkOffersNotFound(step)];
    },
    getDoneComment(step) {
      return [new TalkDoneComment(step, this.selectedObjects)];
    },
  },
};
</script>

<style>
</style>