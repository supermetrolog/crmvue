<template>
    <div class="trade-offer-table">
        <p class="trade-offer-table__subtitle">S - предложения</p>
        <div class="trade-offer-table__heading">
            <template v-if="dealType.id === 3">
                <with-unit-type
                    class="trade-offer-table__title"
                    :unit-type="unitTypes.PALLET_PLACE"
                >
                    {{ pallets }}
                </with-unit-type>
                /
            </template>
            <with-unit-type class="trade-offer-table__title" :unit-type="unitTypes.SQUARE_METERS">
                {{ title }}
            </with-unit-type>
        </div>
        <ComplexOfferAreaTable v-if="area.floor" :area="area.floor" title="S - сладская" />
        <ComplexOfferAreaTable v-if="area.office" :area="area.office" title="S - офисная" tooltip />
        <ComplexOfferAreaTable v-if="area.tech" :area="area.tech" title="S - техническая" tooltip />
    </div>
</template>

<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import ComplexOfferAreaTable from '@/components/Complex/Offer/ComplexOfferAreaTable.vue';

export default {
    name: 'ComplexOfferArea',
    components: {
        ComplexOfferAreaTable,
        WithUnitType
    },
    props: {
        title: {
            type: String,
            required: true
        },
        area: {
            type: Object,
            default: () => {}
        },
        dealType: {
            type: Object,
            default: () => null
        },
        pallets: {
            type: String,
            default: null
        }
    },
    computed: {
        unitTypes: () => unitTypes
    }
};
</script>
