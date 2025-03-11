<template>
    <div class="d-flex gap-1 align-items-start">
        <div class="messenger-quiz-form-request-picker-element flex-grow-1">
            <div class="messenger-quiz-form-request-picker-element__body">
                <p class="messenger-quiz-form-request-picker-element__header">
                    <span class="messenger-quiz-form-request-picker-element__id">
                        #{{ request.id }}
                    </span>
                    <span
                        v-if="isNotNullish(request.deal_type)"
                        class="messenger-quiz-form-request-picker-element__type"
                    >
                        {{ dealType }}
                    </span>
                    <span v-if="request.calc_area">
                        <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                            {{ request.calc_area }}
                        </with-unit-type>
                    </span>
                </p>
                <p
                    v-if="request.location"
                    class="messenger-quiz-form-request-picker-element__regions"
                >
                    <i class="fa-solid fa-earth mr-1" />
                    {{ request.location }}
                </p>
            </div>
        </div>
        <div class="d-flex gap-1">
            <Chip :class="answerClass">{{ answerText }}</Chip>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { unitTypes } from '@/const/unitTypes.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import Chip from '@/components/common/Chip.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { toBool } from '@/utils/helpers/string/toBool.js';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const dealType = computed(() => {
    return dealOptions.type[Number(props.request.deal_type) + 1];
});

const formattedAnswer = computed(() => {
    if (props.request.answer) return toBool(props.request.answer);
    return null;
});

const answerText = computed(() => {
    if (formattedAnswer.value) return 'Да';
    if (formattedAnswer.value === false) return 'Нет';
    return 'Не ответил';
});

const answerClass = computed(() => {
    if (formattedAnswer.value) return 'dashboard-bg-success text-white';
    if (formattedAnswer.value === false) return 'dashboard-bg-danger text-white';
    return 'dashboard-bg-light';
});
</script>
