<template>
  <div class="extra-block">
    <div class="row no-gutters inner scroller">
      <div class="col-12 text-center">
        <h5 class="mt-0 mb-1">Общий комментарий</h5>
        <textarea v-model.trim="stepComment" @input="inputComment"></textarea>
        <button
          class="btn btn-primary btn-large"
          v-show="saveCommentBtnVisible"
        >
          сохранить
        </button>
      </div>
      <div class="col-12 mt-4">
        <h5 class="mt-0 mb-1 text-center">
          Напоминания <i class="far fa-bell"></i>
        </h5>
        <Reminders :data="selectedStep" />
      </div>
      <div class="col-12 mt-4">
        <div class="row no-gutters">
          <div class="col-12">
            <h5 class="mt-0 mb-1 text-center">Комментарии к действиям</h5>
            <div class="reminders">
              <ul class="comments">
                <li
                  v-for="comment in step.timelineActionComments"
                  :key="comment.id"
                >
                  <div class="row no-gutters reminders-list-item m-0">
                    <div class="col-12 text-right">
                      <i class="far fa-clock d-inline-block mr-1"></i>

                      <p class="time">{{ comment.created_at }}</p>
                    </div>
                    <div class="col-12">
                      <p class="text-success_alt">
                        {{ comment.title || "&#8212;" }}
                      </p>
                    </div>

                    <div class="col-12 comment">
                      <p>
                        {{ comment.comment }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Reminders from "@/components/Reminders";

export default {
  name: "ExtraBlock",
  components: {
    Reminders,
  },
  data() {
    return {
      stepComment: null,
      saveCommentBtnVisible: false,
    };
  },
  props: {
    step: {
      type: Array,
    },
  },
  methods: {
    inputComment() {
      if (this.step.comment != this.stepComment) {
        this.saveCommentBtnVisible = true;
      } else {
        this.saveCommentBtnVisible = false;
      }
    },
  },
  mounted() {
    this.stepComment = this.step.comment;
  },
  watch: {
    step() {
      this.stepComment = this.step.comment;
    },
  },
};
</script>

<style>
</style>