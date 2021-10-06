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
          <div class="time">
            отметить объекты, которые планиурете осмотреть
            <strong v-if="step.timelineStepObjects.length"
              >({{ step.timelineStepObjects.length }})</strong
            >
          </div>
        </li>
        <li>
          <i class="fas fa-check-circle success" v-if="step.additional"></i>
          <i class="fas fa-circle" v-else></i>
          <div class="time">
            отправить всю необходимую информацию по объектам клиенту
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Inspection",
  props: {
    step: {
      type: Object,
    },
  },
};
</script>

<style>
</style>