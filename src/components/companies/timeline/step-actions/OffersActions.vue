<template>
  <div class="step-action">
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
              :disabled="disabled"
              :contactForSendMessage="contactForSendMessage"
              :searchable="true"
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
import { MixinStepActions } from "../mixins";

export default {
  name: "OffersActions",
  mixins: [MixinStepActions],
  components: {
    // Offers,
    Objects,
  },
  methods: {
    updatedObjects(data) {
      this.$emit("updatedObjects", data, true);
    },
  },
};
</script>

<style>
</style>