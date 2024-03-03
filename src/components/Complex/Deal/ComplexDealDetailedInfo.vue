<template>
    <div class="deal-detailed-info">
        <ComplexDealBuilding class="deal-detailed-info__building-info" :deal="deal" />
        <ComplexOfferTabs
            :trade-offers="deal.blocks"
            class="deal-detailed-info__trade-offer-tabs"
        />
    </div>
</template>

<script>
import ComplexDealBuilding from '@/components/Complex/Deal/ComplexDealBuilding.vue';
import ComplexOfferTabs from '@/components/Complex/Offer/ComplexOfferTabs.vue';

export default {
    name: 'ComplexDealDetailedInfo',
    components: {
        ComplexOfferTabs,
        ComplexDealBuilding
    },
    props: {
        deal: {
            type: Object,
            required: true
        }
    }
};
</script>
