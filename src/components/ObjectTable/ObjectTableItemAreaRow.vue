<template>
    <p class="offer-table-item-area__item">
        <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
            {{ formattedValue }}
        </with-unit-type>
        <span> - {{ label }}</span>
    </p>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    value: [Number, String]
});

const formattedValue = computed(() => toNumberFormat(props.value));
</script>
