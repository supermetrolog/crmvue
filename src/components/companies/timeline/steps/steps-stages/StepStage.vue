<template>
  <div
    class="step-stage"
    :class="{
      isDone: isDone,
      isCurrent: isCurrent && !isDone,
      readyToClick: !stageIsActive,
    }"
    @click="stageClicked"
  >
    <div class="wrapper">
      <div class="row no-gutters">
        <div class="col-11">
          <p class="step-stage__title">
            <i class="fas fa-caret-right"></i>{{ title }}
          </p>
        </div>
        <div class="col-1 text-right align-self-center">
          <i class="fas fa-check-circle success_check" v-if="isDone"></i>
        </div>
      </div>
      <div class="slot" v-if="stageIsActive" @click.stop>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StepStage",
  props: {
    title: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    closeSlotWhenDone: {
      type: Boolean,
      default: true,
    },
    isClicked: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: null,
    },
  },
  computed: {
    stageIsActive() {
      return (
        (!this.isDone && this.isCurrent) ||
        (!this.closeSlotWhenDone && this.isDone) ||
        (this.isClicked && this.isDone) ||
        (this.isClicked && this.isCurrent)
      );
    },
  },
  methods: {
    stageClicked() {
      if (this.id) {
        this.$emit("stageClicked", this.id);
      }
    },
  },
  emits: ["stageClicked"],
};
</script>

<style>
</style>