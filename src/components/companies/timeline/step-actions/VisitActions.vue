<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
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
import Objects from "../../objects/Objects.vue";
import { MixinStepActions } from "../mixins";

export default {
  name: "VisitActions",
  mixins: [MixinStepActions],
  components: {
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