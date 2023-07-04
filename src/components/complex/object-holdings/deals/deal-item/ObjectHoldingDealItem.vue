<template>
  <div class="DealItem">
    <DealFloors :object="object" :floors="deal.floors" />
    <deal-info
      v-if="deal.additionalDetails"
      :company="deal.builder"
      :consultant="deal.consultant"
      :additionalDetails="deal.additionalDetails"
      :buildingInfo="deal.buildingInfo"
      :owner="deal.owner"
    />
  </div>
</template>

<script>
import DealFloors from "./floors/DealFloors.vue";
import DealInfo from "../../deal-info/DealInfo.vue";
// import "./styles.scss";

export default {
  name: "DealItem",
  components: {
    DealFloors,
    DealInfo,
  },
  props: {
    deal: {
      type: Object,
      required: true,
    },
		object: {
			type: Object,
			required: true,
		}
  },
};
</script>
