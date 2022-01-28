<template>
  <div class="company-request-list fuck">
    <Modal
      title="Удаление запроса "
      @close="clickCloseModal"
      v-if="deletedRequestItem"
    >
      <div class="row no-gutters">
        <div class="col-12 text-center">
          <h4 class="text-dark">
            Вы уверены что хотите удалить запрос
            <span class="text-grey"
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
    <Modal
      title="Клонирование запроса "
      @close="clickCloseModal"
      v-if="clonedRequestItem"
    >
      <div class="row no-gutters">
        <div class="col-12 text-center">
          <h4 class="text-dark">
            Вы уверены что хотите клонировать запрос
            <span class="text-grey"
              >"{{ clonedRequestItem.header }}м<sup><small>2</small></sup
              >"</span
            >
            ?
          </h4>
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
    <div class="row mb-2" v-if="requests.length">
      <div class="col-12 p-0">
        <div class="row no-gutters">
          <div class="col-6 pr-2">
            <div class="row no-gutters">
              <div class="col-6"><p>Запросы</p></div>
              <div class="col-6 text-right">
                <p>{{ requests.length }}</p>
              </div>
            </div>
          </div>
          <div class="col-6 pl-2">
            <div class="row no-gutters">
              <div class="col-6"><p>Сделки</p></div>
              <div class="col-6 text-right"><p>1</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CompanyRequestItem
      v-for="request of requests"
      :key="request.id"
      :request="request"
      @openCompanyRequestFormForUpdate="openCompanyRequestFormForUpdate"
      @deleteRequest="clickDeleteRequest"
      @cloneRequest="clickCloneRequest"
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
      clonedRequestItem: null,
      cloneLoader: false,
    };
  },
  props: {
    requests: {
      type: Array,
    },
  },
  methods: {
    ...mapActions(["DELETE_REQUEST", "CREATE_REQUEST"]),
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
      this.$emit("cloned");
    },
    async deleteRequest(request) {
      this.deleteLoader = true;
      await this.DELETE_REQUEST(request);
      this.deleteLoader = false;
      this.deletedRequestItem = null;
    },
  },
  emits: ["openCompanyRequestFormForUpdate", "cloned"],
};
</script>

<style>
</style>