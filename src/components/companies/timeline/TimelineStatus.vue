<template>
  <div v-if="request.status == 2">
    <h3 class="text-success m-0">ЗАВЕРШЕН</h3>
  </div>
  <div v-else-if="request.status == 0">
    <h3 class="text-warning m-0 d-inline">ПАССИВ</h3>
    <i class="ml-1 text-dark m-0 d-inline"
      >({{
        passiveWhyOptions.find((elem) => elem.value == request.passive_why)
          .label
      }})</i
    >
    <i class="ml-1 text-dark m-0 d-inline">
      - {{ request.passive_why_comment }}</i
    >
  </div>
  <div v-else-if="timeline && timeline.status == 0">
    <h3 class="text-warning m-0">НЕАКТИВЕН</h3>
  </div>
</template>

<script>
import { PassiveWhyRequest } from "@/const/Const";
export default {
  name: "timelineStatus",
  data() {
    return {
      passiveWhyOptions: PassiveWhyRequest.get("param"),
    };
  },
  props: {
    request: {
      type: Object,
      required: true,
    },
    timeline: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>