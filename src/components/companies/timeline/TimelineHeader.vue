<template>
  <div class="timeline-header">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <CompanyRequestDisableFormModal
          v-if="disableFormVisible"
          title="Завершение таймлана"
          :request_id="currentRequest.id"
          @disabled="disabledTimeline"
          @close="clickCloseDisableForm"
        />
      </transition>
    </teleport>
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <CompanyDealForm
          v-if="dealFormVisible"
          :company_id="currentRequest.company_id"
          :request_id="currentRequest.id"
          @close="clickCloseDealForm"
        />
      </transition>
    </teleport>
    <div>
      <TimelineStatus
        v-if="currentRequest && TIMELINE"
        :request="currentRequest"
        :timeline="TIMELINE"
      />
    </div>
    <div>
      <div class="timeline-list" v-if="TIMELINE_LIST.length">
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
    </div>
    <div>
      <div class="timeline-list" v-if="!disabled">
        <div class="timeline-actions timeline-list-item px-1">
          <CustomButton
            :options="{
              btnClass: 'danger',
              defaultBtn: true,
              disabled: disabled,
            }"
            @confirm="clickOpenDisableForm"
          >
            <template #btnContent> завершить </template>
          </CustomButton>
        </div>
        <div class="timeline-actions timeline-list-item px-1">
          <CustomButton
            :options="{
              btnClass: 'primary',
              defaultBtn: true,
              disabled: disabled,
            }"
            @confirm="clickOpenDealForm"
          >
            <template #btnContent> создать сделку </template>
          </CustomButton>
        </div>
        <div class="timeline-actions timeline-list-item px-1">
          <CustomButton
            :options="{
              btnClass: 'warning',
              defaultBtn: true,
              disabled: true,
            }"
            @confirm="clickOpenDisableForm"
          >
            <template #btnContent> передать </template>
          </CustomButton>
        </div>
        <div class="timeline-actions timeline-list-item px-1">
          <CustomButton
            :options="{
              btnClass: 'warning',
              defaultBtn: true,
              disabled: true,
            }"
            @confirm="clickOpenDisableForm"
          >
            <template #btnContent> отказаться </template>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CompanyRequestDisableFormModal from "@/components/companies/forms/company-request-form/CompanyRequestDisableFormModal";
import CompanyDealForm from "@/components/companies/forms/company-deal-form/CompanyDealForm";
import CustomButton from "@/components/common/CustomButton.vue";
import TimelineStatus from "./TimelineStatus";
export default {
  name: "TimelineHeader",
  components: {
    CompanyRequestDisableFormModal,
    CustomButton,
    TimelineStatus,
    CompanyDealForm,
  },
  data() {
    return {
      disableFormVisible: false,
      dealFormVisible: false,
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    currentRequest: {
      type: Object,
      required: true,
    },
    timelineExist: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["TIMELINE_LIST", "TIMELINE"]),
  },
  methods: {
    ...mapActions(["FETCH_COMPANY_REQUESTS"]),
    clickOpenDisableForm() {
      this.disableFormVisible = true;
    },
    clickCloseDisableForm() {
      this.disableFormVisible = false;
    },
    clickOpenDealForm() {
      this.dealFormVisible = true;
    },
    clickCloseDealForm() {
      this.dealFormVisible = false;
    },
    async disabledTimeline() {
      if (await this.FETCH_COMPANY_REQUESTS(this.$route.params.id)) {
        this.clickCloseDisableForm();
        this.$emit("close");
      }
    },
    async changeTimeline(consultant_id) {
      let query = {
        ...this.$route.query,
      };
      query.consultant_id = consultant_id;
      query.step = 0;
      await this.$router.push({ query: query });
    },
  },
};
</script>

<style>
</style>