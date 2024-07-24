<template>
    <div class="offer-table-item-area">
        <with-unit-type :unit-type="unitTypes.SQUARE_METERS" class="offer-table-item-area__title">
            {{ object.is_land ? object.area_field_full : object.area_building }}
        </with-unit-type>
        <div class="offer-table-item-area__additional">
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ object.area_floor_full }}
                </with-unit-type>
                <span> - пола (общ.)</span>
            </p>
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ object.area_mezzanine_full }}
                </with-unit-type>
                <span> - мезонин (общ.)</span>
            </p>
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ object.area_office_full }}
                </with-unit-type>
                <span> - офисы (общ.)</span>
            </p>
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ object.area_tech_full }}
                </with-unit-type>
                <span> - технич. (общ.)</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

defineProps({
    object: {
        type: Object,
        required: true
    }
});
</script>
