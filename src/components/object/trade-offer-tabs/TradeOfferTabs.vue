<template>
  <div class="trade-offer-tabs">
    <Tabs :options="{ useUrlFragment: false }">
      <Tab name="Активные">
        <div class="trade-offer-tabs__tab-body">
          <trade-offer-item
            :area="data.area"
            :price="data.price"
            :id="data.id"
            :lastUpdate="data.lastUpdate"
            :status="data.status"
          />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TradeOfferItem from "./trade-offer-item/TradeOfferItem.vue";
import data from "./trade-offer.json";

export default defineComponent({
  name: "TradeOfferTabs",
  props: {},
  components: { TradeOfferItem },
  data() {
    return {
      data,
    };
  },
});
</script>

<style lang="scss" src="./TradeOfferTabs.scss" />
