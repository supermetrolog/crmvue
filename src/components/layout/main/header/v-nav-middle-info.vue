<template>
  <div class="col-lg-4 align-self-center">
    <CompanyDealForm v-if="dealFormVisible" @close="clickCloseDealForm" />
    <div class="row">
      <div class="col-4 ml-auto">
        <button class="btn btn-primary btn-large" @click="clickOpenDealForm">
          создать сделку
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyDealForm from "@/components/companies/forms/company-deal-form/CompanyDealForm";
export default {
  name: "v-nav-middle-info",
  components: {
    CompanyDealForm,
  },
  data() {
    return {
      dealFormVisible: false,
    };
  },
  methods: {
    clickOpenDealForm() {
      this.dealFormVisible = true;
    },
    clickCloseDealForm() {
      this.dealFormVisible = false;
    },
  },
};
</script>

<style>
</style>