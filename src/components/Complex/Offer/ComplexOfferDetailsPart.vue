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
                    v-for="(subparameter, index) in parameter"
                    :key="`${part.id}-${key}-${index}`"
                    class="trade-offer-details-table__property"
                >
                    <template v-if="subparameter.unitType && subparameter.multiple">
                        <span class="trade-offer-details-table__property-list">
                            <span class="trade-offer-summary__values">
                                <with-unit-type :unit-type="subparameter.unitType">
                                    {{ subparameter.value[0].value }}
                                </with-unit-type>
                                , {{ subparameter.value[0].type }}
                            </span>
                            <Tooltip
                                v-if="subparameter.value.length > 1"
                                icon="fa-regular fa-circle-question"
                            >
                                <template #content>
                                    <ul class="trade-offer-table__description">
                                        <li
                                            v-for="(element, key) in subparameter.value"
                                            :key="key"
                                            class="trade-offer-summary__values"
                                        >
                                            <with-unit-type :unit-type="subparameter.unitType">
                                                {{ element.value }}
                                            </with-unit-type>
                                            , {{ element.type }}
                                        </li>
                                    </ul>
                                </template>
                            </Tooltip>
                        </span>
                    </template>
                    <template v-else-if="subparameter.unitType">
                        <span
                            v-if="subparameter.value"
                            class="trade-offer-details-table__property-list"
                        >
                            <with-unit-type :unit-type="subparameter.unitType">
                                {{ subparameter.value }}
                            </with-unit-type>
                        </span>
                        <template v-else>-</template>
                    </template>
                    <template v-else>{{ subparameter.value }}</template>
                </li>
            </ul>
        </li>
    </ul>
</template>
<script>
import { floorPartCharacteristics } from '@/const/properties';
import { alg } from '@/utils/alg';
import WithUnitType from '@/components/common/WithUnitType.vue';
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
            const parameters = Object.keys(floorPartCharacteristics).map(category => {
                const currentCategory = floorPartCharacteristics[category];

                return Object.keys(currentCategory).map(property => {
                    const currentPropertyObject = currentCategory[property];

                    if (currentPropertyObject.range) {
                        const value = this.$formatter.numberOrRangeNew(
                            this.part[`${property}_min`],
                            this.part[`${property}_max`]
                        );

                        return {
                            value: value == 0 ? null : value,
                            unitType: currentPropertyObject.unitType
                        };
                    }

                    if (currentPropertyObject.count && currentPropertyObject.types) {
                        if (!this.part[property] || !this.part[property].length)
                            return { value: '-' };

                        const pairs = alg.chunk(this.part[property], 2);

                        const types = pairs.reduce((acc, pair) => {
                            if (pair[0] in acc) acc[pair[0]] += pair[1];
                            else acc[pair[0]] = pair[1];

                            return acc;
                        }, {});

                        return {
                            value: Object.keys(types).map(key => ({
                                type: currentPropertyObject.types[key],
                                value: types[key]
                            })),
                            multiple: true,
                            unitType: currentPropertyObject.unitType
                        };
                    }

                    if (currentPropertyObject.count)
                        return {
                            value: this.part[property] ?? '-',
                            unitType: currentPropertyObject.unitType
                        };

                    if (currentPropertyObject.types && currentPropertyObject.multiple) {
                        if (!this.part[property] || !this.part[property].length)
                            return { name: currentPropertyObject.name, value: '-' };

                        let partProperty =
                            this.part[property] instanceof Array
                                ? this.part[property]
                                : JSON.parse(this.part[property]);

                        if (partProperty == 0) partProperty = [];

                        return {
                            name: currentPropertyObject.name,
                            value: partProperty
                                .map(element => currentPropertyObject.types[element])
                                .join(', ')
                        };
                    }

                    if (currentPropertyObject.types)
                        return {
                            value: currentPropertyObject.types[this.part[property]] ?? '-'
                        };

                    if (this.part[property] instanceof Array)
                        return { value: this.part[property].length ? 'Да/есть' : '-' };

                    return {
                        value:
                            this.part[property] === 1
                                ? 'Да/есть'
                                : this.part[property] === 2
                                  ? 'Нет'
                                  : '-'
                    };
                });
            });

            return parameters;
        }
    }
};
</script>
