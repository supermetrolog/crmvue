<template>
  <div class="deal-info">
    <deal-info-header :company="company" :consultant="consultant" />
    <div class="deal-info__body">
      <div class="deal-info__content">
        <deal-detailed-info
          class="deal-info__detailed-info"
          :area="buildingInfo.area"
          :price="buildingInfo.price"
          :parameters="buildingInfo.parameters"
        />
      </div>
      <div class="deal-info__aside">
        <additional-details
          :label="additionalDetails.taxForm"
          :exploitation="additionalDetails.exploitation"
          :communal="additionalDetails.communal"
          :extraCosts="additionalDetails.extraCosts"
          :specialTerms="additionalDetails.specialTerms"
          :business="additionalDetails.business"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DealDetailedInfo from "./deal-detailed-info/DealDetailedInfo.vue";
import AdditionalDetails from "./deal-detailed-info/additional-detailes/AdditionalDetails.vue";
import DealInfoHeader from "./deal-info-header/DealInfoHeader.vue";

export default {
  name: "DealInfo",
  components: {
    DealInfoHeader,
    DealDetailedInfo,
    AdditionalDetails,
  },
  props: {
    company: {
      type: Object,
    },
    consultant: {
      type: Object,
    },
    additionalDetails: {
      type: Object,
    },
    buildingInfo: {
      type: Object,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" src="./DealInfo.scss"></style>
