<template>
  <div class="deal-info">
    <deal-info-header :company="company" :consultant="consultant" />
    <div class="deal-info__body">
      <div class="deal-info__content">
        <!-- @ts-ignore  -->
        <deal-detailed-info
          class="deal-info__detailed-info"
          :area="buildingInfo.area"
          :price="buildingInfo.price"
          :parameters="buildingInfo.parameters"
        />
      </div>
      <div class="deal-info__aside">
        <!-- @ts-ignore  -->
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
import { IOwner }  from "../../../../interfaces/owner.interface";
import { IAdditionalDetails }  from "../../../../interfaces/additional_details.interface";
import { IConsultant }  from "../../../../interfaces/consultant.interface";
import { ICompany }  from "../../../../interfaces/company.interface";
import { IBuildingInfo }  from "../../../../interfaces/building_info.interface";

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
      type: Object as PropType<ICompany>,
    },
    consultant: {
      type: Object as PropType <IConsultant>,
    },
    additionalDetails: {
      type: Object as PropType<IAdditionalDetails>,
    },
    buildingInfo: {
      type: Object as PropType<IBuildingInfo>,
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
