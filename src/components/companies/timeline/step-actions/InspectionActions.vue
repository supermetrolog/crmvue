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
            <Objects
              :step="step"
              :disabled="disabled"
              :contactForSendMessage="contactForSendMessage"
              @updated="updatedObjects"
              @updateItem="clickUpdateStep"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Inspection from "../steps/Inspection.vue";
import Objects from "../../objects/Objects.vue";
import { mapGetters } from "vuex";
import { MixinStepActions } from "../mixins";

export default {
  name: "InspectionActions",
  mixins: [MixinStepActions],
  components: {
    Inspection,
    Objects,
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