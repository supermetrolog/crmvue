<template>
  <div class="offer-tabs">
    <Tabs
      :options="{ useUrlFragment: false }"
      nav-class="offers-tabs__list"
      nav-item-link-class="offers-tabs__link"
    >
      <Tab name="Сводка">
        <div class="offers-tabs__tab-body"></div>
      </Tab>
      <Tab name="Подробно">
        <div class="offers-tabs__tab-body">
          <trade-offer-details-table
            :blocks="parameters.blocks"
            class="offers-tabs__offer-details"
          />
        </div>
      </Tab>
      <Tab name="Описание">
        <div class="offers-tabs__tab-body"></div>
      </Tab>
      <Tab name="Фото">
        <div class="offers-tabs__tab-body"></div>
      </Tab>
      <Tab name="Клиенты">
        <div class="offers-tabs__tab-body"></div>
      </Tab>
      <Tab name="Задачи">
        <div class="offers-tabs__tab-body"></div>
      </Tab>
      <Tab name="Парам. Сделки">
        <div class="offers-tabs__tab-body"></div>
      </Tab>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { ITradeOfferCharacteristics } from "@/const/tradeOfferCharacteristics";
import TradeOfferDetailsTable from "../../trade-offer-details-table/TradeOfferDetailsTable.vue";
import { PropType, defineComponent } from "vue";

export default defineComponent({
  name: "OfferTabs",
  components: {
    TradeOfferDetailsTable,
  },
  props: {
    parameters: {
      type: Object as PropType<ITradeOfferCharacteristics>,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>
<style lang="scss" src="./OfferTabs.scss" />
