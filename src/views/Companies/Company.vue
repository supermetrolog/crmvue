<template>
  <div class="company">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal__fullscreen"
      leave-active-class="animate__animated animate__zoomOut for__modal__fullscreen"
    >
      <Modal
        class="fullscreen"
        title="Бизнес процесс"
        v-if="timelineVisible && COMPANY[0] && COMPANY_REQUESTS[0]"
        @close="closeTimeline"
      >
        <Timeline />
      </Modal>
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__lightSpeedInRight for__modal absolute"
      leave-active-class="animate__animated animate__lightSpeedOutRight for__modal absolute"
    >
      <CompanyRequestForm
        @closeCompanyForm="clickCloseCompanyRequestForm"
        :company_id="COMPANY[0].id"
        :formdata="request"
        @created="createdRequest"
        @updated="updatedRequest"
        v-if="companyRequestFormVisible"
      />
    </transition>
    <!-- <transition
      mode="out-in"
      enter-active-class="animate__animated animate__lightSpeedInRight for__modal absolute"
      leave-active-class="animate__animated animate__lightSpeedOutRight for__modal absolute"
    >
      <CompanyContactForm
        @closeCompanyForm="clickCloseCompanyContactForm"
        :company_id="COMPANY[0].id"
        :formdata="contact"
        @created="createdContact"
        @updated="updatedContact"
        v-if="companyContactFormVisible"
      />
    </transition> -->
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__lightSpeedInRight for__modal absolute"
      leave-active-class="animate__animated animate__lightSpeedOutRight for__modal absolute"
    >
      <CompanyContactForm
        @closeCompanyForm="clickCloseCompanyContactForm"
        :company_id="COMPANY[0].id"
        :formdata="contact"
        @created="createdContact"
        @updated="updatedContact"
        v-if="companyContactFormVisible"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__lightSpeedInRight for__modal absolute"
      leave-active-class="animate__animated animate__lightSpeedOutRight for__modal absolute"
    >
      <!-- <CompanyForm
        v-if="companyFormVisible"
        :formdata="company"
        @updated="updatedCompany"
        @closeCompanyForm="clickCloseCompanyForm"
      /> -->
      <TestForm
        v-if="companyFormVisible"
        :formdata="company"
        @closeCompanyForm="clickCloseCompanyForm"
        @updated="updatedCompany"
      />
    </transition>

    <div class="row no-gutters">
      <div class="col-12 col-lg-3 company-detail-info-container box">
        <div class="col-12 p-0 mb-3">
          <button
            class="btn btn-primary scale d-block btn-large"
            @click.prevent="openCompanyFormForUpdate(COMPANY[0])"
            :disabled="COMPANY[0] ? false : true"
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
            class="btn btn-primary scale d-block btn-large"
            :disabled="COMPANY[0] ? false : true"
            @click.prevent="clickOpenCompanyRequestForm"
          >
            Создать запрос
          </button>
        </div>
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyRequests" class="center" />
          <CompanyRequestList
            :requests="COMPANY_REQUESTS"
            @openCompanyRequestFormForUpdate="openCompanyRequestFormForUpdate"
            v-if="!loaderCompanyRequests"
          />
          <NoData v-if="!COMPANY_REQUESTS.length && !loaderCompanyRequests" />
        </div>
      </div>
      <div class="col-12 col-lg-4 box">
        <div class="col-12 inner">
          <Joke />
        </div>
      </div>
      <div class="col-12 col-lg-2 company-detail-info-container box">
        <div class="col-12 p-0 mb-3">
          <button
            class="btn btn-primary scale d-block btn-large"
            @click.prevent="clickOpenCompanyContactForm"
            :disabled="COMPANY[0] ? false : true"
          >
            создать контакт
          </button>
        </div>
        <div
          class="col-12 inner"
          :class="{ 'no-height': !loaderCompanyContacts }"
        >
          <Loader v-if="loaderCompanyContacts" class="center" />
          <CompanyContactList
            :contacts="this.COMPANY_CONTACTS"
            @openContactFormForUpdate="openContactFormForUpdate"
            v-if="!loaderCompanyContacts"
          />
          <NoData
            class="text-small"
            v-if="!COMPANY_CONTACTS.length && !loaderCompanyContacts"
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
import TestForm from "@/components/companies/forms/company-form/TestForm.vue";
import CompanyContactList from "@/components/companies/companies/contact/CompanyContactList.vue";
import Modal from "@/components/Modal.vue";
import Timeline from "@/components/companies/timeline/Timeline.vue";
import NoData from "@/components/NoData";
import Joke from "@/components/Joke";
export default {
  name: "Company",
  components: {
    CompanyDetailInfo,
    CompanyRequestList,
    Loader,
    CompanyRequestForm,
    CompanyContactForm,
    TestForm,
    CompanyContactList,
    Modal,
    Timeline,
    NoData,
    Joke
  },
  data() {
    return {
      loaderCompanyDetailInfo: true,
      loaderCompanyRequests: true,
      loaderCompanyContacts: true,
      companyRequestFormVisible: false,
      companyContactFormVisible: false,
      companyFormVisible: false,
      timelineVisible: false,
      request: null,
      contact: null,
      company: null,
    };
  },
  computed: {
    ...mapGetters(["COMPANY", "COMPANY_REQUESTS", "COMPANY_CONTACTS"]),
  },
  methods: {
    ...mapActions([
      "FETCH_COMPANY",
      "FETCH_COMPANY_REQUESTS",
      "FETCH_COMPANY_CONTACTS",
    ]),
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
    async getCompanyContacts(withLoader = true) {
      this.loaderCompanyContacts = withLoader;
      await this.FETCH_COMPANY_CONTACTS(this.$route.params.id);
      this.loaderCompanyContacts = false;
    },
    openCompanyFormForUpdate(company) {
      this.company = company;
      this.clickOpenCompanyForm();
    },
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
      this.company = null;
    },
    clickOpenCompanyForm() {
      this.companyFormVisible = true;
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
    openContactFormForUpdate(contact) {
      this.contact = contact;
      this.clickOpenCompanyContactForm();
    },
    clickCloseCompanyContactForm() {
      this.companyContactFormVisible = false;
      this.contact = null;
    },
    clickOpenCompanyContactForm() {
      this.companyContactFormVisible = true;
    },
    createdRequest() {
      this.getCompanyRequests();
      console.log("CREATED");
    },
    updatedRequest() {
      this.getCompanyRequests();
      console.log("UPDATED");
    },
    createdContact() {
      this.getCompanyContacts();
      console.log("CREATED");
    },
    updatedContact() {
      this.getCompanyContacts();
      console.log("UPDATED");
    },
    updatedCompany() {
      this.getCompany();
      this.getCompanyContacts(false);
      console.log("UPDATED");
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
    this.getCompanyContacts();
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