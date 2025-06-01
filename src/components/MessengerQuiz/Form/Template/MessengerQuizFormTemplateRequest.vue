<template>
    <div
        class="survey-form-object-preview-offer"
        :class="{ success: hasSuccessStatus, fail: hasFailStatus, editing: needEditing }"
    >
        <div class="survey-form-object-preview-offer__wrapper">
            <SurveyQuestionRequest
                @edit="$emit('edit')"
                :request
                :editable
                class="messenger-quiz-form-template-request__preview"
            />
            <AnimationTransition v-if="editable" :speed="0.5">
                <VueEditor
                    v-if="needEditing"
                    v-model="modelValue.description"
                    autofocus
                    :min-height="60"
                    :max-height="200"
                    :toolbar="false"
                    placeholder="Что необходимо изменить или добавить?"
                    class="survey-form-object-preview-offer__editor mt-2"
                />
            </AnimationTransition>
        </div>
        <div v-if="editable" class="survey-form-object-preview-offer__actions">
            <UiButtonIcon
                @click="selectAnswer(ANSWER.SUCCESS)"
                :active="form.answer === ANSWER.SUCCESS"
                icon="fa-solid fa-thumbs-up"
                label="Актуально без изменений"
            />
            <UiButtonIcon
                @click="selectAnswer(ANSWER.FAIL)"
                :active="form.answer === ANSWER.FAIL"
                icon="fa-solid fa-thumbs-down"
                label="Больше не актуально"
            />
            <UiButtonIcon
                @click="selectAnswer(ANSWER.EDIT)"
                :active="form.answer === ANSWER.EDIT"
                icon="fa-solid fa-pen"
                label="Внести изменения"
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { locationOptions } from '@/const/options/location.options.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import SurveyQuestionRequest from '@/components/Survey/QuestionRequest/SurveyQuestionRequest.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

defineEmits(['edit']);

const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    disabled: Boolean,
    editable: Boolean
});

const form = defineModel({ type: Object });

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

// function getForm() {
//     return {
//         id: props.request.id,
//         answer: mainAnswer.value,
//         location: generateLocation(),
//         deal_type: props.request.dealType,
//         calc_area: generateCalcArea()
//     };
// }

// form

const ANSWER = {
    SUCCESS: '1',
    FAIL: '2',
    EDIT: '3'
};

function selectAnswer(value) {
    if (Number(form.value.answer) === value) {
        form.value.answer = 0;
    } else {
        form.value.answer = value;
    }
}

const hasSuccessStatus = computed(() => form.value.answer === ANSWER.SUCCESS);
const hasFailStatus = computed(() => form.value.answer === ANSWER.FAIL);
const needEditing = computed(() => form.value.answer === ANSWER.EDIT);
</script>
