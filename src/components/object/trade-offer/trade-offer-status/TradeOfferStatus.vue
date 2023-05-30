<template>
  <div class="trade-offer-status">
    <p class="trade-offer-status__text trade-offer-status__text_color_red">
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

<script>
export default {
  name: "TradeOfferStatus",
  components: {},
  props: {
    status: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {},
  computer: {
    offerStatus() {
      return this.status ? "Сделка завершена" : "Активная сделка";
    },
    offerCompany() {
      return this.status.company || "--";
    },
    offerDate() {
      return this.status.date || "--";
    },
    offerRealtor() {
      return this.status.realtor || "--";
    },
    offerConsultant() {
      return this.status.consultant || "--";
    },
  },
};
</script>

<style src="./TradeOfferStatus.scss" lang="scss"></style>
