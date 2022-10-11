<template>
  <div class="step-actions row no-gutters">
    <div class="col-12">
      <div class="timeline-actions row no-gutters">
        <div
          v-for="(button, index) in buttons"
          :key="index"
          :class="button.classes"
        >
          <CustomButton
            :title="button.title"
            :options="button"
            @confirm="$emit(button.emited_event, $event)"
          >
            <template #btnContent>
              <i :class="button.icon"></i>
              <span class="ml-1">{{ button.text }}</span>
            </template>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/common/CustomButton.vue";
export default {
  name: "StepActions",
  emits: [
    "reset",
    "done",
    "negative",
    "updateRequest",
    "callback",
    "openExtraVisible",
    "closeExtraVisible",
  ],
  components: {
    CustomButton,
  },
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>