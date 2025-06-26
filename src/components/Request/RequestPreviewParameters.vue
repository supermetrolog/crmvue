<template>
    <div class="request-preview__parameters">
        <UiChip color="dark" size="big">
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                {{ area }}
            </WithUnitType>
        </UiChip>
        <UiChip v-if="request.movingDate" class="dashboard-cl-danger" size="big">
            <i class="fa-regular fa-clock icon mr-1"></i>
            <span>переезд до {{ movingDate }}</span>
        </UiChip>
        <UiChip v-else-if="hasMovingOptions" size="big">
            <i class="fa-regular fa-clock icon"></i>
            <span>{{ movingOption }}</span>
        </UiChip>
    </div>
</template>
<script setup>
import UiChip from '@/components/common/UI/UiChip.vue';
import { computed } from 'vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { toDateFormat } from '@/utils/formatters/date.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { unknownMovingDate } from '@/const/const.js';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const area = computed(() => {
    const min = props.request.minArea;
    const max = props.request.maxArea;

    if (min === max) {
        return toNumberFormat(min);
    }

    if (min && max) {
        return `от ${toNumberFormat(min)} до ${toNumberFormat(max)}`;
    }

    if (min) {
        return `от ${toNumberFormat(min)}`;
    }

    return `до ${toNumberFormat(max)}`;
});

const movingDate = computed(() => toDateFormat(props.request.movindDate, 'D.MM.YY'));

const hasMovingOptions = computed(() => isNotNullish(props.request.unknownMovingDate));
const movingOption = computed(() => unknownMovingDate[props.request.unknownMovingDate]);
</script>
