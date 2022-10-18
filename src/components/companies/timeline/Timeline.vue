<template>
  <Modal class="fullscreen" :title="timelineTitle" @close="$emit('close')">
    <template #header>
      <div class="col-1 align-self-center" v-if="currentRequest.status == 2">
        <h3 class="text-success m-0">ЗАВЕРШЕН</h3>
      </div>
      <div
        class="col-1 align-self-center"
        v-else-if="TIMELINE && TIMELINE.status == 0"
      >
        <h3 class="text-warning m-0">НЕАКТИВЕН</h3>
      </div>
      <div class="col timeline-list pr-5" v-if="TIMELINE_LIST.length">
        <div
          class="timeline-actions timeline-list-item p-1"
          v-for="timeline in TIMELINE_LIST"
          :key="timeline.id"
        >
          <CustomButton
            :options="{
              btnActive: $route.query.consultant_id == timeline.consultant.id,
              btnClass: 'primary',
              defaultBtn: true,
              disabled: false,
            }"
            @confirm="changeTimeline(timeline.consultant.id)"
          >
            <template #btnContent>
              {{ timeline.consultant.userProfile.short_name }}
            </template>
          </CustomButton>
        </div>
      </div>
      <div
        class="col-1 ml-auto pr-1 align-self-center"
        v-if="!timelineNotFoundFlag"
      >
        <button
          class="btn btn-alt btn-primary btn-large"
          @click.prevent="clickOpenCompanyForm"
          disabled
        >
          передать
        </button>
      </div>
      <div class="col-1 ml-auto align-self-center" v-if="!timelineNotFoundFlag">
        <button
          class="btn btn-alt btn-danger btn-large"
          @click.prevent="clickOpenCompanyForm"
          disabled
        >
          отказаться
        </button>
      </div>
    </template>
    <div class="container-timeline">
      <Loader
        class="center"
        v-if="
          (!selectedStep && $route.query.step && !timelineNotFoundFlag) ||
          loader
        "
      />
      <div class="row no-gutters">
        <div class="col-12">
          <div class="row no-gutters inner" ref="timeline">
            <div class="col-12" v-if="timelineNotFoundFlag">
              <h4 class="text-danger text-center">
                Такого таймлайна не существует
              </h4>
            </div>
            <div
              class="timeline col-12"
              v-if="!loader && !timelineNotFoundFlag"
            >
              <MiniTimeline
                :currentSteps="this.TIMELINE.timelineSteps"
                :selectedStep="selectedStep"
                @clickItem="clickStep"
              />
            </div>
          </div>
        </div>

        <div
          class="col-8 box step-actions"
          v-if="selectedStep && !loader && !timelineNotFoundFlag"
        >
          <component
            :is="stepActionsName"
            :step="selectedStep"
            :loaderForStep="loaderForStep"
            :disabled="disabled"
            @updatedObjects="updatedObjects"
            @updateStep="clickUpdateStep"
          >
          </component>
        </div>
        <div
          class="col-4 box timeline-extra-block"
          v-if="selectedStep && !loader && !timelineNotFoundFlag"
        >
          <ExtraBlock
            :step="selectedStep"
            :disabled="disabled"
            @createComment="clickUpdateStep"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import MiniTimeline from "./MiniTimeline.vue";
import { mapActions, mapGetters } from "vuex";
import TimelineItem from "./TimelineItem";
import Multiselect from "@vueform/multiselect";

import MeetingActions from "./step-actions/MeetingActions.vue";
import OffersActions from "./step-actions/OffersActions.vue";
import FeedbackActions from "./step-actions/FeedbackActions.vue";
import InspectionActions from "./step-actions/InspectionActions.vue";
import VisitActions from "./step-actions/VisitActions.vue";
import InterestActions from "./step-actions/InterestActions.vue";
import TalkActions from "./step-actions/TalkActions.vue";
import DealActions from "./step-actions/DealActions.vue";

import ExtraBlock from "./timeline-extra-block/ExtraBlock.vue";
import { Timeline } from "@/const/Const";
import Utils from "@/utils";
import CustomButton from "@/components/common/CustomButton.vue";

