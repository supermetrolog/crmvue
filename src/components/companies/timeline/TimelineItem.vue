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
      <textarea
        ref="timelineCommentTextarea"
        class="timeline-comment"
        :class="{
          minimization: (!data.comment || data.comment.length == 0) && disabled,
        }"
        :style="textareaHeight"
        :disabled="disabled"
        @keydown.enter.prevent
        v-model="comment"
      ></textarea>
      <hr />
      <div class="row no-gutters timeline-actions">
        <slot
          name="actions"
          :stepName="stepParam[data.number][1].stepName"
          :disabled="disabled"
          :isConfirmed="isConfirmed"
        ></slot>
      </div>

      <div class="row mt-2">
        <div class="col-4 align-self-end">
          <p class="timeline-subtitle">{{ data.created_at }}</p>
        </div>
        <div class="col-8 timeline-item-control text-right">
          <div class="disabledAction" v-if="disabled">
            <a class="btn-action" @click.prevent="clickUnDisabled">
              <i class="fas fa-pencil-alt"></i>
            </a>
          </div>
          <div class="undisabledAction" v-if="!disabled">
            <a class="btn-action" @click.prevent="clickConfirm">
              <i class="fas fa-check"></i>
            </a>
            <a
              class="btn-action second text-danger"
              @click.prevent="clickCancel"
            >
              <i class="fas fa-times"></i>
            </a>
          </div>
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
      comment: "",
      disabled: true,
      isConfirmed: false,
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
    textareaHeight() {
      if (!this.data.comment) {
        return "0px";
      }
      return {
        height:
          Math.ceil(this.comment.length / 57) * 18 +
          Math.ceil(this.comment.length / 57) * 3 +
          "px",
      };
    },
  },
  mounted() {
    if (this.data.comment) {
      this.comment = this.data.comment;
    } else {
      this.comment = "";
    }
  },
  methods: {
    clickUnDisabled() {
      this.disabled = false;
      this.$nextTick(() => this.$refs.timelineCommentTextarea.focus());
    },
    clickDisabled() {
      this.disabled = true;
    },
    clickCancel() {
      this.comment = this.data.comment;
      this.isConfirmed = false;
      this.clickDisabled();
    },
    clickConfirm() {
      this.clickDisabled();
      this.isConfirmed = true;
      this.$emit("updateItem", this.comment);
    },
    clickSelectStep() {
      this.$emit("clickItem", this.data);
    },
  },
  emits: ["updateItem", "clickItem"],
};
</script>

<style>
</style>