<template>
  <div class="col-12 company-form" v-if="data">
    <StepStage
      class="mb-2 px-2"
      :title="
        'Шаг 1. отметить объекты, которые заинтересовали клиента' +
        (data.timelineStepObjects.length
          ? ` (${data.timelineStepObjects.length})`
          : '')
      "
      :isDone="!!data.timelineStepObjects.length"
      :closeSlotWhenDone="false"
      :isCurrent="!data.timelineStepObjects.length"
    >
      <ObjectsControllPanel
        :buttons="buttons"
        @done="$emit('done')"
        @negative="$emit('negative')"
      />
    </StepStage>
    <StepStage
      class="mb-2 px-2"
      title="Шаг 2. Отметить каким способом была получена обратная связь"
      :isDone="!!data.timelineStepFeedbackways.length"
      :closeSlotWhenDone="false"
      :isCurrent="!data.timelineStepFeedbackways.length"
    >
      <div class="col-7 pp">
        <div class="row">
          <div class="col-9 pl-2">
            <Checkbox
              v-model="ways"
              :options="feedbackWayList"
              mode="text"
              :disabled="disabled"
              @change="onChange"
            />
          </div>
          <div class="col-3 p-0 text-left">
            <template v-if="actionsVisible">
              <button
                id="btn-feedback"
                :disabled="disabled"
                class="btn-action text-primary p-0 d-inline"
                @click="confirm"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                id="btn-feedback"
                :disabled="disabled"
                class="btn-action text-danger p-0"
                @click="cancel"
              >
                <i class="fas fa-times"></i>
              </button>
            </template>
          </div>
        </div>
      </div>
    </StepStage>
  </div>
</template>

<script>
import { FeedbackList, ObjectTypeList } from "@/const/Const.js";
import { MixinSteps } from "../mixins";
import Checkbox from "@/components/common/form/Checkbox.vue";
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
          timeline_id: this.data.timeline_id,
          timeline_step_id: this.data.id,
          timeline_step_number: this.data.number,
          title: "система",
          comment: "Отметил способ обратной связи",
          type: 1,
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