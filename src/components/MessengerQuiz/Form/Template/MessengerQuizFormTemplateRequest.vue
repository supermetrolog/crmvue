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
import SurveyQuestionRequest from '@/components/Survey/QuestionRequest/SurveyQuestionRequest.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';

defineEmits(['edit']);

defineProps({
    request: {
        type: Object,
        required: true
    },
    disabled: Boolean,
    editable: Boolean
});

const form = defineModel({ type: Object });

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
