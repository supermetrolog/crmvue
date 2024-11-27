<template>
    <div class="trade-offer-table__grid-item">
        <div class="trade-offer-table__header">
            <span class="trade-offer-table__label">{{ title }}</span>
            <span class="trade-offer-table__value">
                <with-unit-type
                    class="trade-offer-table__value"
                    :unit-type="unitTypes.SQUARE_METERS"
                >
                    {{ areaRangeFormat }}
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
                                        toNumberOrRangeFormat(property.valueMin, property.valueMax)
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
                    {{ toNumberOrRangeFormat(property.valueMin, property.valueMax) }}
                </with-unit-type>
            </li>
        </ul>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import Tooltip from '@/components/common/Tooltip.vue';
import { compareByProperty } from '@/utils/predicate.js';
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';

const props = defineProps({
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
});

const areaProperties = computed(() => props.area.description.toSorted(compareByProperty('label')));
const areaRangeFormat = computed(() =>
    toNumberOrRangeFormat(props.area.valueMin, props.area.valueMax)
);
</script>
