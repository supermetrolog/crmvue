<template>
  <div class="col company-form">
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
              v-model="feedbackWay"
              :value="feedbackWayItem[0]"
              :id="'checkbox-feedbackWay' + branch + feedbackWayItem[0]"
              :disabled="disabled"
            />
            <label
              class="action feedback-way p-1 justify-content-center"
              :class="{
                active: feedbackWay.includes(feedbackWayItem[0]),
                disabled: disabled,
              }"
              :for="'checkbox-feedbackWay' + branch + feedbackWayItem[0]"
            >
              <span class="align-self-center">
                {{ feedbackWayItem[1] }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col">
        <div class="title">
          <p>- Отметить объекты, которые заинтересовали клиента</p>
        </div>
        <div :class="{ 'scroll-list': objects.length > 3 }">
          <button
            class="ml-1 action"
            :class="{ active: negative }"
            :disabled="disabled || negative"
            @click="clickNegative"
          >
            <i class="far fa-frown-open"></i>
            <span class="ml-1">Ничего не подходит</span>
          </button>
          <button
            class="ml-1 action"
            :disabled="disabled"
            title="Отметить объекты"
            @click="clickSelectObjects"
          >
            <i class="fas fa-plus"></i>
          </button>
          <button
            class="ml-1 action active"
            v-for="object of objects"
            :key="object.id"
            @click="clickOpenObjectInfo"
          >
            <span>{{ object.id }}</span>
          </button>
        </div>
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
      feedbackWay: [],
      negative: 0,
      objects: [],
    };
  },
  props: {
    actions: {
      type: Object,
      default: () => {
        return {
          feedbackWay: [],
          negative: 0,
          objects: [],
        };
      },
    },
    branch: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    },
    isConfirmed: {
      type: Boolean,
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.feedbackWay = this.actions.feedbackWay;
      this.negative = this.actions.negative;
      this.objects = this.actions.objects;
    },
    getData() {
      return {
        feedbackWay: this.feedbackWay,
        negative: this.negative,
        objects: this.objects,
      };
    },
    clickNegative() {
      this.negative = 1;
      this.objects = [];
    },
  },
  watch: {
    disabled() {
      if (!this.isConfirmed) {
        this.setData();
      }
    },
  },
};
</script>

<style>
</style>