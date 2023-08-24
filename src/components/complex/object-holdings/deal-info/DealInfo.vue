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
        <deal-owner :owner="owner" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import DealDetailedInfo from "./deal-detailed-info/DealDetailedInfo.vue";
import AdditionalDetails from "./deal-detailed-info/additional-detailes/AdditionalDetails.vue";
import DealOwner from "./deal-detailed-info/deal-owner/DealOwner.vue";
import DealInfoHeader from "./deal-info-header/DealInfoHeader.vue";
import { IOwner }  from "../../../../interfaces/deal.interface";


export default defineComponent({
  name: "DealInfo",
  components: {
    DealInfoHeader,
    DealDetailedInfo,
    AdditionalDetails,
    DealOwner,
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
    owner: {
      type: Object as PropType<IOwner>,
      required: true,
    },
  },
  data() {
    return {};
  },
});
</script>

<style lang="scss" src="./DealInfo.scss"></style>
