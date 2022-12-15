<template>
  <CompanyBoxLayout class="CompanyBoxRequests" :class="'grid-d'">
    <template #header>
      <div class="CompanyBoxRequests-header">
        <span>ЗАПРОСЫ ({{ requests.length }}), СДЕЛКИ (ХЗ)</span>
      </div>
    </template>
    <template #content>
      <CompanyBoxRequestsList :requests="requests" />
      <NoData v-if="!requests.length" />
    </template>
  </CompanyBoxLayout>
</template>

<script>
import CompanyBoxRequestsList from "./CompanyBoxRequestsList.vue";
import NoData from "../../../common/NoData.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
export default {
  name: "CompanyBoxRequests",
  components: { CompanyBoxLayout, NoData, CompanyBoxRequestsList },
  props: {
    requests: {
      type: Array,
      default: () => [{}],
    },
  },
};
</script>