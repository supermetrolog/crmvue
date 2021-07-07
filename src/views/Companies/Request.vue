<template>
  <h1>REQUEST</h1>
  <div class="row no-gutters">
    <div class="col-12">
      <CompanyList />
    </div>
  </div>
</template>

<script>
import CompanyList from "@/components/companies/companies/CompanyList.vue";
export default {
  name: "Request",
  components: {
    CompanyList,
  },
};
</script>

<style>
</style>