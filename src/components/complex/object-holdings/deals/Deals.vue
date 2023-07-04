<template>
  <div class="ObjectDeals">
    <div class="ObjectDeals-actions">
      <p class="ObjectDeals-actions-label">Создать сделку:</p>
      <ul class="ObjectDeals-actions-list">
        <li class="ObjectDeals-actions-item">
          <button class="ObjectDeals-actions-button">аренда</button>
        </li>
        <li class="ObjectDeals-actions-item">
          <button class="ObjectDeals-actions-button">субаренда</button>
        </li>
        <li class="ObjectDeals-actions-item">
          <button class="ObjectDeals-actions-button">продажа</button>
        </li>
        <li class="ObjectDeals-actions-item">
          <button class="ObjectDeals-actions-button">
            ответ-хранение
          </button>
        </li>
      </ul>
    </div>
    <div class="ObjectDeals-list">
      <DealPreviewCard
        @choose="choseDeal"
        v-for="deal in deals"
        :key="deal.id"
        :deal="deal"
        :isCurrent="currentDealId === deal.id"
      />
    </div>
    <DealItem :object="object" :deal="currentDeal" />
  </div>
</template>

<script>
import DealItem from "./deal-item/ObjectHoldingDealItem.vue";
import DealPreviewCard from "../../ui/deal-preview/DealPreview.vue";
import dealData from "./deal.data";
import "./styles.scss";

export default {
  name: "ObjectDeals",
  components: {
    DealPreviewCard,
    DealItem,
  },
  props: {
    deals: {
      type: Array,
      default: dealData,
    },
		object: {
			type: Object,
			required: true
		}
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
