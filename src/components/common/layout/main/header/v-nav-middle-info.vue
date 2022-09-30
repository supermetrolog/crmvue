<template>
  <div class="col-lg-4 align-self-center">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <CompanyDealForm v-if="dealFormVisible" @close="clickCloseDealForm" />
      </transition>
    </teleport>
    <div class="row">
      <div class="col-md-4 col-8 ml-auto">
        <button class="btn btn-primary btn-large" @click="clickOpenDealForm">
          создать сделку
          <i class="fas fa-bolt ml-2"></i>
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