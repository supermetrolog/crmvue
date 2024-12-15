<template>
    <div class="offer-table-item-preview-area">
        <p class="offer-table-item-preview-area__row">
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">{{ formattedNumber }}</WithUnitType>
            <span class="offer-table-item-preview-area__description ml-1">
                - {{ label }} (общ.)
            </span>
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

import {toNumberFormat} from "@/utils/formatters/number.js";

const props = defineProps({
    area: {
        type: [Number, String],
        default: null
    },
    label: {
        type: String,
        required: true
    }
});

const formattedNumber = computed(() => toNumberFormat(props.area));
</script>
