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
      <!-- Табы превью сделок -->
      <DealPreviewCard
        @choose="choseDeal"
        v-for="deal in deals"
        :key="deal.id"
        :deal="deal"
        :isCurrent="currentDealId === deal.id"
      />
    </div>
    <!-- Подробное описание и характеристики объекта -->
    <DealItem :object="object" :deal="currentDeal" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import DealItem from "./deal-item/ObjectHoldingDealItem.vue";
import DealPreviewCard from "../../ui/deal-preview/DealPreview.vue";
//import dealData from "./deal.data";
import "./styles.scss";
import { IDeal } from "./../../../../interfaces/deal.interface";
import IObject from "./../../../../interfaces/object.interface";

export default defineComponent({
  name: "ObjectDeals",
  components: {
    DealPreviewCard,
    DealItem,
  },
  props: {
    deals: {
      type: Array as PropType<IDeal[]>,
      //default: dealData,
      required:true
    },
		object: {
			type: Object as PropType<IObject>,
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
    choseDeal(id:number) {
      this.currentDealId = id;
    },
  },
});
</script>

<style lang="scss" scoped></style>
