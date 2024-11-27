<template>
    <div v-if="prices.warehouse.length || prices.range.length" class="complex-deal-table__table">
        <with-unit-type class="complex-deal-table__title" :unit-type="priceOption.unitType">
            {{ toNumberOrRangeFormat(mainPrice.valueMin, mainPrice.valueMax) }}
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
                    {{ toNumberFormat(warehousePrice) }}
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
                        <template v-if="price.valueMin !== undefined">
                            {{ toNumberOrRangeFormat(price.valueMin, price.valueMax) }}
                        </template>
                        <template v-else>
                            {{ toNumberFormat(price.value) }}
                        </template>
                    </with-unit-type>
                </li>
            </template>
        </ul>
    </div>
    <EmptyData v-else>Данные о ценах отсутствуют..</EmptyData>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import { reducer } from '@/utils/reducer.js';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, inject } from 'vue';
import { toNumberFormat, toNumberOrRangeFormat } from '@/utils/formatters/number.js';

const objectIsLand = inject('objectIsLand');
const props = defineProps({
    priceOption: {
        type: Object,
        required: true
    },
    deal: {
        type: Object,
        required: true
    }
});

const prices = computed(() => {
    return {
        warehouse: mapper.propertiesToPrices(
            props.deal,
            entityProperties.offer.priceWithSections.warehouse,
            true
        ),
        range: mapper.propertiesToPrices(
            props.deal,
            entityProperties.offer.priceWithSections.range,
            true
        )
    };
});

const formattedPrices = computed(() => {
    return Object.values(prices.value)
        .reduce((acc, list) => [...acc, ...list])
        .map(price => {
            if (price.valueMin || price.valueMax) {
                return {
                    ...price,
                    valueMin: props.priceOption.func(price.valueMin),
                    valueMax: props.priceOption.func(price.valueMax)
                };
            }

            return { ...price, value: props.priceOption.func(price.value) };
        });
});

const mainPrice = computed(() => {
    if (objectIsLand) {
        return {
            valueMin: props.priceOption.func(props.deal.price_field_min),
            valueMax: props.priceOption.func(props.deal.price_field_max)
        };
    }

    return {
        valueMin: props.priceOption.func(reducer.min(prices.value.warehouse, 'valueMin')),
        valueMax: props.priceOption.func(reducer.max(prices.value.warehouse, 'valueMax'))
    };
});

const warehousePrice = computed(() =>
    props.priceOption.func(reducer.max(prices.value.warehouse, 'valueMax'))
);
</script>
