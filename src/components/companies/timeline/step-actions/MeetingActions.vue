<template>
  <div class="step-action">
    <CompanyRequestForm
      @closeCompanyForm="clickCloseCompanyRequestForm"
      :formdata="currentRequest"
      @updated="updatedRequest"
      v-if="companyRequestFormVisible"
    />
    <div class="row no-gutters">
      <div class="col-6">
        <div class="row no-gutters inner scroller">
          <div class="col-12">
            <div class="timeline-actions row">
              <Meeting
                :step="step"
                @updateItem="clickUpdateStep"
                @openRequestFormForUpdate="companyRequestFormVisible = true"
              />
            </div>
          </div>
          <div
            class="col-12 mx-auto company-request-list mt-4 px-3"
            v-if="currentRequest"
          >
            <Loader v-if="loaderCompanyRequests" class="center small" />

            <CompanyRequestItem :request="currentRequest" :reedOnly="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Meeting from "../steps/Meeting.vue";
import CompanyRequestItem from "../../companies/request/CompanyRequestItem.vue";
import Loader from "@/components/Loader";
import CompanyRequestForm from "../../forms/company-request-form/CompanyRequestForm.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "MeetingActions",
  components: {
    Meeting,
    CompanyRequestItem,
    CompanyRequestForm,
    Loader,
  },
  data() {
    return {
      companyRequestFormVisible: false,
      loaderCompanyRequests: false,
    };
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
  },
  computed: {
    ...mapGetters(["COMPANY_REQUESTS"]),
    currentRequest() {
      if (Array.isArray(this.COMPANY_REQUESTS)) {
        return this.COMPANY_REQUESTS.find(
          (item) => item.id == this.$route.query.timeline
        );
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["FETCH_COMPANY_REQUESTS"]),
    clickUpdateStep(data, flag) {
      this.$emit("updateStep", data, flag);
    },
    updatedRequest() {
      this.getCompanyRequests();
      console.log("UPDATED");
    },
    async getCompanyRequests() {
      this.loaderCompanyRequests = true;
      await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
      this.loaderCompanyRequests = false;
    },
    clickCloseCompanyRequestForm() {
      this.companyRequestFormVisible = false;
    },
  },
  emits: ["updateStep"],
};
</script>

<style>
</style>