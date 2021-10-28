<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2">
          <div class="col-6">
            <div class="timeline-actions row">
              <!-- <Offers :step="step" @updateItem="clickUpdateStep" /> -->
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <Objects
              :step="step"
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
// import Offers from "../steps/Offers.vue";
import Objects from "../../objects/Objects.vue";

export default {
  name: "OffersActions",
  components: {
    // Offers,
    Objects,
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
    currentRequest: {
      type: Object,
    },
    contactForSendMessage: {
      type: Array,
    },
  },
  methods: {
    clickUpdateStep(data, flag) {
      this.$emit("updateStep", data, flag);
    },
    updatedObjects(data) {
      this.$emit("updatedObjects", data, true);
    },
  },
  emits: ["updateStep", "updatedObjects"],
};
</script>

<style>
</style>