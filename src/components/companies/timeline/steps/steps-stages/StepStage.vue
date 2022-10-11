<template>
  <div
    class="step-stage"
    :class="{ isDone: isDone, isCurrent: isCurrent && !isDone }"
  >
    <div class="wrapper">
      <div class="row no-gutters">
        <div class="col-11">
          <p class="step-stage__title">{{ title }}</p>
        </div>
        <div class="col-1 text-right align-self-center">
          <i class="fas fa-check-circle isDone" v-if="isDone"></i>
        </div>
      </div>
      <div v-if="!isDone && isCurrent">
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
  },
};
</script>

<style>
</style>