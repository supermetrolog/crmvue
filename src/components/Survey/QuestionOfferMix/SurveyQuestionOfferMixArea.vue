<template>
    <div class="messenger-quiz-question-template-offer__column">
        <p class="fs-2 text-grey font-weight-semi">Площади:</p>
        <with-unit-type :unit-type="unitTypes.SQUARE_METERS" class="offer-table-item-area__title">
            {{ offer.calc_area_general }}
        </with-unit-type>
        <div class="d-flex gap-1">
            <span class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_mezzanine }}
                </with-unit-type>
                <span> - мезонин;</span>
            </span>
            <span class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_office }}
                </with-unit-type>
                <span> - офисы;</span>
            </span>
            <span class="offer-table-item-area__item">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ offer.calc_area_tech }}
                </with-unit-type>
                <span> - технич.</span>
            </span>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

defineProps({
    offer: {
        type: Object,
        required: true
    }
});
</script>
