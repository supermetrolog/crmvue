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
                        {{ toNumberOrRangeFormat(palletPlace.valueMin, palletPlace.valueMax) }}
                    </with-unit-type>
                    /
                </template>
                <with-unit-type
                    class="complex-deal-table__title"
                    :unit-type="unitTypes.SQUARE_METERS"
                >
                    {{ toNumberOrRangeFormat(mainArea.valueMin, mainArea.valueMax) }}
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
                            toNumberOrRangeFormat(deal.area_warehouse_min, deal.area_warehouse_max)
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
                        {{ toNumberOrRangeFormat(area.valueMin, area.valueMax) }}
                    </with-unit-type>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { entityOptions } from '@/const/options/options';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import { reducer } from '@/utils/reducer.js';
import { computed, inject } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatter.js';

const dealType = inject('dealType');
const objectIsLand = inject('objectIsLand');

const props = defineProps({
    deal: {
        type: Object,
        required: true
    },
    original: {
        type: Object,
        default: null
    }
});

const isStorageDeal = computed(() => dealType.id === entityOptions.deal.typeStatement.STORAGE);
const hasWarehouseArea = computed(
    () => !objectIsLand && (props.deal.area_warehouse_min || props.deal.area_warehouse_max)
);

const mainArea = computed(() => {
    if (props.original) {
        const activeBlocks = props.original.blocks.filter(
            offer => !offer.deleted && !offer.deal_id
        );

        return {
            valueMin: reducer.strictMin(activeBlocks, 'area_min'),
            valueMax: reducer.max(activeBlocks, 'area_max')
        };
    }

    return {
        valueMin: props.deal.area_warehouse_min,
        valueMax:
            props.deal.area_warehouse_max +
            (props.deal.area_office_max || 0) +
            (props.deal.area_tech_max || 0)
    };
});

const areaList = computed(() =>
    mapper.propertiesToRangeFormat(props.deal, entityProperties.deal.area)
);

const palletPlace = computed(() => {
    if (props.deal.pallet_place_min || props.deal.pallet_place_max)
        return {
            valueMin: props.deal.pallet_place_min,
            valueMax: props.deal.pallet_place_max
        };

    return null;
});
</script>
