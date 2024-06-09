<template>
    <div
        v-if="
            deal.summaryBlock &&
            (deal.summaryBlock.price_sale_min || deal.summaryBlock.price_sale_max)
        "
        class="complex-deal-table__table"
    >
        <with-unit-type class="complex-deal-table__title" :unit-type="priceOption.unitType">
            {{ $formatter.numberOrRangeNew(mainPrice.min, mainPrice.max) }}
        </with-unit-type>
        <ul class="complex-deal-table__description">
            <li class="complex-deal-table__grid-title">
                <p class="complex-deal-table__text complex-deal-table__label">Цена за кв. м</p>
                <with-unit-type
                    class="complex-deal-table__value"
                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS"
                >
                    {{
                        $formatter.numberOrRangeNew(
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
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import EmptyData from '@/components/common/EmptyData.vue';
import { reducer } from '@/utils/reducer.js';

export default {
    components: { EmptyData, WithUnitType },
    inject: ['objectIsLand'],
    props: {
        deal: {
            type: Object,
            required: true
        },
        priceOption: {
            type: Object,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        mainPrice() {
            const activeBlocks = this.deal.blocks.filter(offer => !offer.deleted && !offer.deal_id);

            const [areaMin, areaMax] = [
                reducer.strictMin(activeBlocks, 'area_min'),
                reducer.max(activeBlocks, 'area_max')
            ];

            return {
                min: this.priceOption.func(this.deal.summaryBlock.price_sale_min, areaMin),
                max: this.priceOption.func(this.deal.summaryBlock.price_sale_max, areaMax)
            };
        }
    }
};
</script>
