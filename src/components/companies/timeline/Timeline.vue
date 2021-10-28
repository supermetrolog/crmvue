<template>
  <div class="container-timeline">
    <div class="row no-gutters" v-if="!timelineNotFoundFlag">
      <div class="col-3 stage box">
        <div class="row no-gutters mb-2 p-0">
          <div class="col-6 pr-1">
            <button
              class="btn btn-primary btn-large"
              @click.prevent="clickOpenCompanyForm"
            >
              передать
            </button>
          </div>
          <div class="col-6 pr-1">
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
              :selectedStep="selectedStep"
              :idx="idx"
              :loader="loaderForStep"
              @clickItem="clickStep"
            />
          </div>
        </div>
      </div>
      <div class="col-8" v-if="!selectedStep && $route.query.step">
        <Loader class="center" />
      </div>
      <div class="col-7 box step-actions" v-if="selectedStep">
        <div class="row" v-if="selectedStep.number != 0">
          <div class="col-3 mb-2">
            <div class="company-form company-request-form">
              <Multiselect
                v-model="contactForSendMessage"
                :options="companyContacts"
                clearOnSelect="true"
                class="multiselect-timeline"
                :multipleLabel="
                  (n) => {
                    return `${n.length} ${
                      n.length == 1 ? 'контакт выбран' : 'контакта выбрано'
                    }`;
                  }
                "
                placeholder="Выберите контакт"
                mode="multiple"
              />
            </div>
          </div>
        </div>
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeIn for__page"
          leave-active-class="animate__animated animate__fadeOut for__page"
        >
          <component
            :is="stepActionsName"
            :step="selectedStep"
            :contactForSendMessage="contactForSendMessage"
            @updatedObjects="updatedObjects"
            @updateStep="clickUpdateStep"
          >
          </component>
        </transition>
      </div>
      <div class="col-2 box timeline-extra-block" v-if="selectedStep">
        <ExtraBlock :step="selectedStep" />
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
import Loader from "@/components/Loader.vue";
import { Timeline } from "@/const/Const";
import Utils from "@/utils";
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
    Loader,
    ExtraBlock,
    Multiselect,
  },
  data() {
    return {
      stepParam: Timeline.get("param"),
      loader: true,
      loaderForStep: false,
      objects: [],
      timelineNotFoundFlag: false,
      companyContacts: null,
      contactForSendMessage: [],
    };
  },
  computed: {
    ...mapGetters(["TIMELINE", "COMPANY"]),
    selectedStep() {
      if (this.TIMELINE.timelineSteps) {
        return this.TIMELINE.timelineSteps[this.$route.query.step];
      }
      return false;
    },
    stepActionsName() {
      return this.stepParam[this.$route.query.step][1].stepName + "Actions";
    },
  },
  methods: {
    ...mapActions(["FETCH_TIMELINE", "UPDATE_STEP"]),
    async updatedObjects(data, goToNext = false) {
      this.loaderForStep = data.id;
      await this.getTimeline();
      if (goToNext && data.number != 7) {
        this.nextStep();
      }
      this.loaderForStep = false;
    },
    async clickUpdateStep(data, goToNext = false) {
      console.log(data);
      this.loaderForStep = data.id;
      if (await this.UPDATE_STEP(data)) {
        await this.getTimeline();
        if (goToNext) {
          this.nextStep();
        }
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
    getCompanyContacts() {
      if (this.companyContacts) {
        return;
      }
      this.companyContacts = Utils.normalizeContactsForMultiselect(
        this.COMPANY[0].contacts
      );
      console.warn(this.companyContacts);
    },
  },
  async created() {
    this.loader = true;
    await this.getTimeline();
    this.getCompanyContacts();
    this.loader = false;
    this.$nextTick(() => {
      this.scrollToSelectedStep();
    });
  },
};
</script>

<style>
</style>
//Этапы бизнес процесса от звонка до сделки