export default {
  name: "Timeline",
  components: {
    TimelineItem,
    MeetingActions,
    OffersActions,
    FeedbackActions,
    InspectionActions,
    VisitActions,
    InterestActions,
    TalkActions,
    DealActions,
    ExtraBlock,
    Multiselect,
    CustomButton,
    MiniTimeline,
  },
  data() {
    return {
      stepParam: Timeline.get("param"),
      loader: true,
      loaderForStep: false,
      objects: [],
      timelineNotFoundFlag: false,
    };
  },
  computed: {
    ...mapGetters([
      "TIMELINE",
      "COMPANY",
      "COMPANY_CONTACTS",
      "THIS_USER",
      "TIMELINE_LIST",
      "COMPANY_REQUESTS",
    ]),
    selectedStep() {
      if (this.TIMELINE) {
        console.warn("STEPS", this.TIMELINE.timelineSteps);
        return this.TIMELINE.timelineSteps[this.$route.query.step];
      }
      return false;
    },
    stepActionsName() {
      return this.stepParam[this.$route.query.step][1].stepName + "Actions";
    },
    currentRequest() {
      if (Array.isArray(this.COMPANY_REQUESTS)) {
        return this.COMPANY_REQUESTS.find(
          (item) => item.id == this.$route.query.request_id
        );
      }
      return false;
    },
    disabled() {
      return (
        this.$route.query.consultant_id != this.THIS_USER.id ||
        this.currentRequest.status == 2 ||
        this.TIMELINE.status == 0
      );
    },
    companyContacts() {
      return Utils.normalizeContactsForMultiselect(this.COMPANY_CONTACTS);
    },
    timelineTitle() {
      let title = "Бизнес процесс: " + this.COMPANY.full_name;
      const currentTimeline = this.TIMELINE_LIST.find(
        (timeline) => timeline.consultant.id == this.$route.query.consultant_id
      );
      if (currentTimeline) {
        title += " - " + currentTimeline.consultant.userProfile.short_name;
      }
      return title;
    },
  },
  methods: {
    ...mapActions(["FETCH_TIMELINE", "UPDATE_STEP"]),
    async updatedObjects(data, goToNext = false, fn = null) {
      this.loaderForStep = data.id;
      await this.getTimeline();
      if (goToNext && data.number != 7) {
        await this.nextStep();
      }
      if (fn) {
        fn();
      }
      this.loaderForStep = false;
    },
    async clickUpdateStep(data, goToNext = false, fn = null) {
      console.log(data);
      this.loaderForStep = data.id;
      if (await this.UPDATE_STEP(data)) {
        await this.getTimeline();
        if (goToNext) {
          this.nextStep();
        }
      }
      if (fn) {
        fn();
      }
      this.loaderForStep = false;
    },
    async nextStep() {
      let query = {
        ...this.$route.query,
      };
      query.step++;
      await this.$router.push({ query: query });
      this.scrollToSelectedStep();
    },
    scrollToSelectedStep(delay = 0) {
      if (!this.$route.query.step) {
        return;
      }
      let options = {
        behavior: "smooth",
        block: "center",
      };
      setTimeout(
        () =>
          this.$refs["step_" + this.$route.query.step][0].$el.scrollIntoView(
            options
          ),
        delay
      );
    },

    async clickStep(step) {
      let query = {
        ...this.$route.query,
      };
      if (step.number != this.$route.query.step) {
        query.step = step.number;
      }
      await this.$router.push({ query: query });
      this.scrollToSelectedStep();
    },
    async getTimeline() {
      await this.FETCH_TIMELINE(this.$route.query);
      if (!this.TIMELINE) {
        this.timelineNotFoundFlag = true;
        return false;
      }
      this.timelineNotFoundFlag = false;
      return true;
    },
    async changeTimeline(consultant_id) {
      let query = {
        ...this.$route.query,
      };
      query.consultant_id = consultant_id;
      query.step = 0;
      await this.$router.push({ query: query });
      // this.getTimeline();
    },
    // getCompanyContacts() {
    //   if (this.companyContacts) {
    //     return;
    //   }
    //   this.companyContacts = Utils.normalizeContactsForMultiselect(
    //     this.COMPANY_CONTACTS
    //   );
    // },
    getPriorityStep() {
      let highPriorityTimelineStep = 0;
      this.TIMELINE.timelineSteps.forEach((step) => {
        if (step.status == 0 && !highPriorityTimelineStep) {
          highPriorityTimelineStep = step.number;
        }
      });
      return highPriorityTimelineStep;
    },
    async moveToPriorityStep() {
      let highPriorityTimelineStep = this.getPriorityStep();
      let query = {
        ...this.$route.query,
      };
      query.step = highPriorityTimelineStep;
      await this.$router.push({ query: query });
    },
  },
  async created() {
    this.loader = true;
    // this.getCompanyContacts();
    const result = await this.getTimeline();
    this.loader = false;
    if (result) {
      this.moveToPriorityStep();

      this.$nextTick(() => {
        this.scrollToSelectedStep();
      });
    }
  },
  watch: {
    async $route(after, before) {
      if (before.query.consultant_id != after.query.consultant_id) {
        this.loader = true;
        await this.getTimeline();
        this.loader = false;
      }
    },
  },
};
</script>

<style>
</style>
//Этапы бизнес процесса от звонка до сделки