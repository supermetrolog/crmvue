<template>
  <teleport to="body">
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__zoomIn for__modal absolute"
      leave-active-class="animate__animated animate__zoomOut for__modal absolute"
    >
      <Modal
        title="Клонирование запроса "
        @close="clickCloseModal"
        v-if="clonedRequestItem"
        class="action-modal"
      >
        <div class="row no-gutters">
          <div class="col-12 text-center">
            <h4 class="text-dark">
              Вы уверены, что хотите клонировать этот запрос?
            </h4>
            <CompanyRequestItem
              :request="clonedRequestItem"
              :reedOnly="true"
              :withDeal="false"
            />
          </div>
          <div class="col-12 mt-4 text-center">
            <Loader class="center small" v-if="loader" />
            <button
              class="btn btn-success"
              :disabled="loader"
              @click="cloneRequest(clonedRequestItem)"
            >
              Клонировать
            </button>
            <button
              class="btn btn-primary ml-1"
              @click="clickCloseModal"
              :disabled="loader"
            >
              Нет
            </button>
          </div>
        </div>
      </Modal>
    </transition></teleport
  >
  <CompanyRequestDisableFormModal
    v-if="disabledRequestItem"
    :request_id="disabledRequestItem.id"
    @close="closeDisableForm"
    @disabled="onRequestIsDisabled"
  />
  <CompanyBoxLayout class="CompanyBoxRequests" :class="'grid-d'">
    <template #header>
      <div class="CompanyBoxRequests-header">
        <span
          >ЗАПРОСЫ ({{ requests.length }}), СДЕЛКИ ({{
            dealsCount + deals.length
          }})</span
        ><small class="edit_btn" @click="clickCreateRequest"> [создать]</small>
      </div>
    </template>
    <template #content>
      <CompanyBoxRequestsList
        :requests="requests"
        @clickUpdateRequest="openCompanyRequestFormForUpdate"
        @clickCloneRequest="clickCloneRequest"
        @clickDisableRequest="clickDisableRequest"
      />
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
import CompanyRequestDisableFormModal from "../../forms/company-request-form/CompanyRequestDisableFormModal.vue";
import { mapActions } from "vuex";
import CompanyRequestItem from "../../companies/request/CompanyRequestItem.vue";
import DealList from "../../companies/deal/DealList.vue";
import CompanyBoxRequestsList from "./CompanyBoxRequestsList.vue";
import NoData from "../../../common/NoData.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
import api from "@/api/api";
export default {
  name: "CompanyBoxRequests",
  components: {
    CompanyBoxLayout,
    NoData,
    CompanyBoxRequestsList,
    DealList,
    CompanyRequestItem,
    CompanyRequestDisableFormModal,
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      disabledRequestItem: null,
      clonedRequestItem: null,
      loader: false,
    };
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
    ...mapActions(["CREATE_REQUEST"]),
    openDealFormForUpdate(deal) {
      this.$emit("openDealFormForUpdate", deal);
    },
    dealDeleted() {
      this.$emit("dealDeleted");
    },
    clickCreateRequest() {
      this.$emit("clickCreateRequest");
    },
    openCompanyRequestFormForUpdate(request) {
      this.$emit("openCompanyRequestFormForUpdate", request);
    },
    clickCloseModal() {
      this.disabledRequestItem = null;
      this.clonedRequestItem = null;
    },
    async clickDisableRequest(request) {
      if (request.status == 0) {
        if (await api.request.undisable(request.id)) {
          this.onRequestIsDisabled();
        }
      } else {
        this.disabledRequestItem = request;
      }
    },
    closeDisableForm() {
      this.disabledRequestItem = null;
    },
    clickCloneRequest(request) {
      this.clonedRequestItem = request;
    },
    async cloneRequest(request) {
      this.loader = true;
      await this.CREATE_REQUEST(request);
      this.loader = false;
      this.clonedRequestItem = null;
      this.$emit("requestCloned");
    },
    onRequestIsDisabled() {
      this.disabledRequestItem = null;
      this.$emit("requestDisabled");
    },
  },
  mounted() {
    console.log("mounted");
  },
  emits: [
    "clickCreateRequest",
    "openCompanyRequestFormForUpdate",
    "requestCloned",
    "requestDisabled",
    "openDealFormForUpdate",
    "dealDeleted",
  ],
};
</script>