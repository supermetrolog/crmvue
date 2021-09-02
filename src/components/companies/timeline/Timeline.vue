<template>
  <div class="container-timeline">
    <div class="row no-gutters" v-if="!timelineNotFoundFlag">
      <div class="col-4 left box">
        <div class="row no-gutters mb-3 p-0">
          <div class="col-3 pr-1">
            <button
              class="btn btn-primary btn-large"
              @click.prevent="clickOpenCompanyForm"
            >
              передать
            </button>
          </div>
          <div class="col-3 pr-1">
            <button
              class="btn btn-danger btn-large"
              @click.prevent="clickOpenCompanyForm"
            >
              отказаться
            </button>
          </div>
        </div>
        <div class="row no-gutters inner">
          <Loader class="center" v-if="loader" />

          <div class="timeline" v-if="!loader">
            <TimelineItem
              v-for="(step, idx) in this.TIMELINE.timelineSteps"
              :key="step.id"
              :data="step"
              :idx="idx"
              :loader="loaderForStep"
              @updateItem="clickUpdateStep"
              @clickItem="clickStep"
            >
              <template v-slot:actions="{ stepName, disabled, isConfirmed }">
                <component
                  :is="stepName"
                  :step="step"
                  :disabled="disabled"
                  :isConfirmed="isConfirmed"
                  ref="actionsComponent"
                >
                </component>
              </template>
            </TimelineItem>
          </div>
        </div>
      </div>
      <div class="col-3 box">FUCK</div>
      <div class="col-5 box">
        <div class="row no-gutters mb-3 p-0">
          <div class="col-3 pr-1">
            <button
              class="btn btn-primary btn-large"
              @click.prevent="clickOpenCompanyForm"
            >
              отправить
            </button>
          </div>
          <div class="col-3 pr-1">
            <button
              class="btn btn-danger btn-large"
              @click.prevent="clickOpenCompanyForm"
            >
              отменить
            </button>
          </div>
        </div>
        <div class="row no-gutters inner">
          <div class="col-12" v-if="selectedStep">
            <Loader class="center" v-if="loaderForObjects" />

            <Objects :currentStepObjects="CURRENT_STEP_OBJECTS" :allObjects="ALL_OBJECTS" v-else />
          </div>
        </div>
      </div>
    </div>
    <div class="row no-gutters" v-else>
      <h4 class="text-danger">Такого таймлайна не существует</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TimelineItem from "./TimelineItem";
import Meeting from "./step-actions/Meeting.vue";
import Offers from "./step-actions/Offers.vue";
import Feedback from "./step-actions/Feedback.vue";
import Inspection from "./step-actions/Inspection.vue";
import Visit from "./step-actions/Visit.vue";
import Interest from "./step-actions/Interest.vue";
import Deal from "./step-actions/Deal.vue";
import Loader from "@/components/Loader.vue";
import Objects from "../objects/Objects.vue";
export default {
  name: "Timeline",
  components: {
    TimelineItem,
    Meeting,
    Offers,
    Feedback,
    Inspection,
    Visit,
    Interest,
    Deal,
    Loader,
    Objects,
  },
  data() {
    return {
      loader: true,
      loaderForStep: false,
      loaderForObjects: false,
      objects: [],
      timelineNotFoundFlag: false,
    };
  },
  computed: {
    ...mapGetters(["TIMELINE", "CURRENT_STEP_OBJECTS", "ALL_OBJECTS"]),
    selectedStep() {
      if (this.TIMELINE.timelineSteps) {
        return this.TIMELINE.timelineSteps[this.$route.query.step];
      }
      return false;
    },
  },
  methods: {
    ...mapActions([
      "FETCH_TIMELINE",
      "UPDATE_STEP",
      "FETCH_CURRENT_STEP_OBJECTS",
      "FETCH_ALL_OBJECTS",
    ]),
    async clickUpdateStep(comment) {
      let newData = this.$refs.actionsComponent.getData();
      newData.comment = comment;
      this.loaderForStep = newData.id;
      if (await this.UPDATE_STEP(newData)) {
        await this.getTimeline();
      }
      this.loaderForStep = false;
    },
    async getCurrentStepObjects() {
      if (!this.selectedStep) {
        return;
      }

      this.loaderForObjects = true;

      await this.FETCH_CURRENT_STEP_OBJECTS(
        this.selectedStep.timelineStepObjects
      );
      await this.FETCH_ALL_OBJECTS();
      this.loaderForObjects = false;
    },
    async clickStep(step) {
      let query = {
        timeline: this.$route.query.timeline,
      };
      if (step.number != this.$route.query.step) {
        query.step = step.number;
      }
      await this.$router.push({ query: query });
      this.$nextTick(() => this.getCurrentStepObjects());
    },
    async getTimeline() {
      await this.FETCH_TIMELINE(this.$route.query.timeline);
      if (this.TIMELINE === false) {
        this.timelineNotFoundFlag = true;
      }
    },
  },
  async created() {
    this.loader = true;
    await this.getTimeline();
    this.loader = false;
    this.getCurrentStepObjects();
  },
};
</script>

<style>
</style>
//Этапы бизнес процесса от звонка до сделки