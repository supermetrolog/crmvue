<template>
  <div class="company">
    <Modal
      class="fullscreen"
      title="Бизнес процесс"
      v-if="timelineVisible"
      @close="closeTimeline"
    >
      <Timeline />
    </Modal>
    <CompanyRequestForm
      @closeCompanyForm="clickCloseCompanyRequestForm()"
      :company_id="COMPANY[0].id"
      :formdata="request"
      @created="createdRequest"
      @updated="updatedRequest"
      v-if="companyRequestFormVisible"
    />
    <CompanyContactForm
      @closeCompanyForm="clickCloseCompanyContactForm()"
      v-if="companyContactFormVisible"
    />
    <div class="row no-gutters">
      <div class="col-12 col-lg-3 company-detail-info-container box">
        <div class="col-12 p-0 mb-3">
          <button
            class="btn btn-primary d-block btn-large"
            @click.prevent="clickOpenCompanyForm"
          >
            Редактировать информацию
          </button>
        </div>
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyDetailInfo" class="center" />
          <CompanyDetailInfo
            :company="this.COMPANY[0]"
            v-if="!loaderCompanyDetailInfo"
          />
        </div>
      </div>

      <div class="col-12 col-lg-3 company-request-container box">
        <div class="col-12 p-0 mb-3">
          <button
            class="btn btn-primary d-block btn-large"
            :disabled="COMPANY[0] ? false : true"
            @click.prevent="clickOpenCompanyRequestForm"
          >
            Создать запрос
          </button>
        </div>
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyRequests" class="center" />
          <CompanyRequestList
            :requests="this.COMPANY_REQUESTS"
            @openCompanyRequestFormForUpdate="openCompanyRequestFormForUpdate"
            v-if="!loaderCompanyRequests"
          />
        </div>
      </div>
      <div class="col-12 col-lg-4 company-detail-info-container box">
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyDetailInfo" class="center" />
          <CompanyDetailInfo
            :company="this.COMPANY[0]"
            v-if="!loaderCompanyDetailInfo"
          />
        </div>
      </div>
      <div class="col-12 col-lg-2 company-detail-info-container box">
        <div class="col-12 p-0 mb-3">
          <button
            class="btn btn-primary d-block btn-large"
            @click.prevent="clickOpenCompanyContactForm"
          >
            создать контакт
          </button>
        </div>
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyRequests" class="center" />
          <CompanyContactList
            :contacts="this.COMPANY_REQUESTS"
            v-if="!loaderCompanyRequests"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CompanyDetailInfo from "@/components/companies/companies/CompanyDetailInfo.vue";
import Loader from "@/components/Loader";
import CompanyRequestList from "@/components/companies/companies/request/CompanyRequestList.vue";
import CompanyRequestForm from "@/components/companies/forms/company-request-form/CompanyRequestForm.vue";
import CompanyContactForm from "@/components/companies/forms/company-contact-form/CompanyContactForm.vue";
import CompanyContactList from "@/components/companies/companies/contact/CompanyContactList.vue";
import Modal from "@/components/Modal.vue";
import Timeline from "@/components/companies/timeline/Timeline.vue";
export default {
  name: "Company",
  components: {
    CompanyDetailInfo,
    CompanyRequestList,
    Loader,
    CompanyRequestForm,
    CompanyContactForm,
    CompanyContactList,
    Modal,
    Timeline,
  },
  data() {
    return {
      loaderCompanyDetailInfo: true,
      loaderCompanyRequests: true,
      companyRequestFormVisible: false,
      request: null,
      companyContactFormVisible: false,
      timelineVisible: false,
    };
  },
  computed: {
    ...mapGetters(["COMPANY", "COMPANY_REQUESTS"]),
  },
  methods: {
    ...mapActions(["FETCH_COMPANY", "FETCH_COMPANY_REQUESTS"]),
    async getCompany() {
      this.loaderCompanyDetailInfo = true;
      await this.FETCH_COMPANY(this.$route.params.id);
      this.loaderCompanyDetailInfo = false;
    },
    async getCompanyRequests() {
      this.loaderCompanyRequests = true;
      await this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
      this.loaderCompanyRequests = false;
    },
    clickCloseCompanyRequestForm() {
      this.companyRequestFormVisible = false;
      this.request = null;
    },
    clickOpenCompanyRequestForm() {
      this.companyRequestFormVisible = true;
    },
    openCompanyRequestFormForUpdate(request) {
      this.request = request;
      this.clickOpenCompanyRequestForm();
    },
    createdRequest() {
      this.getCompanyRequests();
      console.log("CREATED");
    },
    updatedRequest() {
      this.getCompanyRequests();
      console.log("UPDATED");
    },
    clickCloseCompanyContactForm() {
      this.companyContactFormVisible = false;
    },
    clickOpenCompanyContactForm() {
      this.companyContactFormVisible = true;
    },
    timeline() {
      if (this.$route.query.timeline) {
        this.timelineVisible = true;
      } else {
        this.timelineVisible = false;
      }
    },
    closeTimeline() {
      this.timelineVisible = false;
      this.$router.push({ name: "company" });
    },
  },
  created() {
    this.getCompany();
    this.getCompanyRequests();
    this.timeline();
  },
  watch: {
    $route() {
      this.timeline();
    },
  },
};
</script>

<style>
</style>