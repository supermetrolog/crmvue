<template>
  <div
    class="timeline-container col-12"
    :class="[
      stepParam[data.number][1].class,
      stepParam[data.number][1].stepName,
    ]"
  >
    <div class="timeline-icon">
      <i :class="stepParam[idx][1].icon"></i>
    </div>
    <div
      class="timeline-body"
      :class="{ selected: this.$route.query.step == data.number }"
    >
      <Loader class="center small" v-if="loader == data.id" />
      <h4 class="timeline-title" @click="clickSelectStep()">
        <span class="badge-1">{{ stepParam[data.number][1].name }}</span>
      </h4>
      <hr />
      <div class="row no-gutters">
        <slot
          name="actions"
          :stepName="stepParam[data.number][1].stepName + 'Timeline'"
          :disabled="disabled"
        ></slot>
      </div>

      <div class="row mt-2">
        <div class="col-4 align-self-end ml-auto">
          <p class="timeline-subtitle">{{ data.created_at }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Timeline } from "@/const/Const";
import Loader from "@/components/Loader";
export default {
  name: "TimelineItem",
  components: {
    Loader,
  },
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
    loader: {
      type: [Number, Boolean],
      default: false,
    },
  },
  computed: {
    disabled() {
      return this.$route.query.step == this.data.number ? false : true;
    },
  },
  methods: {
    clickSelectStep() {
      this.$emit("clickItem", this.data);
    },
  },
  emits: ["updateItem", "clickItem"],
};
</script>

<style>
</style>