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
          <template class="row"
            ><div class="col-9 mx-auto" v-if="COMPANY && step.additional != 1">
              <Loader v-if="loaderCompany" class="center small" />

              <CompanyDetailInfoAlternative :company="COMPANY" />
            </div>
            <div
              class="col-9 mx-auto company-request-list mt-4 px-3"
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
            <div
              class="col-3 company-request-list company-contact-list"
              v-if="COMPANY && step.additional != 1"
            >
              <CompanyContactItem
                v-for="contact of this.COMPANY_CONTACTS"
                :key="contact.id"
                :contact="contact"
                @openContactFormForUpdate="openContactFormForUpdate"
                @createComment="createComment"
                @deleteContact="clickDeleteContact"
              /></div
          ></template>
          <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
          >
            <CompanyContactForm
              @closeCompanyForm="clickCloseCompanyContactForm"
              :company_id="COMPANY.id"
              :formdata="editContact"
              @created="createdContact"
              @updated="updatedContact"
              v-if="companyContactFormVisible"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyContactForm from "../../forms/company-contact-form/CompanyContactForm.vue";
import CompanyDetailInfoAlternative from "../../companies/CompanyDetailInfoAlternative.vue";
import CompanyContactItem from "../../companies/contact/CompanyContactItem.vue";
import Meeting from "../steps/Meeting.vue";
import CompanyRequestItem from "../../companies/request/CompanyRequestItem.vue";
import CompanyRequestForm from "../../forms/company-request-form/CompanyRequestForm.vue";
import { mapGetters, mapActions } from "vuex";
import { MixinStepActions } from "../mixins";
export default {
  name: "MeetingActions",
  mixins: [MixinStepActions],
  components: {
    Meeting,
    CompanyRequestItem,
    CompanyRequestForm,
    CompanyContactItem,
    CompanyDetailInfoAlternative,
    CompanyContactForm,
  },
  data() {
    return {
      companyRequestFormVisible: false,
      loaderCompanyRequests: false,
      companyFormVisible: false,
      loaderCompany: false,
      companyContactFormVisible: false,
      editContact: null,
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
    ]),
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
      console.log(contact);
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
  },
  async created() {
    this.getCompanyContacts();
  },
  emits: ["updateStep"],
};
</script>

<style>
</style>