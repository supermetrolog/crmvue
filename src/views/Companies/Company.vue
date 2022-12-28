<template>
  <div class="company">
    <p
      v-if="!loaderCompanyDetailInfo && this.COMPANY.status === 0"
      class="company-passive"
    >
      <span>Пассив</span>
      <span v-if="COMPANY.passive_why !== null">
        ({{ passiveWhyList[COMPANY.passive_why].label }})</span
      >
      <span v-if="COMPANY.passive_why_comment !== null">
        комм: {{ COMPANY.passive_why_comment }}</span
      >
    </p>
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
        :formdata="COMPANY"
        @closeCompanyForm="clickCloseCompanyForm"
        @updated="updatedCompany"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyContactModal
        v-if="contactModalVisible"
        :contact="contact"
        @closeContactModal="clickCloseContactModal"
        @clickEditContact="openContactFormForUpdate"
      />
    </transition>

    <div class="company-wrapper">
      <Loader v-if="loaderCompanyDetailInfo"></Loader>
      <CompanyBoxMain
        v-if="!loaderCompanyDetailInfo"
        :company="COMPANY"
        :contacts="this.COMPANY_CONTACTS"
        @editCompany="clickOpenCompanyForm"
        @createContact="clickOpenCompanyContactForm"
      />
      <CompanyBoxLayout :class="'grid-b'" v-if="!loaderCompanyDetailInfo">
        <template #header>
          <span>Лог работы с {{ this.COMPANY.nameRu }}</span>
        </template>
      </CompanyBoxLayout>
      <CompanyBoxObjects
        v-if="!loaderCompanyObjects"
        :objects="COMPANY_OBJECTS"
      />
      <CompanyBoxRequests
        v-if="!loaderCompanyRequests"
        :requests="COMPANY_REQUESTS"
        :deals="COMPANY.dealsRequestEmpty"
      />
      <CompanyBoxServices v-if="!loaderCompanyDetailInfo" />
    </div>
  </div>
</template>

<script>
import CompanyContactModal from "../../components/companies/companies/contact/CompanyContactModal.vue";
import CompanyBoxServices from "../../components/companies/company-boxes/services/CompanyBoxServices.vue";
import CompanyBoxRequests from "../../components/companies/company-boxes/requests/CompanyBoxRequests.vue";
import CompanyBoxObjects from "../../components/companies/company-boxes/objects/CompanyBoxObjects.vue";
import CompanyBoxLayout from "../../components/companies/company-boxes/CompanyBoxLayout.vue";
import CompanyBoxMain from "../../components/companies/company-boxes/main/CompanyBoxMain.vue";
import { mapActions, mapGetters } from "vuex";
import CompanyRequestForm from "@/components/companies/forms/company-request-form/CompanyRequestForm.vue";
import CompanyContactForm from "@/components/companies/forms/company-contact-form/CompanyContactForm.vue";
import CompanyForm from "@/components/companies/forms/company-form/CompanyForm.vue";
import CompanyDealForm from "@/components/companies/forms/company-deal-form/CompanyDealForm";
import Timeline from "@/components/companies/timeline/Timeline.vue";
import { PassiveWhy } from "@/const/Const.js";
export default {
  name: "Company",
  components: {
    CompanyRequestForm,
    CompanyContactForm,
    CompanyForm,
    Timeline,
    CompanyDealForm,
    CompanyBoxLayout,
    CompanyBoxMain,
    CompanyBoxObjects,
    CompanyBoxRequests,
    CompanyBoxServices,
    CompanyContactModal,
  },
  data() {
    return {
      loaderCompanyDetailInfo: true,
      loaderCompanyRequests: true,
      loaderCompanyContacts: true,
      loaderCompanyObjects: true,
      companyRequestFormVisible: false,
      companyContactFormVisible: false,
      contactModalVisible: false,
      companyFormVisible: false,
      dealFormVisible: false,
      timelineVisible: false,
      request: null,
      contact: null,
      company: null,
      deal: null,
      passiveWhyList: PassiveWhy.get("param"),
    };
  },
  provide() {
    return {
      openContact: (contact) => this.openContact(contact),
      createContactComment: (data) => this.createContactComment(data),
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
      "CREATE_CONTACT_COMMENT",
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
    openContact(contact) {
      this.contactModalVisible = true;
      this.contact = contact;
      console.log(contact);
      // this.openContactFormForUpdate(contact);
    },
    clickCloseContactModal() {
      this.contactModalVisible = false;
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
      this.contactModalVisible = false;
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
    async createContactComment(data) {
      await this.CREATE_CONTACT_COMMENT(data);
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