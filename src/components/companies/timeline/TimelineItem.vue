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
            <a class="btn-action" @click.prevent="toggleDisabled">
              <i class="fas fa-pencil-alt"></i>
            </a>
          </div>
          <div class="undisabledAction" v-if="!disabled">
            <a class="btn-action" @click.prevent="clickConfirm(data)">
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
      <a class="btn-action create-new-item" @click.prevent="clickCreateNewItem">
        <i class="fas fa-caret-down"></i>
      </a>
    </div>
  </div>
</template>

<script>
import { Timeline } from "@/const/Const";
export default {
  name: "TimelineItem",
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
    toggleDisabled() {
      this.disabled = !this.disabled;
      this.$nextTick(() => this.$refs.timelineCommentTextarea.focus());
    },
    clickCancel() {
      this.comment = this.data.comment;
      this.isConfirmed = false;
      this.toggleDisabled();
    },
    clickConfirm(data) {
      this.toggleDisabled();
      this.isConfirmed = true;
      data.comment = this.comment;
      this.$emit("updateItem", data);
    },
    clickCreateNewItem() {
      this.$emit("createNewItem", {
        item: this.data,
        currentBranch: this.currentBranch,
      });
    },
    clickSelectStep() {
      this.$emit("clickItem", this.data);
    },
  },
  emits: ["updateItem", "createNewItem", "clickItem"],
};
</script>

<style>
</style>