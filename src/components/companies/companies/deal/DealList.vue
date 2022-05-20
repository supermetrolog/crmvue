<template>
  <div class="deal-list">
    <Modal
      title="Удаление сделки "
      @close="clickCloseModal"
      v-if="deletedDealItem"
      class="action-modal autosize"
    >
      <div class="row no-gutters">
        <div class="col-12 text-center">
          <h4 class="text-dark">Вы уверены что хотите удалить сделку?</h4>
          <DealItem :deal="deletedDealItem" :reedOnly="true" />
        </div>
        <div class="col-12 mt-4 text-center">
          <Loader class="center small" v-if="deleteLoader" />
          <button
            class="btn btn-danger"
            :disabled="deleteLoader"
            @click="deleteDeal(deletedDealItem)"
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
    <hr />
    <div class="row mb-2" v-if="deals.length">
      <div class="col-12 text-center">
        <p>Сделки без запроса - {{ deals.length }}</p>
      </div>
    </div>
    <DealItem
      class="mb-2 mt-1"
      v-for="deal in deals"
      :key="deal.id"
      :deal="deal"
      @openDealFormForUpdate="openDealFormForUpdate"
      @deleteDeal="clickDeleteDeal"
    />
  </div>
</template>

<script>
import DealItem from "@/components/companies/companies/deal/DealItem.vue";
import { mapActions } from "vuex";
export default {
  name: "DealList",
  components: {
    DealItem,
  },
  data() {
    return {
      deletedDealItem: null,
      deleteLoader: false,
    };
  },
  props: {
    deals: {
      type: Array,
    },
  },
  methods: {
    ...mapActions(["DELETE_DEAL"]),
    openDealFormForUpdate(deal) {
      this.$emit("openDealFormForUpdate", deal);
    },
    clickCloseModal() {
      this.deletedDealItem = null;
    },
    clickDeleteDeal(deal) {
      this.deletedDealItem = deal;
    },
    async deleteDeal(deal) {
      this.deleteLoader = true;
      await this.DELETE_DEAL(deal);
      this.deleteLoader = false;
      this.deletedDealItem = null;
      this.$emit("deleted");
    },
  },
};
</script>

<style>
</style>