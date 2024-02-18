<template>
    <div class="deal-detailed-info">
        <ComplexDealBuilding
            class="deal-detailed-info__building-info"
            :area="area"
            :price="price"
            :parameters="parameters"
        />
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
    provide() {
        return {
            dealType: this.deal.dealTypeRecord,
            dealTypeShort: this.deal.dealTypeRecord.title[0]
        };
    },
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {
        area() {
            return {
                min: this.deal.calculated_area_min,
                max: this.deal.calculated_area_max
            };
        },
        price() {
            return {
                min: this.deal.calculated_price_min,
                max: this.deal.calculated_price_max
            };
        },
        parameters() {
            return [];
        }
    },
    methods: {}
};
</script>
