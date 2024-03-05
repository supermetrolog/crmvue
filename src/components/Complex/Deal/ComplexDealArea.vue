<template>
    <div class="complex-deal-table">
        <p class="complex-deal-table__name">Сводка по площади</p>
        <div class="complex-deal-table__content">
            <div class="complex-deal-table__heading">
                <template v-if="isStorageDeal && palletPlace">
                    <with-unit-type
                        class="complex-deal-table__title"
                        :unit-type="unitTypes.PALLET_PLACE"
                    >
                        {{
                            $formatter.numberOrRangeNew(palletPlace.valueMin, palletPlace.valueMax)
                        }}
                    </with-unit-type>
                    /
                </template>
                <with-unit-type
                    class="complex-deal-table__title"
                    :unit-type="unitTypes.SQUARE_METERS"
                >
                    {{ $formatter.numberOrRangeNew(mainArea.valueMin, mainArea.valueMax) }}
                </with-unit-type>
            </div>
            <ul class="complex-deal-table__description">
                <li
                    v-if="hasWarehouseArea"
                    class="complex-deal-table__grid-title complex-deal-table__grid-title--strong"
                >
                    <p class="complex-deal-table__text complex-deal-table__label">S - складская</p>
                    <with-unit-type
                        class="complex-deal-table__value"
                        :unit-type="unitTypes.SQUARE_METERS"
                    >
                        {{
                            $formatter.numberOrRangeNew(
                                deal.area_warehouse_min,
                                deal.area_warehouse_max
                            )
                        }}
                    </with-unit-type>
                </li>
                <li
                    v-for="(area, key) in areaList"
                    :key="key"
                    class="complex-deal-table__grid-title"
                >
                    <p class="complex-deal-table__text complex-deal-table__label">
                        {{ area.name }}
                    </p>
                    <with-unit-type
                        class="complex-deal-table__value"
                        :unit-type="unitTypes.SQUARE_METERS"
                    >
                        {{ $formatter.numberOrRangeNew(area.valueMin, area.valueMax) }}
                    </with-unit-type>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { entityOptions } from '@/const/options/options';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import { reducer } from '@/utils';

export default {
    name: 'ComplexDealArea',
    components: { WithUnitType },
    inject: ['dealType', 'objectIsLand'],
    props: {
        deal: {
            type: Object,
            required: true
        },
        original: {
            type: Object,
            default: null
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        isStorageDeal() {
            return this.dealType.id === entityOptions.deal.typeStatement.STORAGE;
        },
        hasWarehouseArea() {
            return (
                !this.objectIsLand && (this.deal.area_warehouse_min || this.deal.area_warehouse_max)
            );
        },
        mainArea() {
            if (this.original) {
                const activeBlocks = this.original.blocks.filter(
                    offer => !offer.deleted && !offer.deal_id
                );

                return {
                    valueMin: reducer.strictMin(activeBlocks, 'area_min'),
                    valueMax: reducer.max(activeBlocks, 'area_max')
                };
            }

            return {
                valueMin: this.deal.area_warehouse_min,
                valueMax:
                    this.deal.area_warehouse_max +
                    (this.deal.area_office_max || 0) +
                    (this.deal.area_tech_max || 0)
            };
        },
        areaList() {
            return mapper.propertiesToRangeFormat(this.deal, entityProperties.deal.area);
        },
        palletPlace() {
            if (this.deal.pallet_place_min || this.deal.pallet_place_max)
                return {
                    valueMin: this.deal.pallet_place_min,
                    valueMax: this.deal.pallet_place_max
                };

            return null;
        }
    }
};
</script>
