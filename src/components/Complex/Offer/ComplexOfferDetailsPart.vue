<template>
    <ul class="trade-offer-details-table__column">
        <li
            class="trade-offer-details-table__head"
            :class="'trade-offer-details-table__head--color--' + color"
        >
            {{ part.floor.title }}
        </li>
        <li
            class="trade-offer-details-table__head"
            :class="'trade-offer-details-table__head--color--' + color"
        >
            Блок #{{ part.id }}
        </li>
        <li
            v-for="(parameter, key) in parameters"
            :key="`${part.id}-${key}`"
            class="trade-offer-details-table__section"
        >
            <ul
                class="trade-offer-details-table__properties trade-offer-details-table__properties--values"
            >
                <li
                    v-for="(property, index) in parameter.properties"
                    :key="`${part.id}-${key}-${index}`"
                    class="trade-offer-details-table__property"
                >
                    <span class="trade-offer-details-table__value">
                        <template v-if="property.value === null">-</template>
                        <template v-else>
                            <span
                                v-if="property.value instanceof Array"
                                class="trade-offer-details-table__property-list"
                            >
                                <span class="trade-offer-details-table__values">
                                    <with-unit-type :unit-type="property.unitType">
                                        {{ property.value[0].value }}
                                    </with-unit-type>
                                    <span
                                        >, {{ property.value[0].type
                                        }}<template v-if="property.value.length > 1">..</template>
                                    </span>
                                </span>
                                <Tooltip
                                    v-if="property.value.length > 1"
                                    icon="fa-regular fa-circle-question"
                                >
                                    <template #content>
                                        <ul class="trade-offer-table__description">
                                            <li
                                                v-for="(element, key) in property.value"
                                                :key="key"
                                                class="trade-offer-summary__values"
                                            >
                                                <with-unit-type :unit-type="property.unitType">
                                                    {{ element.value }}
                                                </with-unit-type>
                                                , {{ element.type }}
                                            </li>
                                        </ul>
                                    </template>
                                </Tooltip>
                            </span>
                            <template v-else-if="property.unitType">
                                <with-unit-type :unit-type="property.unitType">
                                    {{ $formatter.toCorrectValue(property.value) }}
                                </with-unit-type>
                            </template>
                            <template v-else>{{ property.value }}</template>
                        </template>
                    </span>
                </li>
            </ul>
        </li>
    </ul>
</template>
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'ComplexOfferDetailsPart',
    components: { Tooltip, WithUnitType },
    props: {
        part: {
            type: Object,
            required: true
        },
        color: {
            type: String,
            default: null
        }
    },
    computed: {
        parameters() {
            return mapper.propertiesToTableFormatWithSections(
                this.part,
                entityProperties.part.characteristicsWithSections
            );
        }
    }
};
</script>
