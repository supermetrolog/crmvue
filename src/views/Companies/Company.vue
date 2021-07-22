<template>
  <div class="company">
    <Modal v-if="timelineVisible" @close="closeTimeline">
      <Timeline />
    </Modal>
    <CompanyRequestForm
      @closeCompanyForm="clickCloseCompanyForm()"
      v-if="companyRequestFormVisible"
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
            @click.prevent="clickOpenCompanyForm"
          >
            Создать запрос
          </button>
        </div>
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyRequests" class="center" />
          <CompanyRequestList
            :requests="this.COMPANY_REQUESTS"
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
            @click.prevent="clickOpenCompanyForm"
          >
            создать контакт
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
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CompanyDetailInfo from "@/components/companies/companies/CompanyDetailInfo.vue";
import Loader from "@/components/Loader";
import CompanyRequestList from "@/components/companies/companies/request/CompanyRequestList.vue";
import CompanyRequestForm from "@/components/companies/forms/company-request-form/CompanyRequestForm.vue";
import Modal from "@/components/Modal.vue";
import Timeline from "@/components/companies/timeline/Timeline.vue";
export default {
  name: "Company",
  components: {
    CompanyDetailInfo,
    CompanyRequestList,
    Loader,
    CompanyRequestForm,
    Modal,
    Timeline,
  },
  data() {
    return {
      loaderCompanyDetailInfo: true,
      loaderCompanyRequests: true,
      companyRequestFormVisible: false,
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
    clickCloseCompanyForm() {
      this.companyRequestFormVisible = false;
    },
    clickOpenCompanyForm() {
      this.companyRequestFormVisible = true;
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