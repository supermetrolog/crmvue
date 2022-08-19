<template>
  <div class="company">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal__fullscreen"
      leave-active-class="animate__animated animate__zoomOut for__modal__fullscreen"
    >
      <Timeline
        v-if="timelineVisible && COMPANY && COMPANY_REQUESTS[0]"
        @close="closeTimeline"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyDealForm
        @close="clickCloseDealForm"
        :formdata="deal"
        @updated="updatedDeal"
        v-if="dealFormVisible"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyRequestForm
        @closeCompanyForm="clickCloseCompanyRequestForm"
        :company_id="COMPANY.id"
        :formdata="request"
        @created="createdRequest"
        @updated="updatedRequest"
        v-if="companyRequestFormVisible"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyContactForm
        @closeCompanyForm="clickCloseCompanyContactForm"
        :company_id="COMPANY.id"
        :formdata="contact"
        @created="createdContact"
        @updated="updatedContact"
        v-if="companyContactFormVisible"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyForm
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
            @click.prevent="openCompanyFormForUpdate(COMPANY)"
            :disabled="COMPANY ? false : true"
          >
            Редактировать информацию
          </button>
        </div>
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyDetailInfo" class="center" />
          <CompanyDetailInfo
            :company="COMPANY"
            v-if="!loaderCompanyDetailInfo"
          />
          <NoData v-if="!COMPANY && !loaderCompanyDetailInfo" />
        </div>
      </div>

      <div class="col-12 col-lg-3 company-request-container box">
        <div class="col-12 p-0 mb-3">
          <button
            class="btn btn-primary scale d-block btn-large"
            :disabled="COMPANY ? false : true"
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
            @cloned="getCompanyRequests"
            v-if="!loaderCompanyRequests"
          />
          <NoData v-if="!COMPANY_REQUESTS.length && !loaderCompanyRequests" />
          <div
            class="row"
            v-if="
              !loaderCompanyRequests &&
              COMPANY &&
              COMPANY.dealsRequestEmpty.length
            "
          >
            <div class="col-12 p-0">
              <DealList
                class="mb-2 mt-1"
                :deals="COMPANY.dealsRequestEmpty"
                @openDealFormForUpdate="openDealFormForUpdate"
                @deleted="getCompany(false)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4 box">
        <div class="col-12 inner">
          <Loader v-if="loaderCompanyObjects" class="center" />
          <CompanyObjectList :objects="COMPANY_OBJECTS" />
          <NoData v-if="!COMPANY_OBJECTS.length && !loaderCompanyObjects" />
          <Joke />
        </div>
      </div>
      <div class="col-12 col-lg-2 company-detail-info-container box">
        <div class="col-12 p-0 mb-3">
          <button
            class="btn btn-primary scale d-block btn-large"
            @click.prevent="clickOpenCompanyContactForm"
            :disabled="COMPANY ? false : true"
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
import CompanyRequestList from "@/components/companies/companies/request/CompanyRequestList.vue";
import CompanyRequestForm from "@/components/companies/forms/company-request-form/CompanyRequestForm.vue";
import CompanyContactForm from "@/components/companies/forms/company-contact-form/CompanyContactForm.vue";
import CompanyForm from "@/components/companies/forms/company-form/CompanyForm.vue";
import CompanyDealForm from "@/components/companies/forms/company-deal-form/CompanyDealForm";
import CompanyContactList from "@/components/companies/companies/contact/CompanyContactList.vue";
import CompanyObjectList from "@/components/companies/objects/company-objects/CompanyObjectList";
import Timeline from "@/components/companies/timeline/Timeline.vue";
// import DealItem from "@/components/companies/companies/deal/DealItem.vue";
import DealList from "@/components/companies/companies/deal/DealList.vue";
import NoData from "@/components/common/NoData";
import Joke from "@/components/common/Joke";
export default {
  name: "Company",
  components: {
    CompanyDetailInfo,
    CompanyRequestList,
    CompanyRequestForm,
    CompanyContactForm,
    CompanyForm,
    CompanyContactList,
    Timeline,
    NoData,
    Joke,
    CompanyObjectList,
    DealList,
    CompanyDealForm,
  },
  data() {
    return {
      loaderCompanyDetailInfo: true,
      loaderCompanyRequests: true,
      loaderCompanyContacts: true,
      loaderCompanyObjects: true,
      companyRequestFormVisible: false,
      companyContactFormVisible: false,
      companyFormVisible: false,
      dealFormVisible: false,
      timelineVisible: false,
      request: null,
      contact: null,
      company: null,
      deal: null,
    };
  },
  computed: {
    ...mapGetters([
      "COMPANY",
      "COMPANY_REQUESTS",
      "COMPANY_CONTACTS",
      "COMPANY_OBJECTS",
      "TIMELINE_LIST",
    ]),
  },
  methods: {
    ...mapActions([
      "FETCH_COMPANY",
      "FETCH_COMPANY_REQUESTS",
      "FETCH_COMPANY_CONTACTS",
      "FETCH_COMPANY_OBJECTS",
      "ADD_TO_TRANSITION_LIST",
    ]),
    async getCompany(withLoader = true) {
      this.loaderCompanyDetailInfo = withLoader;
      await this.FETCH_COMPANY(this.$route.params.id);
      this.loaderCompanyDetailInfo = false;
      if (!this.COMPANY) {
        this.$router.replace("/not-found");
        return;
      }
      this.ADD_TO_TRANSITION_LIST(this.COMPANY);
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
    async getCompanyObjects(withLoader = true) {
      this.loaderCompanyObjects = withLoader;
      await this.FETCH_COMPANY_OBJECTS(this.$route.params.id);
      this.loaderCompanyObjects = false;
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
    clickOpenDealForm() {
      this.dealFormVisible = true;
    },
    clickCloseDealForm() {
      this.dealFormVisible = false;
      this.deal = null;
    },
    openDealFormForUpdate(deal) {
      this.deal = deal;
      this.clickOpenDealForm();
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
    updatedDeal() {
      this.getCompany(false);
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
      if (this.$route.query.request_id) {
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
  async created() {
    this.getCompany();
    this.getCompanyContacts();
    this.getCompanyObjects();
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