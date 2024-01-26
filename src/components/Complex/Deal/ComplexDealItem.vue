<template>
    <div class="DealItem">
        <ComplexDealFloors :floors="floors" :object="object" />
        <!--        <ComplexDealInfo-->
        <!--            v-if="deal.additionalDetails"-->
        <!--            :company="deal.builder"-->
        <!--            :consultant="deal.consultant"-->
        <!--            :additional-details="deal.additionalDetails"-->
        <!--            :building-info="deal.buildingInfo"-->
        <!--            :owner="deal.owner"-->
        <!--        />-->
    </div>
</template>

<script>
import ComplexDealFloors from '@/components/Complex/Deal/ComplexDealFloors.vue';

export default {
    name: 'ComplexDealItem',
    components: { ComplexDealFloors },
    props: {
        floors: {
            type: Array,
            default: () => []
        },
        object: {
            type: Object,
            default: null
        }
    }
};
</script>
