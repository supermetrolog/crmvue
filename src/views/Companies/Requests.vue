<template>
  <div class="companies-requests">
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
        <RequestTable :loader="loader" :requests="REQUESTS" />
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
import RequestTable from "@/components/companies/companies/request/RequestTable";
import { mapGetters, mapActions } from "vuex";
import { TableContentMixin } from "@/components/common/mixins.js";
export default {
  mixins: [TableContentMixin],
  name: "CompaniesRequests",
  components: {
    RequestTable,
  },
  methods: {
    ...mapActions(["SEARCH_REQUESTS"]),
    async getContent() {
      await this.getRequests();
    },
    async getRequests() {
      this.loader = true;
      const query = this.$route.query;
      await this.SEARCH_REQUESTS({ query });
      console.error(this.REQUESTS);
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