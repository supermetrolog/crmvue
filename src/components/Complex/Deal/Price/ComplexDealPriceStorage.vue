<template>
    <div v-if="prices.length" class="complex-deal-table__table">
        <with-unit-type class="complex-deal-table__title" :unit-type="priceOption.unitType">
            {{ toNumberOrRangeFormat(mainPrice.valueMin, mainPrice.valueMax) }}
        </with-unit-type>
        <ul class="complex-deal-table__description">
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
        </ul>
    </div>
    <EmptyData v-else>Данные о ценах отсутствуют..</EmptyData>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import { reducer } from '@/utils/reducer.js';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed } from 'vue';
import { toNumberFormat, toNumberOrRangeFormat } from '@/utils/formatter.js';

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
    return mapper.propertiesToPrices(
        props.deal,
        entityProperties.offer.priceWithSections.range,
        true
    );
});

const formattedPrices = computed(() => {
    return Object.values(prices.value).map(price => {
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
    return {
        valueMin: props.priceOption.func(reducer.min(prices.value, 'valueMin')),
        valueMax: props.priceOption.func(reducer.max(prices.value, 'valueMax'))
    };
});
</script>
