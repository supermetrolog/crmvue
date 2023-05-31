<template>
  <div class="trade-offer-item">
    <div class="trade-offer-item__line">
      <div class="trade-offer-item__tables">
        <trade-offer-table
          subtitle="S - складская"
          :title="area.sum"
          :propertyList="area.properties"
          type="area"
          class="trade-offer-item__table"
        />
        <trade-offer-table
          subtitle="E - пола средняя"
          :title="price.sum"
          :propertyList="price.properties"
          type="price"
          class="trade-offer-item__table"
        />
      </div>
      <div class="trade-offer-item__info">
        <p class="trade-offer-item__text">
          ID {{ id }},
          <span
            class="trade-offer-item__text_color_grey"
            title="последнее обновление"
          >
            <i class="fas fa-undo-alt" />
            {{ lastUpdate }}
          </span>
        </p>
        <trade-offer-status
          class="trade-offer-item__status"
          :status="tradeOfferStatus"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TradeOfferTable from "../trade-offer-table/TradeOfferTable.vue";
import TradeOfferStatus from "../trade-offer-status/TradeOfferStatus.vue";

export default {
  name: "TradeOfferItem",
  components: {
    TradeOfferTable,
    TradeOfferStatus,
  },
  props: {
    area: {
      type: Object,
      required: true,
    },
    price: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    lastUpdate: {
      type: String,
      required: true,
    },
    status: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    tradeOfferStatus() {
      return {
        company: `${this.status.company.organization_type} ${this.status.company.name}`,
        date: this.status.date,
        realtor: this.status.realtor,
        consultant: this.status.consultant,
      };
    },
  },
  methods: {},
};
</script>

<style src="./TradeOfferItem.scss" lang="scss"></style>
