<template>
  <div class="all">
    <CompanyForm
      v-if="companyFormVisible"
      @closeCompanyForm="clickCloseCompanyForm"
    />
    <div class="row no-gutters search-main-container">
      <div class="container p-3">
        <div class="col-12 search-container">
          <Search @search="clickSearch" />
        </div>
        <button class="btn btn-primary mr-5" @click="companyFormVisible = true">
          Создать
        </button>
      </div>
    </div>
    <hr />
    <div class="row no-gutters">
      <div class="col-12 companies-list-container pt-4">
        <Loader v-if="loader" />
        <CompanyList :companies="this.COMPANIES" />
        <h1
          class="text-center text-primary"
          v-if="!this.COMPANIES[0] && !loader"
        >
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyList from "@/components/companies/companies/CompanyList.vue";
import Loader from "@/components/Loader.vue";
import Search from "@/components/Search.vue";
import CompanyForm from "@/components/companies/forms/company-form/CompanyForm.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "All",
  data() {
    return {
      loader: true,
      companyFormVisible: false,
    };
  },
  components: {
    CompanyList,
    Loader,
    Search,
    CompanyForm,
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
      console.log(this.COMPANIES[0]);
      this.loader = false;
    },
    clickSearch(param) {
      console.log(param);
      this.getCompanies(param);
    },
    clickCloseCompanyForm() {
      this.companyFormVisible = false;
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