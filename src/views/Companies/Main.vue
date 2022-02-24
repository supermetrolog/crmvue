<template>
  <div class="all">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyGroupsForm
        @closeCompanyGroupsForm="companyGroupsFormVisible = false"
        v-if="companyGroupsFormVisible"
      />
    </transition>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <CompanyForm
        v-if="companyFormVisible"
        @closeCompanyForm="clickCloseCompanyForm"
        @created="createdCompany"
      />
    </transition>
    <div class="row no-gutters search-main-container">
      <div class="container py-3">
        <div class="col-12 search-container">
          <Search />
        </div>
        <CompanySearchForm />
      </div>
    </div>
    <hr />

    <div class="row no-gutters companies-actions">
      <!-- <div class="col-6">
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
      </div> -->
      <div class="col-6">
        <PaginationClassic
          :pagination="COMPANIES_PAGINATION"
          @next="next"
          v-if="COMPANIES_PAGINATION"
        />
      </div>
      <div class="col-6 text-right ml-auto">
        <button
          class="btn btn-primary mr-2"
          @click="companyGroupsFormVisible = true"
        >
          Создать группу компаний
        </button>
        <button class="btn btn-primary" @click="companyFormVisible = true">
          Создать компанию
        </button>
      </div>
    </div>
    <div class="row no-gutters mt-2">
      <div class="col-12 companies-list-container">
        <Loader v-if="loader && !COMPANIES.length" class="center" />
        <CompanyTableView
          :companies="COMPANIES"
          v-if="COMPANIES.length"
          :loader="loader"
        />
        <h1
          class="text-center text-dark py-5"
          v-if="!COMPANIES.length && !loader"
        >
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
      <PaginationClassic
        class="mt-3 my-3"
        :pagination="COMPANIES_PAGINATION"
        @next="next"
        v-if="COMPANIES_PAGINATION"
      />
    </div>
  </div>
</template>

<script>
// import CompanyGridView from "@/components/companies/companies/CompanyGridView.vue";
import CompanyTableView from "@/components/companies/companies/CompanyTableView.vue";
import Search from "@/components/common/Search.vue";
import CompanyForm from "@/components/companies/forms/company-form/CompanyForm.vue";
import CompanySearchForm from "@/components/companies/forms/company-form/CompanySearchForm.vue";
import { mapGetters, mapActions } from "vuex";
import CompanyGroupsForm from "@/components/companies/forms/company-groups-form/CompanyGroupsForm.vue";

export default {
  name: "CompaniesMain",
  data() {
    return {
      loader: true,
      companyFormVisible: false,
      viewMode: false,
      companyGroupsFormVisible: false,
    };
  },
  components: {
    // CompanyGridView,
    CompanyTableView,
    Search,
    CompanyForm,
    CompanyGroupsForm,
    CompanySearchForm,
  },
  methods: {
    ...mapActions(["FETCH_COMPANIES", "SEARCH_COMPANIES"]),
    async getCompanies() {
      this.loader = true;
      const query = this.$route.query;
      await this.SEARCH_COMPANIES({ query });
      this.loader = false;
    },
    async next(number) {
      let query = { ...this.$route.query };
      query.page = number;
      await this.$router.push({ query });
      // this.getCompanies();
    },
    async resetRoute() {
      let query = { ...this.$route.query };
      query.page = 1;
      await this.$router.push({ query });
    },
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
    },
    createdCompany() {
      this.getCompanies();
    },
  },
  computed: {
    ...mapGetters(["COMPANIES", "COMPANIES_PAGINATION"]),
  },
  created() {
    // await this.resetRoute();
    this.getCompanies();
    console.log(this.$route);
  },
  watch: {
    $route() {
      this.getCompanies();
    },
  },
};
</script>

<style>
</style>