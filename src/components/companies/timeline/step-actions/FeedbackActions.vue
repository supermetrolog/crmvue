<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2">
          <div class="col-12">
            <div class="timeline-actions row">
              <Feedback :step="step" @updateItem="clickUpdateStep" />
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
import Feedback from "../steps/Feedback.vue";
import Objects from "../../objects/Objects.vue";

export default {
  name: "FeedbackActions",
  components: {
    Feedback,
    Objects,
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
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