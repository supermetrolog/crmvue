<template>
  <div class="col-12 step-timeline-container mt-2">
    <div class="wrapper">
      <ul class="sessions">
        <li>
          <i
            class="fas fa-check-circle success"
            v-if="step.additional == 1"
          ></i>
          <i class="fas fa-circle" v-else></i>
          <div class="time">поговорить с клиентом</div>
        </li>
        <li>
          <i class="fas fa-check-circle success" v-if="step.done"></i>
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