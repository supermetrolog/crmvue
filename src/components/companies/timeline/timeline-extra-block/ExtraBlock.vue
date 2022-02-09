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
        <Reminders :data="step" />
      </div>
      <div class="col-12 mt-4">
        <div class="row no-gutters">
          <div class="col-12">
            <h5 class="mt-0 mb-1 text-center">Комментарии к действиям</h5>
            <div class="reminders">
              <ul
                class="comments"
                v-for="timelineStep in TIMELINE.timelineSteps"
                :key="timelineStep.id"
              >
                <li class="text-center">
                  <span
                    class="badge autosize"
                    :class="
                      'badge-' +
                      timelineStepOptions[timelineStep.number][1].class
                    "
                  >
                    {{ timelineStepOptions[timelineStep.number][1].name }}
                  </span>
                </li>
                <li
                  v-for="comment in timelineStep.timelineActionComments"
                  :key="comment.id"
                >
                  <div class="row no-gutters reminders-list-item m-0">
                    <div class="col-12 text-center">
                      <i class="far fa-clock d-inline-block mr-1"></i>
                      <p class="time">{{ comment.created_at }}</p>
                    </div>
                    <div
                      class="col-12 mb-1"
                      :class="{ 'text-right': comment.title == 'система' }"
                    >
                      <p
                        class="text-success"
                        :class="{
                          'text-success_alt': comment.title == 'система',
                        }"
                      >
                        {{ comment.title || "&#8212;" }}
                      </p>
                    </div>

                    <div class="col-12 comment">
                      <p v-html="comment.comment"></p>
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
import { mapGetters } from "vuex";
import { Timeline } from "@/const/Const";
export default {
  name: "ExtraBlock",
  components: {
    Reminders,
  },
  data() {
    return {
      timelineStepOptions: Timeline.get("param"),
      stepComment: null,
      saveCommentBtnVisible: false,
    };
  },
  props: {
    step: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["TIMELINE_COMMENTS", "TIMELINE"]),
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