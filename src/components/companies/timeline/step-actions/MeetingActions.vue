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
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <CompanyContactForm
          @closeCompanyForm="clickCloseCompanyContactForm"
          :company_id="COMPANY.id"
          :formdata="editContact"
          @updated="getCompanyContacts"
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
                @stageChanged="changeStage"
              />
            </div>
          </div>

          <div
            class="col-12 mx-auto row mt-4 pl-0"
            v-if="(COMPANY && step.additional != 1) || currentStage === 1"
          >
            <Loader v-if="loaderCompany" class="center small" />

            <div class="col-9 pl-0">
              <CompanyDetailInfoAlternative
                :company="COMPANY"
                @openCompanyFormForUpdate="companyFormVisible = true"
              />
            </div>
            <div class="col-3 company-request-list company-contact-list">
              <CompanyContactItem
                v-for="contact of this.COMPANY_CONTACTS"
                :key="contact.id"
                :contact="contact"
                @openContactFormForUpdate="openContactFormForUpdate"
                @createComment="createComment"
                @deleteContact="clickDeleteContact"
              />
            </div>
          </div>
          <div
            class="col-12 mx-auto mt-4 p-3"
            v-if="currentRequest && step.additional == 1 && currentStage !== 1"
          >
            <Loader v-if="loaderCompanyRequests" class="center small" />
            <div class="mb-2">
              <strong>{{
                currentRequest.name || "Запрос" + " #" + currentRequest.id
              }}</strong>
            </div>
            <CompanyRequestItemAlt
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
import CompanyRequestItemAlt from "../../companies/request/CompanyRequestItemAlt.vue";
import CompanyForm from "../../forms/company-form/CompanyForm.vue";
import CompanyContactForm from "../../forms/company-contact-form/CompanyContactForm.vue";
import CompanyDetailInfoAlternative from "../../companies/CompanyDetailInfoAlternative.vue";
import CompanyContactItem from "../../companies/contact/CompanyContactItem.vue";
import Meeting from "../steps/Meeting.vue";
import CompanyRequestForm from "../../forms/company-request-form/CompanyRequestForm.vue";
import { mapGetters, mapActions } from "vuex";
import { MixinStepActions } from "../mixins";
export default {
  name: "MeetingActions",
  mixins: [MixinStepActions],
  components: {
    Meeting,
    CompanyRequestForm,
    CompanyContactItem,
    CompanyDetailInfoAlternative,
    CompanyContactForm,
    CompanyForm,
    CompanyRequestItemAlt,
  },
  data() {
    return {
      companyRequestFormVisible: false,
      loaderCompanyRequests: false,
      companyFormVisible: false,
      loaderCompany: false,
      companyContactFormVisible: false,
      editContact: null,
      currentStage: null,
    };
  },
  computed: {
    ...mapGetters(["COMPANY_REQUESTS", "COMPANY", "COMPANY_CONTACTS"]),
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
    ...mapActions([
      "FETCH_COMPANY_REQUESTS",
      "FETCH_COMPANY",
      "FETCH_COMPANY_CONTACTS",
      "DELETE_CONTACT",
      "CREATE_CONTACT_COMMENT",
      "ADD_TO_TRANSITION_LIST",
    ]),
    updatedRequest() {
      this.getCompanyRequests();
    },
    updatedCompany() {
      this.getCompany();
      this.getCompanyContacts(false);
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
    clickOpenCompanyForm() {
      this.companyFormVisible = true;
    },
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
    },
    async getCompanyContacts(withLoader = true) {
      this.loaderCompanyContacts = withLoader;
      await this.FETCH_COMPANY_CONTACTS(this.$route.params.id);
      this.loaderCompanyContacts = false;
    },

    openContactFormForUpdate(contact) {
      this.editContact = contact;
      this.clickOpenCompanyContactForm();
    },
    clickCloseCompanyContactForm() {
      this.companyContactFormVisible = false;
      this.editContact = null;
    },
    clickOpenCompanyContactForm() {
      this.companyContactFormVisible = true;
    },

    clickDeleteContact(contact) {
      this.deletedContactItem = contact;
    },
    async createComment(data) {
      this.createCommentLoader = true;
      await this.CREATE_CONTACT_COMMENT(data);
      this.$emit("createComment");
      this.createCommentLoader = false;
    },
    async deleteContact(contact) {
      this.deleteLoader = true;
      await this.DELETE_CONTACT(contact);
      this.$emit("deleteContact");
      this.deleteLoader = false;
      this.deletedContactItem = null;
    },
    changeStage(stage) {
      this.currentStage = stage;
    },
  },
  async created() {
    this.getCompanyContacts();
  },
  emits: ["updateStep"],
};
</script>

<style>
</style>