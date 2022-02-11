<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2" v-if="CURRENT_STEP_OBJECTS.length">
          <div class="col-12">
            <div class="timeline-actions row">
              <Inspection
                :step="step"
                :disabled="disabled"
                @updateItem="clickUpdateStep"
                :contactForSendMessage="contactForSendMessage"
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
import Inspection from "../steps/Inspection.vue";
import { mapGetters } from "vuex";
import { MixinStepActions } from "../mixins";
import { MixinObject } from "../../objects-new/mixins";

export default {
  name: "InspectionActions",
  mixins: [MixinStepActions, MixinObject],
  components: {
    Inspection,
  },
  computed: {
    ...mapGetters(["CURRENT_STEP_OBJECTS"]),
  },
  methods: {
    updatedObjects(data, fn = null) {
      this.$emit("updatedObjects", data, false, fn);
    },
  },
};
</script>

<style>
</style>