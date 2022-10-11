<template>
  <div class="step-action">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <CompanyRequestForm
          @closeCompanyForm="clickCloseCompanyRequestForm"
          :formdata="currentRequest"
          @updated="updatedRequest"
          v-if="companyRequestFormVisible"
        />
      </transition>
    </teleport>
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <CompanyRequestForm
          @closeCompanyForm="clickCloseCompanyForm"
          :formdata="currentCompany"
          @updated="updatedCompany"
          v-if="companyFormVisible"
        />
      </transition>
    </teleport>
    <div class="row no-gutters">
      <div class="col-12">
        <div class="row no-gutters inner scroller">
          <div class="col-12 mx-auto">
            <div class="timeline-actions row">
              <Meeting
                :step="step"
                :disabled="disabled"
                @updateItem="clickUpdateStep"
              />
            </div>
          </div>
          <div
            class="col-7 mx-auto mt-4 px-3"
            v-if="COMPANY && step.additional != 1"
          >
            <Loader v-if="loaderCompany" class="center small" />

            <CompanyDetailInfo :company="COMPANY" />
          </div>
          <div
            class="col-7 mx-auto company-request-list mt-4 px-3"
            v-if="currentRequest && step.additional == 1"
          >
            <Loader v-if="loaderCompanyRequests" class="center small" />

            <CompanyRequestItem
              :request="currentRequest"
              :editOnly="true"
              @openCompanyRequestFormForUpdate="
                companyRequestFormVisible = true
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Meeting from "../steps/Meeting.vue";
import CompanyRequestItem from "../../companies/request/CompanyRequestItem.vue";
import CompanyRequestForm from "../../forms/company-request-form/CompanyRequestForm.vue";
import CompanyDetailInfo from "@/components/companies/companies/CompanyDetailInfo.vue";
import { mapGetters, mapActions } from "vuex";
import { MixinStepActions } from "../mixins";
export default {
  name: "MeetingActions",
  mixins: [MixinStepActions],
  components: {
    Meeting,
    CompanyRequestItem,
    CompanyRequestForm,
    CompanyDetailInfo,
  },
  data() {
    return {
      companyRequestFormVisible: false,
      loaderCompanyRequests: false,
      companyFormVisible: false,
      loaderCompany: false,
    };
  },
  computed: {
    ...mapGetters(["COMPANY_REQUESTS", "COMPANY"]),
    currentRequest() {
      if (Array.isArray(this.COMPANY_REQUESTS)) {
        return this.COMPANY_REQUESTS.find(
          (item) => item.id == this.$route.query.request_id
        );
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["FETCH_COMPANY_REQUESTS", "FETCH_COMPANY"]),
    updatedRequest() {
      this.getCompanyRequests();
      console.log("UPDATED");
    },
    updatedCompany() {
      this.getCompany();
      console.log("UPDATED");
    },
    async getCompany() {
      this.loaderCompany = true;
      await this.FETCH_COMPANY(this.$route.params.id);
      this.loaderCompany = false;
    },
    async getCompanyRequests() {
      this.loaderCompanyRequests = true;
      await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
      this.loaderCompanyRequests = false;
    },
    clickCloseCompanyRequestForm() {
      this.companyRequestFormVisible = false;
    },
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
    },
  },
  emits: ["updateStep"],
};
</script>

<style>
</style>