<template>
  <div class="company-request-list">
    <div class="row mb-4">
      <div class="col-12 text-center">
        <h4>Запросы (3) - Сделки (2)</h4>
      </div>
    </div>
    <CompanyRequestItem
      v-for="request of requests"
      :key="request.id"
      :request="request"
    />
  </div>
</template>

<script>
import CompanyRequestItem from "./CompanyRequestItem.vue";
export default {
  name: "CompanyRequestList",
  components: {
    CompanyRequestItem,
  },
  props: {
    requests: {
      type: Array,
    },
  },
};
</script>

<style>
</style>