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
        <div class="row no-gutters inner" ref="timeline">
          <Loader class="center" v-if="loader" />

          <div class="timeline col-12" v-if="!loader">
            <TimelineItem
              v-for="(step, idx) in this.TIMELINE.timelineSteps"
              :key="step.id"
              :data="step"
              :idx="idx"
              :loader="loaderForStep"
              @clickItem="clickStep"
              ref="steps"
            >
              <template v-slot:actions="{ stepName, disabled }">
                <component
                  :is="stepName"
                  :step="step"
                  :disabled="disabled"
                  @updateItem="clickUpdateStep"
                >
                </component>
              </template>
            </TimelineItem>
          </div>
        </div>
      </div>
      <div class="col-8" v-if="!selectedStep && $route.query.step">
        <Loader class="center" />
      </div>
      <div class="col-3 box" v-if="!favoritesVisible && selectedStep">
        <StepActions :selectedStep="selectedStep" />
      </div>
      <div class="col-5 box" v-if="selectedStep">
        <Objects
          :selectedStep="selectedStep"
          :favoritesVisible="favoritesVisible"
          @clickFavoritesVisibleToggle="clickFavoritesVisibleToggle"
          @updated="updatedObjects"
        />
      </div>
      <div class="col-3 box" v-if="favoritesVisible">
        <!-- <Objects
          v-if="selectedStep"
          :mode="'favorites'"
          :selectedStep="selectedStep"
          :favoritesVisible="favoritesVisible"
          @clickFavoritesVisibleToggle="clickFavoritesVisibleToggle"
        /> -->
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
import Meeting from "./steps/Meeting.vue";
import Offers from "./steps/Offers.vue";
import Feedback from "./steps/Feedback.vue";
import Inspection from "./steps/Inspection.vue";
import Visit from "./steps/Visit.vue";
import Interest from "./steps/Interest.vue";
import Talk from "./steps/Talk.vue";
import Deal from "./steps/Deal.vue";
import Loader from "@/components/Loader.vue";
import Objects from "../objects/Objects.vue";
import StepActions from "./step-actions/StepActions.vue";
import { Timeline } from "@/const/Const";
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
    Talk,
    Deal,
    Loader,
    Objects,
    StepActions,
  },
  data() {
    return {
      stepParam: Timeline.get("param"),
      loader: true,
      loaderForStep: false,
      objects: [],
      timelineNotFoundFlag: false,
      favoritesVisible: false,
    };
  },
  computed: {
    ...mapGetters(["TIMELINE"]),
    selectedStep() {
      if (this.TIMELINE.timelineSteps) {
        return this.TIMELINE.timelineSteps[this.$route.query.step];
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["FETCH_TIMELINE", "UPDATE_STEP"]),
    clickFavoritesVisibleToggle() {
      this.favoritesVisible = !this.favoritesVisible;
    },
    async updatedObjects(data) {
      this.loaderForStep = data.id;
      await this.getTimeline();
      if (data.number != 7) {
        this.nextStep();
      }
      this.loaderForStep = false;
    },
    async nextStep() {
      let query = {
        timeline: this.$route.query.timeline,
        step: +this.$route.query.step + 1,
      };
      await this.$router.push({ query: query });
      this.scrollToSelectedStep();
    },
    scrollToSelectedStep() {
      if (!this.$route.query.step) {
        return;
      }
      const className = this.stepParam[this.$route.query.step][1].stepName;
      const step = document.querySelector(`.${className}`);
      let options = {
        behavior: "smooth",
        block: "center",
      };
      step.scrollIntoView(options);
    },
    async clickUpdateStep(data) {
      this.loaderForStep = data.id;
      if (await this.UPDATE_STEP(data)) {
        await this.getTimeline();
        console.log("ADS", data);
        if (data.number == 0 && data.done == 1) {
          this.nextStep();
        }
      }
      this.loaderForStep = false;
    },

    async clickStep(step) {
      this.favoritesVisible = false;
      // console.error(this.$refs.steps.$el);
      let query = {
        timeline: this.$route.query.timeline,
      };
      if (step.number != this.$route.query.step) {
        query.step = step.number;
      }
      await this.$router.push({ query: query });
      this.scrollToSelectedStep();
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
    this.$nextTick(() => {
      this.scrollToSelectedStep();
    });
  },
  mounted() {
    // setTimeout(() => {
    //   const step = document.querySelector(".Deal");
    //   // step.scrollIntoView();
    //   console.error(step);
    // }, 3000);
  },
};
</script>

<style>
</style>
//Этапы бизнес процесса от звонка до сделки