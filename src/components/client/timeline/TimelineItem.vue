<template>
  <div class="timeline-container" :class="stepParam[idx][1].class">
    <div class="timeline-icon">
      <i class="far fa-grin-wink"></i>
    </div>
    <div class="timeline-body">
      <h4 class="timeline-title">
        <span class="badge-1">{{ stepParam[idx][1].name }}</span>
      </h4>
      <p>
        {{ data.comment }}
      </p>
      <p class="timeline-subtitle">{{ data.datetime }}</p>
    </div>
  </div>
</template>

<script>
import { Timeline } from "../../../const/Const";
export default {
  name: "TimelineItem",
  data() {
    return {
      stepParam: Timeline.get("param"),
    };
  },
  props: {
    data: {
      type: Object,
    },
    idx: {
      type: Number,
    },
  },
  mounted() {
    console.log(this.idx);
  },
};
</script>

<style>
</style>