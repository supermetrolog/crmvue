<template>
    <div class="deal-info">
        <ComplexDealInfoHeader :company="company" :consultant="consultant" />
        <!--        <div class="deal-info__body">-->
        <!--            <div class="deal-info__content">-->
        <!--                <ComplexDealInfoDetailed-->
        <!--                    class="deal-info__detailed-info"-->
        <!--                    :area="buildingInfo.area"-->
        <!--                    :price="buildingInfo.price"-->
        <!--                    :parameters="buildingInfo.parameters"-->
        <!--                />-->
        <!--            </div>-->
        <!--            <div class="deal-info__aside">-->
        <!--                <ComplexDealDetails-->
        <!--                    :label="additionalDetails.taxForm"-->
        <!--                    :exploitation="additionalDetails.exploitation"-->
        <!--                    :communal="additionalDetails.communal"-->
        <!--                    :extra-costs="additionalDetails.extraCosts"-->
        <!--                    :special-terms="additionalDetails.specialTerms"-->
        <!--                    :business="additionalDetails.business"-->
        <!--                />-->
        <!--                <ComplexDealOwner :owner="owner" />-->
        <!--            </div>-->
        <!--        </div>-->
    </div>
</template>

<script>
import ComplexDealInfoHeader from '@/components/Complex/Deal/ComplexDealInfoHeader.vue';

export default {
    name: 'ComplexDealInfo',
    components: {
        ComplexDealInfoHeader
    },
    props: {
        company: {
            type: Object
        },
        consultant: {
            type: Object
        },
        additionalDetails: {
            type: Object
        },
        buildingInfo: {
            type: Object
        },
        owner: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    }
};
</script>
