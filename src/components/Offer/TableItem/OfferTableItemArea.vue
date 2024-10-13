<template>
    <div class="offer-table-item-area">
        <with-unit-type :unit-type="unitTypes.SQUARE_METERS" class="offer-table-item-area__title">
            {{ offer.calc_area_general }}
        </with-unit-type>
        <div class="offer-table-item-area__additional">
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_mezzanine }}
                </with-unit-type>
                <span> - мезонин</span>
            </p>
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_office }}
                </with-unit-type>
                <span> - офисы</span>
            </p>
            <p class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_tech }}
                </with-unit-type>
                <span> - технич.</span>
            </p>
        </div>
        <div
            v-if="offer.blocks?.length > 1"
            v-tippy="'Нажмите, чтобы просмотреть блоки'"
            @click="$emit('show-blocks')"
            class="offer-table-item-area__label mt-1"
        >
            *собрано из блоков
        </div>
    </div>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

defineEmits(['show-blocks']);
defineProps({
    offer: {
        type: Object,
        required: true
    }
});
</script>
