<template>
  <div class="ObjectHoldingDeals">
    <div class="ObjectHoldingDeals-actions">
      <button>
        <span>Создать сделку</span>
      </button>
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
  </div>
</template>

<script>
import DealPreviewCard from "../../ui/deal-preview/DealPreview.vue";
import "./styles.scss";

export default {
  name: "ObjectHoldingDeals",
  components: { DealPreviewCard },
  props: {
    deals: {
      type: Array,
      default: () => [
        {
          id: 1,
          type: 1,
          company: { name: "Арахис Каприз Лук 123" },
          area: 12000,
          price: { count: 1200, type: 1 },
          status: 1,
        },
        {
          id: 2,
          type: 2,
          company: { name: "ЦСКа гавно Спартак гавно" },
          area: 12000,
          price: { count: 1200, type: 1 },
          status: 2,
        },
        {
          id: 3,
          type: 1,
          company: null,
          area: 12000,
          price: { count: null, type: 1 },
          status: 3,
        },
      ],
    },
  },
  data() {
    return {
      currentDealId: this.deals[0].id,
    };
  },
  computed: {
    currentDeal() {
      return this.deals.find((deal) => deal.id === this.currentDeal);
    },
  },
  methods: {
    choseDeal(id) {
      console.log(id);
      this.currentDealId = id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
