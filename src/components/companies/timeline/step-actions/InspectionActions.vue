<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2" v-if="CURRENT_STEP_OBJECTS.length">
          <div class="col-12">
            <div class="timeline-actions row">
              <Inspection :step="step" @updateItem="clickUpdateStep" />
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <Objects
              :step="step"
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

export default {
  name: "InspectionActions",
  components: {
    Inspection,
    Objects,
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
  },
  computed: {
    ...mapGetters(["CURRENT_STEP_OBJECTS"]),
  },
  methods: {
    clickUpdateStep(data, flag) {
      this.$emit("updateStep", data, flag);
    },
    updatedObjects(data) {
      this.$emit("updatedObjects", data);
    },
  },
  emits: ["updateStep", "updatedObjects"],
};
</script>

<style>
</style>