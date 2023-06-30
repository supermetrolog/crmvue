<template>
  <div class="ObjectHoldingDeals">
    <div class="ObjectHoldingDeals-actions">
      <p class="ObjectHoldingDeals-actions-label">Создать сделку:</p>
      <ul class="ObjectHoldingDeals-actions-list">
        <li class="ObjectHoldingDeals-actions-item">
          <button class="ObjectHoldingDeals-actions-button">аренда</button>
        </li>
        <li class="ObjectHoldingDeals-actions-item">
          <button class="ObjectHoldingDeals-actions-button">субаренда</button>
        </li>
        <li class="ObjectHoldingDeals-actions-item">
          <button class="ObjectHoldingDeals-actions-button">продажа</button>
        </li>
        <li class="ObjectHoldingDeals-actions-item">
          <button class="ObjectHoldingDeals-actions-button">
            ответ-хранение
          </button>
        </li>
      </ul>
    </div>
    <div class="ObjectHoldingDeals-list">
      <DealPreviewCard
        @choose="choseDeal"
        v-for="deal in deals"
        :key="deal.id"
        :deal="deal"
        :isCurrent="currentDealId === deal.id"
      />
    </div>
    <DealItem :deal="currentDeal" />
  </div>
</template>

<script>
import DealItem from "./deal-item/ObjectHoldingDealItem.vue";
import DealPreviewCard from "../../ui/deal-preview/DealPreview.vue";
import dealData from "./deal.data";
import "./styles.scss";

export default {
  name: "ObjectHoldingDeals",
  components: {
    DealPreviewCard,
    DealItem,
  },
  props: {
    deals: {
      type: Array,
      default: dealData,
    },
  },
  data() {
    return {
      currentDealId: this.deals[0].id,
    };
  },
  computed: {
    currentDeal() {
      return this.deals.find((deal) => deal.id === this.currentDealId);
    },
  },
  methods: {
    choseDeal(id) {
      this.currentDealId = id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
