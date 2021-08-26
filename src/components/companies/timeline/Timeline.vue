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
              v-for="(item, idx) in this.TIMELINE.timelineSteps"
              :key="item.id"
              :data="item"
              :idx="idx"
              @updateItem="clickUpdateItem"
              @createNewBranch="clickCreateNewBranch"
              @createNewItem="clickCreateNewItem"
              @clickItem="clickItem"
            >
              <template v-slot:actions="{ stepName, disabled, isConfirmed }">
                <component
                  :is="stepName"
                  :actions="item"
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
            <Objects :objects="selectedStep.timelineStepObjects" />
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
      objects: [],
      timelineNotFoundFlag: false,
    };
  },
  varticalOffsetTimeline: 390,
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
    ...mapActions([
      "FETCH_TIMELINE",
      "UPDATE_ITEM",
      "CREATE_NEW_BRANCH",
      "CREATE_NEW_ITEM",
    ]),
    getMarginTopValue(step, index) {
      if (index == 0) return;
      return {
        marginTop: step * this.$options.varticalOffsetTimeline + "px",
      };
    },
    existNextBranch(index) {
      return this.TIMELINE[index + 1] ? true : false;
    },
    clickUpdateItem(item) {
      item.actions = this.$refs.actionsComponent.getData();
      this.UPDATE_ITEM(item);
    },
    clickCreateNewBranch(item) {
      this.CREATE_NEW_BRANCH(item);
    },
    clickCreateNewItem(param) {
      this.CREATE_NEW_ITEM(param);
    },
    clickItem(item) {
      let query = {
        timeline: this.$route.query.timeline,
      };
      if (item.number != this.$route.query.step) {
        query.step = item.number;
      }
      this.$router.push({ query: query });
    },
  },
  async created() {
    this.loader = true;
    await this.FETCH_TIMELINE(this.$route.query.timeline);
    if (this.TIMELINE === false) {
      this.timelineNotFoundFlag = true;
    }
    this.loader = false;
  },
};
</script>

<style>
</style>
//Этапы бизнес процесса от звонка до сделки