<template>
  <h1>ALL</h1>
  <!-- <Table /> -->
  <div class="row no-gutters">
    <div class="col-12">
      <!-- <Timeline /> -->
      <CompanyForm />
    </div>
  </div>
</template>

<script>
// import Table from "../components/companies/table/Table";
// import Timeline from "../../components/companies/timeline/Timeline";
import CompanyForm from "@/components/companies/forms/company-form/CompanyForm";
export default {
  name: "All",
  components: {
    // Table,
    // Timeline,
    CompanyForm,
  },
};
</script>

<style>
</style>