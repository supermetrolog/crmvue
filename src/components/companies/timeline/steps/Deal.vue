<template>
  <div class="col mb-2">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <CompanyDealForm
          v-if="data && dealFormVisible"
          :formdata="currentRequest.deal"
          :company_id="currentRequest.company_id"
          :request_id="currentRequest.id"
          :dealType="currentRequest.dealType"
          :object_id="data.timelineStepObjects[0].object_id"
          :complex_id="data.timelineStepObjects[0].complex_id"
          :type_id="data.timelineStepObjects[0].type_id"
          :isOurDeal="true"
          @close="clickCloseDealForm"
          @created="updateItem"
          @updated="updateItem"
        />
      </transition>
    </teleport>
    <Loader class="center" v-if="loader" />
    <div class="row">
      <div class="col-3 mx-auto">
        <button
          class="btn btn-primary btn-large"
          @click="clickOpenDealForm"
          :disabled="disabled"
        >
          {{ !currentRequest.deal ? "Создать сделку" : "Редактировать сделку" }}
        </button>
      </div>
    </div>
    <div class="row mt-3" v-if="currentRequest.deal">
      <div class="col-6 mx-auto">
        <DealItem :deal="currentRequest.deal" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { MixinSteps } from "../mixins";
import CompanyDealForm from "@/components/companies/forms/company-deal-form/CompanyDealForm";
import DealItem from "@/components/companies/companies/deal/DealItem";
export default {
  name: "Deal",
  mixins: [MixinSteps],
  components: {
    CompanyDealForm,
    DealItem,
  },
  data() {
    return {
      loader: this.loaderForStep,
      dealFormVisible: false,
    };
  },
  props: {
    request_id: {
      type: Number,
    },
    loaderForStep: {
      type: [Number, Boolean],
    },
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST", "COMPANY_REQUESTS"]),
    currentRequest() {
      return this.COMPANY_REQUESTS.find((item) => item.id == this.request_id);
    },
  },
  methods: {
    ...mapActions(["FETCH_COMPANY_REQUESTS"]),
    clickOpenDealForm() {
      this.dealFormVisible = true;
    },
    clickCloseDealForm() {
      this.dealFormVisible = false;
    },
    updateItem(form) {
      this.data.deal = form;
      this.$emit("updateItem", this.data, false, () => {
        this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
      });
    },
  },
  async mounted() {},
  watch: {
    loaderForStep() {
      this.loader = this.loaderForStep;
    },
  },
};
</script>

<style>
</style>