<template>
  <div class="col company-form" v-if="data">
    <div class="row no-gutters mb-0">
      <div class="col">
        <p>- Отметить каким способом была получена обратная связь</p>
        <div class="checkbox-group no-input">
          <div
            class="d-inline-block mr-1 mb-2"
            v-for="feedbackWayItem of feedbackWayList"
            :key="feedbackWayItem[0]"
          >
            <input
              class="checkbox ml-0 d-none"
              type="checkbox"
              v-model="ways"
              :value="feedbackWayItem[0]"
              :id="'checkbox-feedbackWay' + feedbackWayItem[0]"
              :disabled="disabled"
            />
            <label
              class="action feedback-way p-1 justify-content-center"
              :class="{
                active: ways.includes(feedbackWayItem[0]),
                disabled: disabled,
              }"
              :for="'checkbox-feedbackWay' + feedbackWayItem[0]"
              @click="inputWay"
            >
              <span class="align-self-center">
                {{ feedbackWayItem[1] }}
              </span>
            </label>
          </div>
          <div class="actions d-inline-block" v-if="actionsVisible">
            <button class="btn-action text-info" @click="confirm">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn-action text-danger" @click="cancel">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col">
        <p>- Отметить объекты, которые заинтересовали клиента</p>
        <button
          class="action"
          :class="{ active: data.timelineStepObjects.length && !data.negative }"
          disabled
          @click="clickSelectObjects"
        >
          <i class="far fa-smile"></i>
          <span class="ml-1"
            >Выбрано {{ data.timelineStepObjects.length }}
          </span>
        </button>
        <button
          class="ml-1 mb-2 action"
          :class="{ active: data.negative }"
          :disabled="disabled || data.negative"
          @click="clickNegative"
        >
          <i class="far fa-frown-open"></i>
          <span class="ml-1">Нет подходящих</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FeedbackList } from "@/const/Const.js";
export default {
  name: "Feedback",
  data() {
    return {
      feedbackWayList: FeedbackList.get("param"),
      ways: [],
      data: null,
      actionsVisible: false,
    };
  },
  props: {
    step: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
  },
  mounted() {
    this.data = this.step;
    this.data.timelineStepFeedbackways.map((item) => {
      this.ways.push(item.way);
    });
    console.log(this.data);
  },
  methods: {
    clickNegative() {
      this.data.negative = 1;
      this.$emit("updateItem", this.data);
    },
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
      this.$emit("updateItem", this.data);
      this.actionsVisible = false;
    },
    inputWay() {
      if (!this.disabled) {
        this.actionsVisible = true;
      }
    },
  },
  watch: {
    step() {
      this.data = this.step;
    },
  },
  emits: ["updateItem"],
};
</script>

<style>
</style>