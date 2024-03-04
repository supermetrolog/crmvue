<template>
    <div v-if="prices.warehouse.length || prices.range.length" class="complex-deal-table__table">
        <with-unit-type class="complex-deal-table__title" :unit-type="priceOption.unitType">
            {{ $formatter.numberOrRangeNew(mainPrice.valueMin, mainPrice.valueMax) }}
        </with-unit-type>
        <ul class="complex-deal-table__description">
            <li
                v-if="!objectIsLand"
                class="complex-deal-table__grid-title complex-deal-table__grid-title--strong"
            >
                <p class="complex-deal-table__text complex-deal-table__label">E - складская</p>
                <with-unit-type
                    class="complex-deal-table__value"
                    :unit-type="warehousePrice.unitType || priceOption.unitType"
                >
                    {{ $formatter.number(warehousePrice) }}
                </with-unit-type>
            </li>
            <template v-if="prices.warehouse.length || prices.range.length">
                <li
                    v-for="(price, key) in formattedPrices"
                    :key="key"
                    class="complex-deal-table__grid-title"
                >
                    <p class="complex-deal-table__text complex-deal-table__label">
                        {{ price.name }}
                    </p>
                    <with-unit-type
                        class="complex-deal-table__value"
                        :unit-type="price.unitType || priceOption.unitType"
                    >
                        <template v-if="price.valueMin">
                            {{ $formatter.numberOrRangeNew(price.valueMin, price.valueMax) }}
                        </template>
                        <template v-else>
                            {{ $formatter.number(price.value) }}
                        </template>
                    </with-unit-type>
                </li>
            </template>
        </ul>
    </div>
    <EmptyData v-else>Данные о ценах отсутствуют..</EmptyData>
</template>
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import { reducer } from '@/utils';
import EmptyData from '@/components/common/EmptyData.vue';

export default {
    name: 'ComplexDealPriceRent',
    components: { EmptyData, WithUnitType },
    inject: ['objectIsLand'],
    props: {
        priceOption: {
            type: Object,
            required: true
        },
        deal: {
            type: Object,
            required: true
        }
    },
    computed: {
        prices() {
            return {
                warehouse: mapper.propertiesToPrices(
                    this.deal,
                    entityProperties.offer.priceWithSections.warehouse,
                    true
                ),
                range: mapper.propertiesToPrices(
                    this.deal,
                    entityProperties.offer.priceWithSections.range,
                    true
                )
            };
        },
        formattedPrices() {
            return Object.values(this.prices)
                .reduce((acc, list) => [...acc, ...list])
                .map(price => {
                    if (price.valueMin || price.valueMax) {
                        return {
                            ...price,
                            valueMin: this.priceOption.func(price.valueMin),
                            valueMax: this.priceOption.func(price.valueMax)
                        };
                    }

                    return { ...price, value: this.priceOption.func(price.value) };
                });
        },
        mainPrice() {
            if (this.objectIsLand) {
                return {
                    valueMin: this.priceOption.func(this.deal.price_field_min),
                    valueMax: this.priceOption.func(this.deal.price_field_max)
                };
            }

            return {
                valueMin: this.priceOption.func(reducer.min(this.prices.warehouse, 'valueMin')),
                valueMax: this.priceOption.func(reducer.max(this.prices.warehouse, 'valueMax'))
            };
        },
        warehousePrice() {
            return this.priceOption.func(reducer.max(this.prices.warehouse, 'valueMax'));
        }
    }
};
</script>
