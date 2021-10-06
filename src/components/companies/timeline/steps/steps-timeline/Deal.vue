<template>
  <div class="col-12 step-timeline-container mt-2">
    <div class="wrapper">
      <ul class="sessions">
        <li>
          <i
            class="fas fa-check-circle success"
            v-if="step.timelineStepObjects.length"
          ></i>
          <i class="fas fa-circle" v-else></i>
          <div class="time">заполнить данные по сделке</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Deal",
  props: {
    step: {
      type: Object,
    },
  },
};
</script>

<style>
</style>