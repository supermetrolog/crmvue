<template>
  <div class="trade-offer">
    <div class="trade-offer__line">
      <div class="trade-offer__tables">
        <trade-offer-table
          subtitle="S - складская"
          :title="data.area.sum"
          :propertyList="data.area.properties"
          type="area"
          class="trade-offer__table"
        />
        <trade-offer-table
          subtitle="E - пола средняя"
          :title="data.price.sum"
          :propertyList="data.price.properties"
          type="price"
          class="trade-offer__table"
        />
      </div>
      <div class="trade-offer__info">
        <p class="trade-offer__text">
          ID {{ data.id }},
          <span
            class="trade-offer__text_color_grey"
            title="последнее обновление"
          >
            <i class="fas fa-undo-alt" />
            {{ data.lastUpdate }}
          </span>
        </p>
        <trade-offer-status class="trade-offer__status" :status="status" />
      </div>
    </div>
  </div>
</template>

<script>
import TradeOfferTable from "./trade-offer-table/TradeOfferTable.vue";
import TradeOfferStatus from "./trade-offer-status/TradeOfferStatus.vue";
import data from "./trade-offer.json";

export default {
  name: "TradeOffer",
  components: {
    TradeOfferTable,
    TradeOfferStatus,
  },
  props: {},
  data() {
    return {
      data,
    };
  },
  computed: {
    status() {
      return {
        company: `${this.data.status.company.organization_type} ${this.data.status.company.name}`,
        date: data.status.date,
        realtor: data.status.realtor,
        consultant: data.status.consultant,
      };
    },
  },
  methods: {},
};
</script>

<style src="./TradeOffer.scss" lang="scss"></style>
