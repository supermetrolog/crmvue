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
import "./styles.scss";

export default {
  name: "ObjectHoldingDeals",
  components: { DealPreviewCard, DealItem },
  props: {
    deals: {
      type: Array,
      default: () => [
        {
          id: 1,
          type: 1,
          company: { name: "ОАО Арахис Каприз Лук" },
          area: "32400 - 125000",
          price: { value: 1200, type: 8 },
          status: 1,
          floors: [
            {
              name: "Мезонин 2",
              area: 3000,
              checked: false,
              sections: [
                {
                  company: { name: "Объебос" },
                  area: 345,
                  status: 1,
                  checked: true,
                },
                {
                  company: { name: "Портос" },
                  area: 228,
                  status: 2,
                  checked: true,
                },
                {
                  company: { name: "Арамис" },
                  area: 1000,
                  status: 3,
                  checked: true,
                },
              ],
            },
            {
              name: "Мезонин 1",
              area: 3000,
              checked: false,
              sections: [
                {
                  company: { name: "Объебос" },
                  area: 345,
                  status: 1,
                  checked: true,
                },
                {
                  company: { name: "Портос" },
                  area: 228,
                  status: 2,
                  checked: true,
                },
                {
                  company: { name: "Арамис" },
                  area: 1000,
                  status: 3,
                  checked: true,
                },
              ],
            },
            {
              name: "1 этаж",
              area: 3000,
              checked: false,
              sections: [
                {
                  company: { name: "Объебос" },
                  area: 345,
                  status: 1,
                  checked: true,
                },
                {
                  company: { name: "Портос" },
                  area: 228,
                  status: 2,
                  checked: true,
                },
                {
                  company: { name: "Арамис" },
                  area: 1000,
                  status: 3,
                  checked: true,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          type: 2,
          company: {
            name: "ООО БелТрастИнвестТТТТТТТТТТТТТТТТТТТТТТТТТТТТТТТТ",
          },
          area: "12000",
          price: { value: 3500 },
          status: 2,
          floors: [
            {
              name: "Мезонин 1",
              area: 3000,
              checked: false,
              sections: [
                {
                  company: { name: "Объебос" },
                  area: 345,
                  status: 1,
                  checked: true,
                },
                {
                  company: { name: "Портос" },
                  area: 228,
                  status: 2,
                  checked: true,
                },
                {
                  company: { name: "Арамис" },
                  area: 1000,
                  status: 3,
                  checked: true,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          type: 1,
          company: null,
          area: "45500 - 100000",
          price: { value: null, type: 1 },
          status: 3,
          floors: [
            {
              name: "Мезонин 1",
              area: 3000,
              checked: false,
              sections: [
                {
                  company: { name: "Объебос" },
                  area: 345,
                  status: 1,
                  checked: true,
                },
                {
                  company: { name: "Портос" },
                  area: 228,
                  status: 2,
                  checked: true,
                },
                {
                  company: { name: "Арамис" },
                  area: 1000,
                  status: 3,
                  checked: true,
                },
              ],
            },
          ],
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
      return this.deals.find((deal) => deal.id === this.currentDealId);
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
