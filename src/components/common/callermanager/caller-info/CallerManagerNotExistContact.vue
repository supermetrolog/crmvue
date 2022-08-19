<template>
  <div class="caller-manager__contact">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyForm
        v-if="companyFormVisible"
        @closeCompanyForm="companyFormVisible = false"
        @created="createdCompany"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyRequestForm
        @closeCompanyForm="requestFormVisible = false"
        :company_id="createdCompanyId"
        v-if="requestFormVisible"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyContactForm
        @closeCompanyForm="contactFormVisible = false"
        :company_id="createdCompanyId"
        v-if="contactFormVisible"
      />
    </transition>
    <div class="row no-gutters caller-manager__contact__container">
      <div class="col-12 text-center">
        <b>НЕИЗВЕСТНЫЙ КОНТАКТ</b>
      </div>
      <div class="col-12 text-center mt-3">
        <button class="btn btn-primary" @click="companyFormVisible = true">
          Создать компанию
        </button>
      </div>
      <div class="col-12 text-center mt-3">
        <button class="btn btn-primary" @click="contactFormVisible = true">
          Создать контакт
        </button>
      </div>
      <div class="col-12 text-center mt-3">
        <button class="btn btn-primary" @click="requestFormVisible = true">
          Создать запрос
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyForm from "@/components/companies/forms/company-form/CompanyForm.vue";
import CompanyRequestForm from "@/components/companies/forms/company-request-form/CompanyRequestForm.vue";
import CompanyContactForm from "@/components/companies/forms/company-contact-form/CompanyContactForm.vue";
export default {
  name: "CallerManagerNotExistContact",
  components: {
    CompanyForm,
    CompanyRequestForm,
    CompanyContactForm,
  },
  data() {
    return {
      companyFormVisible: false,
      requestFormVisible: false,
      contactFormVisible: false,
      createdCompanyId: null,
    };
  },

  methods: {
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
    },
    createdCompany(company_id) {
      console.log(company_id);
      this.createdCompanyId = company_id;
    },
  },
};
</script>

<style>
</style>