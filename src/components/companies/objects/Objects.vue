<template>
  <div class="objects">
    <OfferObjects
      v-if="selectedStep.number == 1"
      :currentStepObjects="CURRENT_STEP_OBJECTS"
      :allObjects="ALL_OBJECTS"
      :selectedObjects="selectedObjects"
      :step="selectedStep"
      :loader="loader"
      :pagination="OBJECTS_PAGINATION"
      :stepActionsPartVisible="stepActionsPartVisible"
      @selectObject="selectObject"
      @unSelectObject="unSelectObject"
      @clickResetSelectObjects="clickResetSelectObjects"
      @loadMore="loadMore"
      @sendObjects="sendObjects"
      @toggleStepActionsPartVisible="$emit('toggleStepActionsPartVisible')"
    >
      <div class="timeline-actions row">
        <component
          :is="stepName"
          :step="selectedStep"
          @updateItem="clickUpdateStep"
        >
        </component>
      </div>
    </OfferObjects>
    <Deal
      v-else-if="selectedStep.number == 7"
      :request_id="TIMELINE_REQUEST_ID"
      :currentStepObjects="CURRENT_STEP_OBJECTS"
      :allObjects="ALL_OBJECTS"
      :selectedObjects="selectedObjects"
      :loader="loader"
      :selectedStepNumber="selectedStep.number"
      @selectObjectOne="selectObjectOne"
      @unSelectObject="unSelectObject"
      @clickResetSelectObjects="clickResetSelectObjects"
      @submitDeal="submitDeal"
    >
      <div class="timeline-actions row">
        <component
          :is="stepName"
          :step="selectedStep"
          @updateItem="clickUpdateStep"
        >
        </component>
      </div>
    </Deal>
    <DefaultObjects
      v-else-if="selectedStep.number != 0"
      :currentStepObjects="CURRENT_STEP_OBJECTS"
      :allObjects="ALL_OBJECTS"
      :selectedObjects="selectedObjects"
      :loader="loader"
      :selectedStepNumber="selectedStep.number"
      :stepActionsPartVisible="stepActionsPartVisible"
      @selectObject="selectObject"
      @unSelectObject="unSelectObject"
      @clickResetSelectObjects="clickResetSelectObjects"
      @sendObjects="sendObjects"
    >
      <div class="timeline-actions row">
        <component
          :is="stepName"
          :step="selectedStep"
          @updateItem="clickUpdateStep"
        >
        </component>
      </div>
    </DefaultObjects>
  </div>
</template>

