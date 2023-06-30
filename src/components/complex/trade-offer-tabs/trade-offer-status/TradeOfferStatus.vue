<template>
  <div class="trade-offer-status">
    <p
      class="trade-offer-status__text trade-offer-status__text_label"
      :class="{ 'trade-offer-status__text_color_red': status }"
    >
      {{ offerStatus }}
    </p>
    <p class="trade-offer-status__text">
      {{ offerCompany }}
    </p>
    <p class="trade-offer-status__text">
      {{ offerDate }}
    </p>
    <p class="trade-offer-status__text">
      {{ offerRealtor }}
    </p>
    <p class="trade-offer-status__text">
      {{ offerConsultant }}
    </p>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { ITradeOfferStatus } from "../tradeOfferTabs.interface";

export default defineComponent({
  name: "TradeOfferStatus",
  components: {},
  props: {
    status: {
      type: Object as PropType<ITradeOfferStatus>,
    },
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    offerStatus() {
      return this.status ? "Сделка завершена" : "Активная сделка";
    },
    offerCompany() {
      return this.status
        ? `${this.status.company.organization_type} ${this.status.company.name}`
        : "--";
    },
    offerDate() {
      return this.status
        ? this.$formatter.date().locale(this.status.date)
        : "--";
    },
    offerRealtor() {
      return this.status ? this.status.realtor : "--";
    },
    offerConsultant() {
      return this.status ? this.status.consultant : "--";
    },
  },
});
</script>

<style src="./TradeOfferStatus.scss" lang="scss"></style>
