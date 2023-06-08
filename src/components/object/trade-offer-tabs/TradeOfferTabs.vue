<template>
  <div class="trade-offer-tabs">
    <Tabs
      :options="{ useUrlFragment: false }"
      nav-class="trade-offer-tabs__list"
      nav-item-link-class="trade-offer-tabs__link"
    >
      <Tab :name="`Активных ТП (${activeOffers.length} шт.)`">
        <div class="trade-offer-tabs__tab-body">
          <trade-offer-item
            v-for="tradeOffer in activeOffers"
            :key="tradeOffer.id"
            :area="tradeOffer.area"
            :price="tradeOffer.price"
            :id="tradeOffer.id"
            :lastUpdate="tradeOffer.lastUpdate"
            :status="tradeOffer.status"
            :parameters="tradeOffer.parameters"
          />
        </div>
      </Tab>
      <Tab :name="`Архив (${archiveOffers.length}  шт.)`">
        <div
          class="trade-offer-tabs__tab-body trade-offer-tabs__tab-body_opacity"
        >
          <trade-offer-item
            v-for="tradeOffer in archiveOffers"
            :key="tradeOffer.id"
            :area="tradeOffer.area"
            :price="tradeOffer.price"
            :id="tradeOffer.id"
            :lastUpdate="tradeOffer.lastUpdate"
            :status="tradeOffer.status"
            :parameters="tradeOffer.parameters"
          />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TradeOfferItem from "./trade-offer-item/TradeOfferItem.vue";
import { ITradeOffer, ITradeOfferTabs } from "./tradeOfferTabs.interface";
import data from "./trade-offer.data";

export default defineComponent({
  name: "TradeOfferTabs",
  props: {},
  components: { TradeOfferItem },
  data(): ITradeOfferTabs {
    return {
      tradeOffers: data,
    };
  },
  computed: {
    activeOffers(): ITradeOffer[] {
      return this.tradeOffers.filter((offer) => offer.active);
    },
    archiveOffers(): ITradeOffer[] {
      return this.tradeOffers.filter((offer) => !offer.active);
    },
  },
});
</script>

<style lang="scss" src="./TradeOfferTabs.scss" />
