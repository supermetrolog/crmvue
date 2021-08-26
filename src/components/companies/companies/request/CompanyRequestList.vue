<template>
  <div class="company-request-list">
    <Modal
      title="Удаление запроса "
      @close="clickCloseModal"
      v-if="deletedRequestItem"
    >
      <div class="row no-gutters">
        <div class="col-12 text-center">
          <h4 class="text-danger">
            Вы уверены что хотите удалить запрос
            <span class="text-success"
              >"{{ deletedRequestItem.header }}м<sup><small>2</small></sup
              >"</span
            >
            ?
          </h4>
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
    <div class="row mb-4">
      <div class="col-12 text-center">
        <h4>Запросы (3) - Сделки (2)</h4>
      </div>
    </div>
    <CompanyRequestItem
      v-for="request of requests"
      :key="request.id"
      :request="request"
      @openCompanyRequestFormForUpdate="openCompanyRequestFormForUpdate"
      @deleteRequest="clickdDeleteRequest"
    />
  </div>
</template>

<script>
import CompanyRequestItem from "./CompanyRequestItem.vue";
import { mapActions } from "vuex";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
export default {
  name: "CompanyRequestList",
  components: {
    CompanyRequestItem,
    Modal,
    Loader,
  },
  data() {
    return {
      deletedRequestItem: null,
      deleteLoader: false,
    };
  },
  props: {
    requests: {
      type: Array,
    },
  },
  methods: {
    ...mapActions(["DELETE_REQUEST"]),
    openCompanyRequestFormForUpdate(request) {
      this.$emit("openCompanyRequestFormForUpdate", request);
    },
    clickCloseModal() {
      this.deletedRequestItem = null;
    },
    clickdDeleteRequest(request) {
      this.deletedRequestItem = request;
    },
    async deleteRequest(request) {
      this.deleteLoader = true;
      await this.DELETE_REQUEST(request);
      this.deleteLoader = false;
      this.deletedRequestItem = null;
    },
  },
  emits: ["openCompanyRequestFormForUpdate"],
};
</script>

<style>
</style>