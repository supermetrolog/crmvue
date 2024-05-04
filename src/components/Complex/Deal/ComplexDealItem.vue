<template>
    <div class="DealItem">
        <ComplexDealFloors :floors="floors" :object="object" />
        <ComplexDealInfo :deal="deal" />
    </div>
</template>

<script>
import ComplexDealFloors from '@/components/Complex/Deal/ComplexDealFloors.vue';
import ComplexDealInfo from '@/components/Complex/Deal/ComplexDealInfo.vue';

export default {
    name: 'ComplexDealItem',
    components: { ComplexDealInfo, ComplexDealFloors },
    provide() {
        return {
            dealFloors: this.floors
        };
    },
    props: {
        floors: {
            type: Array,
            default: () => []
        },
        object: {
            type: Object,
            default: null
        },
        deal: {
            type: Object,
            default: null
        }
    }
};
</script>
