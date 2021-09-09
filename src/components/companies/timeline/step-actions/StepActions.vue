<template>
  <div class="step-actions">
    <div class="row no-gutters mb-3">
      <div class="col-12">
        <button class="btn btn-primary btn-large">сохранить изменения</button>
      </div>
    </div>
    <div class="row no-gutters inner">
      <div class="col-12 text-center">
        <h5 class="mt-0 mb-3">Комментарий</h5>
        <textarea v-model.trim="step.comment" @input="inputComment"></textarea>
        <button
          class="btn btn-primary btn-large"
          v-show="saveCommentBtnVisible"
        >
          сохранить
        </button>
      </div>

      <div class="col-12 mt-3">
        <h5 class="mt-0 mb-1 text-center">
          Напоминания <i class="far fa-bell"></i>
        </h5>
        <Reminders :data="selectedStep" />
      </div>
    </div>
  </div>
</template>

<script>
import Reminders from "@/components/Reminders";
export default {
  name: "StepActions",
  components: {
    Reminders,
  },
  data() {
    return {
      step: {},
      saveCommentBtnVisible: false,
    };
  },
  props: {
    selectedStep: {
      type: Object,
      required: true,
    },
  },
  methods: {
    inputComment() {
      if (this.step.comment != this.selectedStep.comment) {
        this.saveCommentBtnVisible = true;
      } else {
        this.saveCommentBtnVisible = false;
      }
    },
  },
  created() {
    this.step = { ...this.selectedStep };
  },
  watch: {
    selectedStep() {
      this.step = this.selectedStep;
    },
  },
};
</script>

<style>
</style>