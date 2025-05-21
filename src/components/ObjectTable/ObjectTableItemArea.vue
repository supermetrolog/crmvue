<template>
    <div class="offer-table-item-area">
        <with-unit-type :unit-type="unitTypes.SQUARE_METERS" class="offer-table-item-area__title">
            {{ formattedArea }}
        </with-unit-type>
        <div v-if="!object.is_land" class="offer-table-item-area__additional">
            <ObjectTableItemAreaRow
                v-if="object.area_floor_full"
                :value="object.area_floor_full"
                label="по полу"
            />
            <ObjectTableItemAreaRow
                :value="object.area_mezzanine_full === '' ? 0 : object.area_mezzanine_full"
                label="мезонин"
            />
            <ObjectTableItemAreaRow :value="object.area_office_full" label="офисы" />
            <ObjectTableItemAreaRow :value="object.area_tech_full" label="технич." />
        </div>
    </div>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import ObjectTableItemAreaRow from '@/components/ObjectTable/ObjectTableItemAreaRow.vue';

const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const formattedArea = computed(() => {
    if (props.object.is_land) return toNumberFormat(props.object.area_field_full);
    else return toNumberFormat(props.object.area_building);
});
</script>
