<template>
    <div class="deal-info">
        <ComplexDealInfoHeader :visited="deal.agent_visited" />
        <div class="deal-info__body">
            <div class="deal-info__content">
                <ComplexDealDetailedInfo :deal="deal" class="deal-info__detailed-info" />
            </div>
            <div class="deal-info__aside">
                <ComplexDealDetails :deal="deal" />
                <ComplexDealOwner v-if="deal.companyRecord" :owner="deal.companyRecord" />
            </div>
        </div>
    </div>
</template>

<script>
import ComplexDealDetailedInfo from '@/components/Complex/Deal/ComplexDealDetailedInfo.vue';
import ComplexDealInfoHeader from '@/components/Complex/Deal/ComplexDealInfoHeader.vue';
import ComplexDealDetails from '@/components/Complex/Deal/ComplexDealDetails.vue';
import ComplexDealOwner from '@/components/Complex/Deal/ComplexDealOwner.vue';

export default {
    name: 'ComplexDealInfo',
    components: {
        ComplexDealOwner,
        ComplexDealDetails,
        ComplexDealInfoHeader,
        ComplexDealDetailedInfo
    },
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    }
};
</script>
