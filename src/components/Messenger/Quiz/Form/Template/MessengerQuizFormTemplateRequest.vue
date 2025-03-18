<template>
    <div class="messenger-quiz-form-template-request">
        <div class="messenger-quiz-form-template-request__row">
            <SurveyQuestionRequest
                @edit="$emit('edit')"
                :request
                :class="{ active: isActive, passive: isPassive, skip: isSkipped }"
                class="messenger-quiz-form-template-request__preview"
                :editable
            />
            <div class="messenger-quiz-form-template-request__aside">
                <div class="d-flex gap-1">
                    <MessengerQuizFormRadioChip
                        v-model="mainAnswer"
                        :disabled
                        :value="true"
                        unselect
                        label="Да"
                    />
                    <MessengerQuizFormRadioChip
                        v-model="mainAnswer"
                        :disabled
                        :value="false"
                        unselect
                        label="Нет"
                    />
                    <MessengerQuizFormRadioChip
                        v-model="hasNullMainAnswer"
                        :value="true"
                        :disabled
                        unselect
                        class="flex-grow-1 messenger-quiz-question__no-answer"
                        label="Не ответил"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerQuizFormRadioChip from '@/components/Messenger/Quiz/Form/MessengerQuizFormRadioChip.vue';
import { locationOptions } from '@/const/options/location.options.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import SurveyQuestionRequest from '@/components/Survey/QuestionRequest/SurveyQuestionRequest.vue';

const emit = defineEmits(['edit', 'change']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    disabled: Boolean,
    editable: Boolean
});

// form

const mainAnswer = ref(undefined);
const hasNullMainAnswer = ref(false);

watch(hasNullMainAnswer, value => {
    if (value) mainAnswer.value = null;
    emit('change');
});

watch(mainAnswer, value => {
    if (isNotNullish(value)) hasNullMainAnswer.value = false;
    emit('change');
});

const isActive = computed(() => mainAnswer.value === true);
const isPassive = computed(() => mainAnswer.value === false);
const isSkipped = computed(() => hasNullMainAnswer.value);

function generateLocation() {
    const locations = [];

    if (props.request.regions) {
        locations.push(
            props.request.regions.map(element => locationOptions.region[element.region]).join(', ')
        );
    }

    if (props.request.directions) {
        locations.push(
            ...props.request.directions.map(
                element => locationOptions.directionWithShort[element.direction].full
            )
        );
    }

    if (props.request.districts) {
        locations.push(
            ...props.request.districts.map(element => locationOptions.district[element.district])
        );
    }

    return locations.join(', ').slice(0, 48) + '...';
}

function generateCalcArea() {
    return toNumberOrRangeFormat(props.request.minArea, props.request.maxArea);
}

function getForm() {
    return {
        id: props.request.id,
        answer: mainAnswer.value,
        location: generateLocation(),
        deal_type: props.request.dealType,
        calc_area: generateCalcArea()
    };
}

function validate() {
    if (props.disabled) return true;
    if (isNotNullish(mainAnswer.value)) return true;
    return hasNullMainAnswer.value;
}

function setAnswer(value) {
    hasNullMainAnswer.value = value === null;
    mainAnswer.value = value;
}

function setForm(form) {
    hasNullMainAnswer.value = isNullish(form.answer);
    mainAnswer.value = form.answer;
}

function checkHasAnswer() {
    return isNotNullish(mainAnswer.value) || hasNullMainAnswer.value;
}

defineExpose({ getForm, validate, setAnswer, setForm, hasAnswer: checkHasAnswer });
</script>
