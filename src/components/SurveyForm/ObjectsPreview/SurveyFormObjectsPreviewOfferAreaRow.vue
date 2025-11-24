<template>
    <p v-if="hasValue" class="area-row">
        <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
            {{ formattedValue }}
        </with-unit-type>
        <span> - {{ label }}</span>
    </p>
</template>
<script setup lang="ts">
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number';

const props = defineProps<{
    areaMin: number;
    areaMax: number;
    label: string;
}>();

const hasValue = computed(() => props.areaMin || props.areaMax);

const formattedValue = computed(() => toNumberOrRangeFormat(props.areaMin, props.areaMax));
</script>

<style scoped>
.area-row {
    display: inline-block;
    line-height: 110%;
}
</style>
