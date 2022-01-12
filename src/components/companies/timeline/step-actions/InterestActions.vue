<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
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
import Objects from "../../objects/Objects.vue";

export default {
  name: "InterestActions",
  components: {
    Objects,
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
    contactForSendMessage: {
      type: Array,
    },
  },
  methods: {
    clickUpdateStep(data, flag) {
      this.$emit("updateStep", data, flag);
    },
    updatedObjects(data, fn = null) {
      this.$emit("updatedObjects", data, true, fn);
    },
  },
  emits: ["updateStep", "updatedObjects"],
};
</script>

<style>
</style>