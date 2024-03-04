<template>
    <div v-if="deal.price_sale_min || deal.price_sale_max" class="complex-deal-table__table">
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
                    {{ $formatter.numberOrRangeNew(deal.price_sale_min, deal.price_sale_max) }}
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
            let [areaMin, areaMax] = [this.deal.area_field_min, this.deal.area_field_max];

            if (!this.objectIsLand) {
                areaMin = this.deal.area_warehouse_min;
                areaMax =
                    this.deal.area_warehouse_max +
                    (this.deal.area_office_max || 0) +
                    this.deal.area_tech_max;
            }

            return {
                min: this.priceOption.func(this.deal.price_sale_min, areaMin),
                max: this.priceOption.func(this.deal.price_sale_max, areaMax)
            };
        }
    }
};
</script>
