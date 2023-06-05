<template>
  <div class="trade-offer-item">
    <div class="trade-offer-item__line">
      <div class="trade-offer-item__tables">
        <trade-offer-table
          subtitle="S - складская"
          :title="areaTableTitle"
          :titleUnitType="unitTypes.SQUARE_METERS"
          :propertyList="area.properties"
          :propertyUnitType="unitTypes.SQUARE_METERS"
          type="area"
          class="trade-offer-item__table"
        />
        <trade-offer-table
          subtitle="E - пола средняя"
          :title="priceTableTitle"
          :titleUnitType="unitTypes.RUB"
          :propertyList="price.properties"
          :propertyUnitType="unitTypes.SQUARE_METERS_PER_YEAR"
          :additionalUnit="unitTypes.RUB"
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
            {{ formattedLastUpdate }}
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
import { unitTypes } from "@/const/unitTypes";

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
      type: Date,
      required: true,
    },
    status: {
      type: Object,
    },
  },
  data() {
    return {
      unitTypes,
    };
  },
  computed: {
    tradeOfferStatus() {
      return this.status
        ? {
            company: `${this.status.company.organization_type} ${this.status.company.name}`,
            date: this.$formatter.date().locale(this.status.date),
            realtor: this.status.realtor,
            consultant: this.status.consultant,
          }
        : undefined;
    },
    areaTableTitle() {
      return this.$formatter.numberOrRangeNew(
        this.area.sum.valueMin,
        this.area.sum.valueMax
      );
    },
    priceTableTitle() {
      return this.$formatter.numberOrRangeNew(
        this.price.sum.valueMin,
        this.price.sum.valueMax
      );
    },
    formattedLastUpdate() {
      return this.$formatter.date().locale(this.lastUpdate);
    },
  },
  methods: {},
};
</script>

<style src="./TradeOfferItem.scss" lang="scss"></style>
