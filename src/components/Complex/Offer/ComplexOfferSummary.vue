<template>
    <div class="trade-offer-summary">
        <div class="trade-offer-summary__content">
            <PropertyList
                v-for="(parameter, id) in parameters"
                :key="id"
                :title="parameter.name"
                class="trade-offer-summary__table"
            >
                <PropertyListItem
                    v-for="(subparameter, idx) of parameter.properties"
                    :key="subparameter.name + idx"
                    class="trade-offer-summary__item"
                    :name="subparameter.name"
                >
                    <template v-if="subparameter.unitType && subparameter.multiple">
                        <span
                            v-for="(element, key) in subparameter.value"
                            :key="key"
                            class="trade-offer-summary__values"
                        >
                            <with-unit-type :unit-type="subparameter.unitType">
                                {{ element.value }}
                            </with-unit-type>
                            , {{ element.type }}
                        </span>
                    </template>
                    <template v-else-if="subparameter.unitType">
                        <with-unit-type :unit-type="subparameter.unitType">
                            {{ subparameter.value }}
                        </with-unit-type>
                    </template>
                    <template v-else>{{ subparameter.value }}</template>
                </PropertyListItem>
            </PropertyList>
        </div>
    </div>
</template>

<script>
import { OfferParametersMixin } from '@/components/Complex/Offer/mixins';
import PropertyListItem from '@/components/common/Property/PropertyListItem.vue';
import PropertyList from '@/components/common/Property/PropertyList.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { tradeOfferCharacteristics } from '@/const/properties';
import { alg } from '@/utils/alg';

export default {
    name: 'ComplexOfferSummary',
    components: {
        WithUnitType,
        PropertyList,
        PropertyListItem
    },
    mixins: [OfferParametersMixin],
    props: {
        offer: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {
        parameters() {
            const parameters = tradeOfferCharacteristics.map(section => {
                const properties = Object.keys(section.properties).map(property => {
                    const currentPropertyObject = section.properties[property];

                    if (currentPropertyObject.range)
                        return {
                            name: currentPropertyObject.name,
                            value: this.$formatter.numberOrRangeNew(
                                this.offer[`${property}_min`],
                                this.offer[`${property}_max`]
                            ),
                            unitType: currentPropertyObject.unitType
                        };

                    if (currentPropertyObject.count && currentPropertyObject.types) {
                        if (!this.offer[property].length)
                            return { name: currentPropertyObject.name, value: '-' };

                        const pairs = alg.chunk(this.offer[property], 2);

                        const types = pairs.reduce((acc, pair) => {
                            if (pair[0] in acc) acc[pair[0]] += pair[1];
                            else acc[pair[0]] = pair[1];

                            return acc;
                        }, {});

                        return {
                            name: currentPropertyObject.name,
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
                            name: currentPropertyObject.name,
                            value: this.offer[property] ?? '-',
                            unitType: currentPropertyObject.unitType
                        };

                    if (currentPropertyObject.types && currentPropertyObject.multiple) {
                        if (!this.offer[property] || !this.offer[property].length)
                            return { name: currentPropertyObject.name, value: '-' };

                        const offerProperty =
                            this.offer[property] instanceof Array
                                ? this.offer[property]
                                : JSON.parse(this.offer[property]);

                        return {
                            name: currentPropertyObject.name,
                            value: offerProperty
                                .map(element => currentPropertyObject.types[element])
                                .join(', ')
                        };
                    }

                    if (currentPropertyObject.types)
                        return {
                            name: currentPropertyObject.name,
                            value: currentPropertyObject.types[this.offer[property]] ?? '-'
                        };

                    return {
                        name: currentPropertyObject.name,
                        value: this.offer[property] ? 'Да/есть' : '-'
                    };
                });

                return {
                    name: section.name,
                    properties: properties
                };
            });

            return parameters;
        }
    },
    methods: {
        getLeftHalfValue(value) {
            return value.split('$1')[0];
        },
        getRightHalfValue(value) {
            return value.split('$1')[1];
        }
    }
};
</script>
