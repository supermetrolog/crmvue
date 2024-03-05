<template>
    <li v-if="tooltip" class="trade-offer-table__grid-item">
        <div class="trade-offer-table__header">
            <span class="trade-offer-table__label">{{ title }}</span>
            <Tooltip icon="fa-regular fa-circle-question">
                <template #content>
                    <ul class="trade-offer-table__description">
                        <li
                            v-for="(property, idx) in properties"
                            :key="property.label + idx"
                            class="trade-offer-table__area trade-offer-table__grid-item"
                        >
                            <span>{{ property.label }}</span>
                            <with-unit-type class="trade-offer-table__value" :unit-type="unitType">
                                <template v-if="withoutRange">
                                    {{ property.value }}
                                </template>
                                <template v-else>
                                    {{
                                        $formatter.numberOrRangeNew(
                                            property.valueMin,
                                            property.valueMax
                                        )
                                    }}
                                </template>
                            </with-unit-type>
                        </li>
                    </ul>
                </template>
            </Tooltip>
        </div>
    </li>
    <template v-else>
        <li
            v-for="(property, idx) in properties"
            :key="property.label + idx"
            class="trade-offer-table__area trade-offer-table__grid-item"
        >
            <span v-if="property.label instanceof Object">{{ property.label.name }}</span>
            <span v-else>{{ property.label }}</span>
            <with-unit-type
                class="trade-offer-table__value"
                :unit-type="property.label instanceof Object ? property.label.unitType : unitType"
            >
                <template v-if="withoutRange">
                    {{ property.value }}
                </template>
                <template v-else>
                    {{ $formatter.numberOrRangeNew(property.valueMin, property.valueMax) }}
                </template>
            </with-unit-type>
        </li>
    </template>
</template>
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'ComplexOfferPriceTable',
    components: { Tooltip, WithUnitType },
    props: {
        properties: {
            type: Array,
            required: true
        },
        unitType: {
            type: String,
            default: unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
        },
        withoutRange: {
            type: Boolean,
            default: false
        },
        tooltip: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: null
        }
    }
};
</script>
