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
      <TestForm
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
      <div class="col-6 text-right ml-auto">
        <button
          class="btn btn-primary scale mr-2"
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
        <Loader v-if="loader" />
        <!-- <CompanyGridView
          :companies="this.COMPANIES"
          v-if="viewMode && this.COMPANIES[0]"
        /> -->
        <CompanyTableView
          :companies="this.COMPANIES"
          v-if="this.COMPANIES.length"
        />
        <h1
          class="text-center text-dark py-5"
          v-if="!this.COMPANIES.length && !loader"
        >
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
// import CompanyGridView from "@/components/companies/companies/CompanyGridView.vue";
import CompanyTableView from "@/components/companies/companies/CompanyTableView.vue";
import Search from "@/components/common/Search.vue";
import TestForm from "@/components/companies/forms/company-form/TestForm.vue";
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
    TestForm,
    CompanyGroupsForm,
  },
  methods: {
    ...mapActions(["FETCH_COMPANIES", "SEARCH_COMPANIES"]),
    async getCompanies() {
      this.loader = true;
      const query = this.$route.query;
      await this.SEARCH_COMPANIES({ query });
      this.loader = false;
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