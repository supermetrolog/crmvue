<template>
  <div class="col company-form" v-if="data">
    <div class="row no-gutters mb-0" v-if="data.timelineStepObjects.length">
      <div class="col">
        <p>- Отметить каким способом была получена обратная связь</p>
        <div class="checkbox-group no-input">
          <div
            class="d-inline-block mr-1"
            v-for="feedbackWayItem of feedbackWayList"
            :key="feedbackWayItem[0]"
          >
            <input
              class="checkbox ml-0 d-none"
              type="checkbox"
              v-model="ways"
              :value="feedbackWayItem[0]"
              :id="'checkbox-feedbackWay' + feedbackWayItem[0]"
            />
            <label
              class="
                action
                feedback-way
                p-1
                justify-content-center
                text-center
                m-0
              "
              :class="{
                active: ways.includes(feedbackWayItem[0]),
              }"
              :for="'checkbox-feedbackWay' + feedbackWayItem[0]"
              @click="inputWay"
            >
              <span class="align-self-center">
                {{ feedbackWayItem[1] }}
              </span>
            </label>
          </div>
          <div class="d-inline-block" v-if="actionsVisible">
            <button class="btn-action text-success" @click="confirm">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn-action text-danger" @click="cancel">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FeedbackList } from "@/const/Const.js";
import { MixinSteps } from "../mixins";
export default {
  name: "Feedback",
  mixins: [MixinSteps],
  data() {
    return {
      feedbackWayList: FeedbackList.get("param"),
      ways: [],
      actionsVisible: false,
    };
  },
  mounted() {
    this.data.timelineStepFeedbackways.map((item) => {
      this.ways.push(item.way);
    });
  },
  methods: {
    cancel() {
      this.ways = [];
      this.data.timelineStepFeedbackways.map((item) => {
        this.ways.push(item.way);
      });
      this.actionsVisible = false;
    },
    confirm() {
      this.data.timelineStepFeedbackways = [];
      this.ways.map((item) => {
        this.data.timelineStepFeedbackways.push({
          timeline_step_id: this.data.id,
          way: item,
        });
      });
      this.data.newActionComments = [
        {
          timeline_step_id: this.data.id,
          title: "система",
          comment: "Отметил способ обратной связи",
        },
      ];
      this.data.status = 1;
      this.$emit("updateItem", this.data, true);
      this.actionsVisible = false;
    },
    inputWay() {
      this.actionsVisible = true;
    },
  },
};
</script>

<style>
</style>