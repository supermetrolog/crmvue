<template>
    <div class="trade-offer-table__grid-item">
        <div class="trade-offer-table__header">
            <span class="trade-offer-table__label">{{ title }}</span>
            <span class="trade-offer-table__value">
                <with-unit-type
                    class="trade-offer-table__value"
                    :unit-type="unitTypes.SQUARE_METERS"
                >
                    {{ $formatter.numberOrRangeNew(area.valueMin, area.valueMax) }}
                </with-unit-type>
                <Tooltip v-if="tooltip" icon="fa-regular fa-circle-question">
                    <template #content>
                        <ul class="trade-offer-table__description">
                            <li
                                v-for="(property, key) in areaProperties"
                                :key="key"
                                class="trade-offer-table__area"
                            >
                                <span>{{ property.label }}</span>
                                <with-unit-type
                                    class="trade-offer-table__value"
                                    :unit-type="unitTypes.SQUARE_METERS"
                                >
                                    {{
                                        $formatter.numberOrRangeNew(
                                            property.valueMin,
                                            property.valueMax
                                        )
                                    }}
                                </with-unit-type>
                            </li>
                        </ul>
                    </template>
                </Tooltip>
            </span>
        </div>
        <ul v-if="!tooltip && area.description" class="trade-offer-table__description">
            <li
                v-for="(property, key) in areaProperties"
                :key="key"
                class="trade-offer-table__area"
            >
                <span>{{ property.label }}</span>
                <with-unit-type
                    class="trade-offer-table__value"
                    :unit-type="unitTypes.SQUARE_METERS"
                >
                    {{ $formatter.numberOrRangeNew(property.valueMin, property.valueMax) }}
                </with-unit-type>
            </li>
        </ul>
    </div>
</template>
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import { alg } from '@/utils/alg';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'ComplexOfferAreaTable',
    components: { Tooltip, WithUnitType },
    props: {
        area: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        unitType: {
            type: String,
            default: null
        },
        tooltip: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        areaProperties() {
            return [...this.area.description].sort(alg.predicates.compareString('label'));
        }
    }
};
</script>
