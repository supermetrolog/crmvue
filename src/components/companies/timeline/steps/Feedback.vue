<template>
  <div class="col company-form" v-if="data">
    <div class="row no-gutters mb-0" v-if="data.timelineStepObjects.length">
      <div class="col-12">
        <p>- Отметить каким способом была получена обратная связь</p>
      </div>
      <div class="col-7 pp">
        <div class="row">
          <div class="col-9 pr-0">
            <Checkbox
              v-model="ways"
              :options="feedbackWayList"
              mode="text"
              @change="onChange"
            />
          </div>
          <div class="col-3 p-0 text-left">
            <template v-if="actionsVisible">
              <button
                id="btn-feedback"
                class="btn-action text-success p-0 d-inline"
                @click="confirm"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                id="btn-feedback"
                class="btn-action text-danger p-0"
                @click="cancel"
              >
                <i class="fas fa-times"></i>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FeedbackList, ObjectTypeList } from "@/const/Const.js";
import { MixinSteps } from "../mixins";
import Checkbox from "@/components/form/Checkbox.vue";
export default {
  name: "Feedback",
  mixins: [MixinSteps],
  components: {
    Checkbox,
  },
  data() {
    return {
      feedbackWayList: FeedbackList.get("param"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
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
      setTimeout(() => {
        this.actionsVisible = false;
      }, 0);
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
    onChange() {
      this.actionsVisible = true;
    },
  },
};
</script>

<style lang="scss">
#btn-feedback {
  padding: 3px 5px !important;
}
</style>