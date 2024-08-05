<template>
    <div
        v-if="
            deal.summaryBlock &&
            (deal.summaryBlock.price_sale_min || deal.summaryBlock.price_field_min)
        "
        class="complex-deal-table__table"
    >
        <with-unit-type class="complex-deal-table__title" :unit-type="priceOption.unitType">
            {{ toNumberOrRangeStrictFormat(mainPrice.min, mainPrice.max) }}
        </with-unit-type>
        <ul class="complex-deal-table__description">
            <li class="complex-deal-table__grid-title">
                <p class="complex-deal-table__text complex-deal-table__label">Цена за кв. м</p>
                <with-unit-type
                    class="complex-deal-table__value"
                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS"
                >
                    {{
                        toNumberOrRangeStrictFormat(
                            deal.summaryBlock.price_sale_min,
                            deal.summaryBlock.price_sale_max
                        )
                    }}
                </with-unit-type>
            </li>
        </ul>
    </div>
    <EmptyData v-else>Данные о ценах отсутствуют..</EmptyData>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import EmptyData from '@/components/common/EmptyData.vue';
import { reducer } from '@/utils/reducer.js';
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatter.js';

const props = defineProps({
    deal: {
        type: Object,
        required: true
    },
    priceOption: {
        type: Object,
        required: true
    }
});

const mainPrice = computed(() => {
    const activeBlocks = props.deal.blocks.filter(offer => !offer.deleted && !offer.deal_id);

    const [areaMin, areaMax] = [
        reducer.strictMin(activeBlocks, 'area_min'),
        reducer.max(activeBlocks, 'area_max')
    ];

    return {
        min: props.priceOption.func(props.deal.summaryBlock.price_sale_min, areaMin),
        max: props.priceOption.func(props.deal.summaryBlock.price_sale_max, areaMax)
    };
});
</script>