<script>
import OfferObjects from "@/components/companies/timeline/step-objects/OfferObjects.vue";
import DefaultObjects from "@/components/companies/timeline/step-objects/DefaultObjects.vue";
import DealObjects from "@/components/companies/timeline/step-objects/Deal.vue";
import Meeting from "../timeline/steps/Meeting.vue";
import Offers from "../timeline/steps/Offers.vue";
import Feedback from "../timeline/steps/Feedback.vue";
import Inspection from "../timeline/steps/Inspection.vue";
import Visit from "../timeline/steps/Visit.vue";
import Interest from "../timeline/steps/Interest.vue";
import Talk from "../timeline/steps/Talk.vue";
import Deal from "../timeline/steps/Deal.vue";
import { Timeline } from "@/const/Const";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Objects",
  components: {
    OfferObjects,
    DefaultObjects,
    DealObjects,
    Meeting,
    Offers,
    Feedback,
    Inspection,
    Visit,
    Interest,
    Talk,
    Deal,
  },
  data() {
    return {
      stepParam: Timeline.get("param"),
      loader: false,
      selectedObjects: [],
    };
  },
  props: {
    selectedStep: {
      type: [Object, Boolean],
    },
    stepActionsPartVisible: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters([
      "OBJECTS_PAGINATION",
      "CURRENT_STEP_OBJECTS",
      "ALL_OBJECTS",
      "TIMELINE_REQUEST_ID",
    ]),
    stepName() {
      return this.stepParam[this.$route.query.step][1].stepName;
    },
  },
  methods: {
    ...mapActions([
      "FETCH_ALL_OBJECTS",
      "INCRIMENT_OBJECTS_CURRENT_PAGE",
      "RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST",
      "FETCH_CURRENT_STEP_OBJECTS",
      "SEND_OBJECTS",
      "UPDATE_STEP",
      "FETCH_COMPANY_REQUESTS",
    ]),
    clickUpdateStep(data) {
      this.$emit("updateStep", data);
    },
    selectObject(object) {
      this.selectedObjects.push(object);
    },
    selectObjectOne(object) {
      this.selectedObjects = [];
      this.selectedObjects.push(object);
    },
    unSelectObject(object) {
      this.selectedObjects = this.selectedObjects.filter(
        (item) => item.id != object.id
      );
    },
    async submitDeal(requestDealData) {
      this.loader = true;
      let data = {
        ...this.selectedStep,
      };
      data.requestDealData = requestDealData;
      data.negative = 0;
      data.done = 1;
      data.timelineStepObjects = [];
      this.selectedObjects.map((item) => {
        data.timelineStepObjects.push({
          timeline_step_id: data.id,
          object_id: item.original_id,
          offer_id: item.id,
          complex_id: item.complex_id,
          type_id: item.type_id,
        });
      });
      data.requestDealData.complex_id = data.timelineStepObjects[0].complex_id;
      data.requestDealData.object_id = data.timelineStepObjects[0].object_id;

      if (await this.UPDATE_STEP(data)) {
        data.timelineStepObjects = data.timelineStepObjects.concat(
          this.selectedStep.timelineStepObjects
        );
        this.$emit("updated", data);
        this.clickResetSelectObjects();
        await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
      }
      this.loader = false;
    },
    loadMore() {
      console.warn("KASDA");
      this.INCRIMENT_OBJECTS_CURRENT_PAGE();
      this.FETCH_ALL_OBJECTS(this.selectedStep.number);
    },
    clickResetSelectObjects() {
      this.selectedObjects = [];
    },
    async sendObjects() {
      this.loader = true;
      let data = {
        ...this.selectedStep,
      };
      data.negative = 0;
      data.additional = 0;
      data.timelineStepObjects = [];
      this.selectedObjects.map((item) => {
        data.timelineStepObjects.push({
          timeline_step_id: data.id,
          object_id: item.original_id,
          offer_id: item.id,
          complex_id: item.complex_id,
          type_id: item.type_id,
        });
      });
      if (await this.UPDATE_STEP(data)) {
        data.timelineStepObjects = data.timelineStepObjects.concat(
          this.selectedStep.timelineStepObjects
        );
        this.$emit("updated", data);
        this.clickResetSelectObjects();
      }
    },
    async getCurrentStepObjects(getAllObjectsFlag = true) {
      if (!this.selectedStep) {
        return;
      }
      this.loader = true;
      await this.FETCH_CURRENT_STEP_OBJECTS(
        this.selectedStep.timelineStepObjects
      );
      if (getAllObjectsFlag) {
        await this.FETCH_ALL_OBJECTS(this.selectedStep.number);
      }
      this.loader = false;
    },
    clickFavoritesVisibleToggle() {
      this.$emit("clickFavoritesVisibleToggle");
    },
  },
  watch: {
    selectedStep(before, after) {
      if (before.id != after.id) {
        this.getCurrentStepObjects();
        this.clickResetSelectObjects();
        this.RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST();
      } else {
        if (this.loader && this.selectedStep.number == 7) {
          this.getCurrentStepObjects(false);
        }
      }
    },
  },
  async created() {
    if (this.selectedStep.number != 0) {
      this.getCurrentStepObjects();
    }
  },
};
</script>

<style>
</style>