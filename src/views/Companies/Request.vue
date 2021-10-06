<template>
  <h1>REQUEST</h1>
  <div class="row no-gutters">
    <div class="col-12">
      <CompanyGridView />
    </div>
  </div>
</template>

<script>
import CompanyGridView from "@/components/companies/companies/CompanyGridView.vue";
export default {
  name: "Request",
  components: {
    CompanyGridView,
  },
};
</script>

<style>
</style>