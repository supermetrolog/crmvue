<template>
  <transition
    mode="out-in"
    enter-active-class="animate__animated animate__zoomIn for__modal absolute"
    leave-active-class="animate__animated animate__zoomOut for__modal absolute"
  >
    <Modal
      title="Удаление запроса "
      @close="clickCloseModal"
      v-if="deletedRequestItem"
      class="action-modal"
    >
      <div class="row no-gutters">
        <div class="col-12 text-center">
          <h4 class="text-dark">Вы уверены что хотите удалить запрос?</h4>
          <CompanyRequestItem :request="deletedRequestItem" :reedOnly="true" />
        </div>
        <div class="col-12 mt-4 text-center">
          <Loader class="center small" v-if="deleteLoader" />
          <button
            class="btn btn-danger"
            :disabled="deleteLoader"
            @click="deleteRequest(deletedRequestItem)"
          >
            Удалить
          </button>
          <button
            class="btn btn-primary ml-1"
            @click="clickCloseModal"
            :disabled="deleteLoader"
          >
            Нет
          </button>
        </div>
      </div>
    </Modal>
  </transition>
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
          <Loader class="center small" v-if="cloneLoader" />
          <button
            class="btn btn-success"
            :disabled="cloneLoader"
            @click="cloneRequest(clonedRequestItem)"
          >
            Клонировать
          </button>
          <button
            class="btn btn-primary ml-1"
            @click="clickCloseModal"
            :disabled="cloneLoader"
          >
            Нет
          </button>
        </div>
      </div>
    </Modal>
  </transition>
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
        @clickDeleteRequest="clickDeleteRequest"
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
import { mapActions } from "vuex";
import Loader from "../../../common/Loader.vue";
import CompanyRequestItem from "../../companies/request/CompanyRequestItem.vue";
import Modal from "../../../common/Modal.vue";
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
    Modal,
    CompanyRequestItem,
    Loader,
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
  data() {
    return {
      deletedRequestItem: null,
      clonedRequestItem: null,
      cloneLoader: false,
      deleteLoader: false,
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
    ...mapActions(["DELETE_REQUEST", "CREATE_REQUEST"]),
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
      this.deletedRequestItem = null;
      this.clonedRequestItem = null;
    },
    clickDeleteRequest(request) {
      this.deletedRequestItem = request;
    },
    clickCloneRequest(request) {
      this.clonedRequestItem = request;
    },
    async cloneRequest(request) {
      this.cloneLoader = true;
      await this.CREATE_REQUEST(request);
      this.cloneLoader = false;
      this.clonedRequestItem = null;
      this.$emit("requestCloned");
    },
    async deleteRequest(request) {
      this.deleteLoader = true;
      await this.DELETE_REQUEST(request);
      this.deleteLoader = false;
      this.deletedRequestItem = null;
    },
  },
  emits: [
    "clickCreateRequest",
    "openCompanyRequestFormForUpdate",
    "requestCloned",
    "openDealFormForUpdate",
    "dealDeleted",
  ],
};
</script>