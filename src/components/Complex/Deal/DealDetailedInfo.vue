<template>
    <div class="deal-detailed-info">
        <ComplexDealBuilding
            class="deal-detailed-info__building-info"
            :area="area"
            :price="price"
            :parameters="parameters"
        />
        <trade-offer-tabs class="deal-detailed-info__trade-offer-tabs"/>
    </div>
</template>

<script>

import ComplexDealBuilding from "@/components/Complex/Deal/ComplexDealBuilding.vue";

export default {
    name: "ComplexDealInfoDetailed",
    components: {
        ComplexDealBuilding
    },
    props: {
        area: {
            type: Object,
        },
        price: {
            type: Object,
        },
        parameters: {
            type: Object,
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>