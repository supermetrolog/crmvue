<template>
  <div class="all">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__lightSpeedInRight for__modal absolute"
      leave-active-class="animate__animated animate__lightSpeedOutRight for__modal absolute"
    >
      <!-- <CompanyForm
        v-if="companyFormVisible"
        @closeCompanyForm="clickCloseCompanyForm"
        @created="createdCompany"
      /> -->
      <TestForm
        v-if="companyFormVisible"
        @closeCompanyForm="clickCloseCompanyForm"
        @created="createdCompany"
      />
    </transition>
    <div class="row no-gutters search-main-container">
      <div class="container py-3">
        <div class="col-12 search-container">
          <Search @search="clickSearch" />
        </div>
      </div>
    </div>
    <hr />

    <div class="row no-gutters companies-actions">
      <div class="col-6">
        <p class="d-inline">Вид:</p>
        <button
          class="btn btn-action text-dark"
          :class="{ active: !viewMode }"
          @click="viewMode = false"
        >
          <i class="fas fa-th-list"></i>
        </button>
        <button
          class="btn btn-action text-primary"
          :class="{ active: viewMode }"
          @click="viewMode = true"
        >
          <i class="fas fa-th"></i>
        </button>
      </div>
      <div class="col-6 text-right">
        <button class="btn btn-primary" @click="companyFormVisible = true">
          Создать компанию
        </button>
      </div>
    </div>
    <div class="row no-gutters mt-2">
      <div class="col-12 companies-list-container">
        <Loader v-if="loader" />
        <CompanyGridView :companies="this.COMPANIES" v-if="viewMode" />
        <CompanyTableView :companies="this.COMPANIES" v-else />
        <h1
          class="text-center text-dark py-5"
          v-if="!this.COMPANIES[0] && !loader"
        >
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyGridView from "@/components/companies/companies/CompanyGridView.vue";
import CompanyTableView from "@/components/companies/companies/CompanyTableView.vue";
import Loader from "@/components/Loader.vue";
import Search from "@/components/Search.vue";
// import CompanyForm from "@/components/companies/forms/company-form/CompanyForm.vue";
import TestForm from "@/components/companies/forms/company-form/TestForm.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Main",
  data() {
    return {
      loader: true,
      companyFormVisible: false,
      viewMode: false,
    };
  },
  components: {
    CompanyGridView,
    CompanyTableView,
    Loader,
    Search,
    // CompanyForm,
    TestForm,
  },
  methods: {
    ...mapActions(["FETCH_COMPANIES", "SEARCH_COMPANIES"]),
    async getCompanies(param = null) {
      this.loader = true;
      if (!param) {
        await this.FETCH_COMPANIES();
      } else {
        await this.SEARCH_COMPANIES(param);
      }
      this.loader = false;
    },
    clickSearch(param) {
      this.getCompanies(param);
    },
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
    },
    createdCompany() {
      this.getCompanies();
    },
  },
  computed: {
    ...mapGetters(["COMPANIES"]),
  },
  created() {
    this.getCompanies();
  },
};
</script>

<style>
</style>