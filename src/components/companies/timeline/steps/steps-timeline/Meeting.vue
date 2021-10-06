<template>
  <div class="col-12 step-timeline-container mt-2">
    <div class="wrapper">
      <ul class="sessions">
        <li>
          <i class="fas fa-check-circle success" v-if="step.done"></i>
          <i class="fas fa-circle" v-else></i>
          <div class="time">позвонить клиенту</div>
        </li>
        <li>
          <i class="fas fa-check-circle success" v-if="step.additional"></i>
          <i class="fas fa-circle" v-else></i>
          <div class="time">утвердить запрос</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Meeting",
  props: {
    step: {
      type: Object,
    },
  },
};
</script>

<style>
</style>