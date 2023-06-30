<template>
  <div class="companies-requests">
    <div class="row">
      <div class="container py-3">
        <div class="col-12 px-md-5 py-3">
          <CompanyRequestSearchForm v-if="mounted" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <PaginationClassic
          class="mt-3 my-3"
          :pagination="REQUESTS_PAGINATION"
          @next="next"
          v-if="REQUESTS_PAGINATION"
        />
      </div>
      <div class="col-12">
        <Loader v-if="loader && !REQUESTS.length" class="center" />
        <RequestTable
          :loader="loader"
          :requests="REQUESTS"
          v-if="!this.isMobile"
        />
        <RequestTableMobile
          :loader="loader"
          :requests="REQUESTS"
          v-if="this.isMobile"
        />
        <h1
          class="text-center text-dark py-5"
          v-if="!REQUESTS.length && !loader"
        >
          НИЧЕГО НЕ НАЙДЕНО
        </h1>
      </div>
      <div class="col-12">
        <PaginationClassic
          class="mt-3 my-3"
          :pagination="REQUESTS_PAGINATION"
          @next="next"
          v-if="REQUESTS_PAGINATION"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RequestTableMobile from "../../components/companies/companies/mobile/RequestTableMobile.vue";
import RequestTable from "@/components/companies/companies/request/RequestTable";
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
import CompanyRequestSearchForm from "@/components/companies/forms/company-request-form/CompanyRequestSearchForm.vue";
export default {
  mixins: [TableContentMixin],
  name: "CompaniesRequests",
  components: {
    RequestTable,
    CompanyRequestSearchForm,
    RequestTableMobile,
  },
  inject: ["isMobile"],
  methods: {
    ...mapActions(["SEARCH_REQUESTS"]),
    async getContent() {
      await this.getRequests();
    },
    async getRequests() {
      this.loader = true;
      const query = this.$route.query;
      await this.SEARCH_REQUESTS({ query });
      this.loader = false;
    },
  },
  computed: {
    ...mapGetters(["REQUESTS", "REQUESTS_PAGINATION", "THIS_USER"]),
  },
};
</script>

<style>
</style>