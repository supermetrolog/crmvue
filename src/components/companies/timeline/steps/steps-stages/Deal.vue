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
          <div class="time">Выбрать объект, по которому произошла сделка</div>
        </li>
        <li>
          <i class="fas fa-check-circle success" v-if="deal"></i>
          <i class="fas fa-circle" v-else></i>
          <div class="time">заполнить данные по сделке</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Deal",
  props: {
    step: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["COMPANY_REQUESTS"]),
    deal() {
      return this.COMPANY_REQUESTS.find(
        (item) => item.id == this.$route.query.request_id
      ).deal;
    },
  },
};
</script>

<style>
</style>