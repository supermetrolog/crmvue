<template>
    <div class="DealItem">
        <ComplexDealFloors :object="object" :floors="deal.floors"/>
        <ComplexDealInfo
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


import ComplexDealFloors from "@/components/Complex/Deal/ComplexDealFloors.vue";
import ComplexDealInfo from "@/components/Complex/Deal/ComplexDealInfo.vue";

export default {
    name: "ComplexDealItem",
    components: {ComplexDealInfo, ComplexDealFloors},
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
