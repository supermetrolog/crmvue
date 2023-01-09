<template>
  <CompanyBoxLayout class="CompanyBoxRequests" :class="'grid-d'">
    <template #header>
      <div class="CompanyBoxRequests-header">
        <span
          >ЗАПРОСЫ ({{ requests.length }}), СДЕЛКИ ({{
            dealsCount + deals.length
          }})</span
        >
      </div>
    </template>
    <template #content>
      <CompanyBoxRequestsList :requests="requests" />
      <template v-if="deals.length">
        <DealList
          :deals="deals"
          @openDealFormForUpdate="openDealFormForUpdate"
          @deleted="dealDeleted"
        />
      </template>
      <NoData v-if="!requests.length" />
    </template>
  </CompanyBoxLayout>
</template>

<script>
import DealList from "../../companies/deal/DealList.vue";
import CompanyBoxRequestsList from "./CompanyBoxRequestsList.vue";
import NoData from "../../../common/NoData.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
export default {
  name: "CompanyBoxRequests",
  components: {
    CompanyBoxLayout,
    NoData,
    CompanyBoxRequestsList,
    DealList,
  },
  props: {
    requests: {
      type: Array,
      default: () => [],
    },
    deals: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    dealsCount() {
      const requestsWithDeal = this.requests.filter(
        (item) => item.deal != null
      );
      if (Array.isArray(requestsWithDeal)) {
        return requestsWithDeal.length;
      }
      return 0;
    },
  },
  methods: {
    openDealFormForUpdate(deal) {
      this.$emit("openDealFormForUpdate", deal);
    },
    dealDeleted() {
      this.$emit("dealDeleted");
    },
  },
};
</script>