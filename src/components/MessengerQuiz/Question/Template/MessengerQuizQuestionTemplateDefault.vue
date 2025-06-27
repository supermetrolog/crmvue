<template>
    <div
        class="messenger-quiz-question"
        :class="{ active: hasMainAnswer, passive: hasNullMainAnswer }"
    >
        <div class="messenger-quiz-question__header">
            <p class="messenger-quiz-question__title" :class="{ disabled: isDisabled }">
                <span v-if="number">{{ number }}. </span>
                <span>{{ question.text }}</span>
            </p>
            <div v-if="question.answers?.['yes-no']" class="messenger-quiz-question__main">
                <MessengerQuizFormRadioChip
                    v-model="form.main"
                    :disabled="disabled || disabledByTemplate"
                    :value="true"
                    unselect
                    label="Да"
                />
                <MessengerQuizFormRadioChip
                    v-model="form.main"
                    :disabled="disabled || disabledByTemplate"
                    :value="false"
                    unselect
                    label="Нет"
                />
            </div>
        </div>
        <div v-show="hasMainAnswer" class="messenger-quiz-question__additions">
            <slot name="additions" :disabled="isDisabled" :main-answer="form.main">
                <slot
                    name="before-additions"
                    :disabled="isDisabled"
                    :main-answer="form.main"
                    :toggle-disabled="toggleDisabled"
                    :toggle-hidden="toggleHidden"
                    :hidden="hiddenByTemplate"
                    :set-main-answer="setMainAnswer"
                    :set-completed="setCustomCompleted"
                />
                <div
                    v-if="question.answers?.tab && !isDisabled && !hiddenByTemplate"
                    class="d-flex my-1"
                >
                    <CheckboxChip
                        v-for="answer in checkboxTabs"
                        :key="answer.id"
                        v-model="form.tab"
                        :value="answer.id"
                        :text="answer.value"
                        class="mr-1"
                        show-checkbox
                        :disabled="isDisabled"
                    />
                    <RadioChip
                        v-for="answer in radioTabs"
                        :key="answer.id"
                        v-model="form.radio"
                        :value="answer.id"
                        :label="answer.value"
                        unselect
                        :disabled="isDisabled"
                    />
                </div>
                <slot name="after-additions" :disabled="isDisabled" />
            </slot>
        </div>
        <div v-if="(hasMainAnswer && !hiddenByTemplate) || !canBeHidden">
            <slot
                name="description"
                :disabled="isDisabled"
                :main-answer="form.main"
                :toggle-disabled="toggleDisabled"
                :set-main-answer="setMainAnswer"
            >
                <template v-if="question.answers?.['text-answer'] && !isDisabled">
                    <div v-for="answer in texts" :key="answer.id" class="position-relative">
                        <UiTextarea
                            v-model="form.description[answer.id]"
                            :placeholder="answer.value"
                            class="messenger-quiz-question__field"
                            auto-height
                            :disabled="isDisabled"
                            :min-height="80"
                        />
                    </div>
                </template>
            </slot>
        </div>
        <div
            v-show="hasMainAnswer && !hiddenByTemplate && !isDisabled"
            v-if="question.answers?.checkbox"
            class="messenger-quiz-question__interests"
        >
            <CheckboxChip
                v-for="answer in checkboxes"
                :key="answer.id"
                v-model="form.checkbox"
                handled-icon
                show-checkbox
                :value="answer.id"
                :text="answer.value"
                :disabled="isDisabled"
            />
        </div>
        <AccordionSimple
            v-if="hasFilesQuestions"
            v-show="hasMainAnswer && !hiddenByTemplate && !isDisabled"
            class="mt-2"
            :class="{ 'mb-2': $slots['after-content'] }"
        >
            <template #title>
                <AccordionSimpleTriggerButton
                    icon="fa-regular fa-file"
                    label="Файлы и изображения"
                />
            </template>
            <template #body>
                <FileInput
                    v-for="answer in filesFields"
                    :key="answer.id"
                    v-model:data="form.files[answer.id].old"
                    v-model:native="form.files[answer.id].new"
                    short
                />
            </template>
        </AccordionSimple>
        <slot name="after-content" :disabled="isDisabled" :main-answer="form.main" />
    </div>
</template>
<script setup>
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { computed, reactive, ref, watch } from 'vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { useNotify } from '@/utils/use/useNotify.js';
import FileInput from '@/components/common/Forms/FileInput.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import MessengerQuizFormRadioChip from '@/components/MessengerQuiz/Form/MessengerQuizFormRadioChip.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    canBeHidden: {
        type: Boolean,
        default: true
    },
    disabled: Boolean,
    ignoredEffects: {
        type: Set,
        default: () => new Set()
    },
    number: Number
});

const form = reactive({});

const disabledByTemplate = ref(false);
const hiddenByTemplate = ref(false);

function toggleDisabled() {
    disabledByTemplate.value = !disabledByTemplate.value;
}

function toggleHidden() {
    hiddenByTemplate.value = !hiddenByTemplate.value;
}

// main

const hasNullMainAnswer = ref(false);

const hasMainQuestion = computed(() => Boolean(props.question.answers?.['yes-no']));

const hasMainAnswer = computed(() => isNotNullish(form.main));

watch(hasNullMainAnswer, value => {
    if (value) form.main = null;
});

watch(
    () => form.main,
    value => {
        if (isNotNullish(value)) hasNullMainAnswer.value = false;
    }
);

function getMainAnswers() {
    return answersToPayload(props.question.answers['yes-no'], () => ({
        value: hasNullMainAnswer.value ? null : isNullish(form.main) ? undefined : form.main,
        type: 'main'
    }));
}

// tabs

const hasTabQuestions = computed(() => Boolean(props.question.answers?.tab));

function checkAnswerIsNotIgnored(answer) {
    return answer.effects.every(effect => !props.ignoredEffects.has(effect.kind));
}

const tabs = computed(() =>
    props.question.answers.tab.filter(
        element => element.deleted_at === null && checkAnswerIsNotIgnored(element)
    )
);

const checkboxTabs = computed(() => tabs.value.filter(element => element.field_id === 2));
const radioTabs = computed(() => tabs.value.filter(element => element.field_id === 4));

function getTabAnswers() {
    return answersToPayload(props.question.answers.tab, answer => ({
        value:
            !hasNullMainAnswer.value &&
            (form.tab.some(_element => Number(_element) === answer.id) ||
                answer.id === Number(form.radio))
    }));
}

// text

const hasTextQuestions = computed(() => Boolean(props.question.answers?.['text-answer']));

const texts = computed(() =>
    props.question.answers['text-answer'].filter(
        element => element.deleted_at === null && checkAnswerIsNotIgnored(element)
    )
);

function getTextAnswers() {
    return answersToPayload(props.question.answers['text-answer'], answer => {
        if (form.description[answer.id]?.length && !hasNullMainAnswer.value) {
            return { value: form.description[answer.id] };
        }

        return {};
    });
}

// checkbox

const hasCheckboxQuestions = computed(() => Boolean(props.question.answers?.checkbox));

const checkboxes = computed(() =>
    props.question.answers.checkbox.filter(element => element.deleted_at === null)
);

function getCheckboxAnswers() {
    return answersToPayload(checkboxes.value, answer => ({
        value:
            !hasNullMainAnswer.value &&
            form.checkbox.some(_element => Number(_element) === answer.id)
    }));
}

// files

const hasFilesQuestions = computed(() => Boolean(props.question.answers?.files));

const filesFields = computed(() =>
    props.question.answers.files.filter(element => element.deleted_at === null)
);

function getFilesAnswers() {
    return answersToPayload(filesFields.value, answer => ({
        value: form.files[answer.id].new.length > 0,
        files: form.files[answer.id].new,
        file: form.files[answer.id].new.length > 0
    }));
}

// custom

const hasCustomQuestions = computed(() => Boolean(props.question.answers?.custom));

const customFields = computed(() =>
    props.question.answers.custom.filter(element => element.deleted_at === null)
);

function getCustomAnswers() {
    return answersToPayload(customFields.value, () => ({
        value: null
    }));
}

// other

const isDisabled = computed(() => {
    return (
        props.disabled ||
        ((form.main === false || hasNullMainAnswer.value) && props.canBeDisabled) ||
        disabledByTemplate.value
    );
});

// form

function answerToPayload(answer, additional = {}) {
    return {
        question_id: props.question.id,
        question_answer_id: answer.id,
        question_group: props.question.group,
        effects: new Set(answer.effects.map(element => element.kind)),
        ...additional
    };
}

function answersToPayload(answers, prepareCallback = () => ({})) {
    return answers.map(element => answerToPayload(element, prepareCallback(element)));
}

function getForm() {
    const list = [];

    if (hasMainQuestion.value) list.push(...getMainAnswers());

    if (hasTabQuestions.value) list.push(...getTabAnswers());

    if (hasTextQuestions.value) list.push(...getTextAnswers());

    if (hasCheckboxQuestions.value) list.push(...getCheckboxAnswers());

    if (hasFilesQuestions.value) list.push(...getFilesAnswers());

    if (hasCustomQuestions.value) list.push(...getCustomAnswers());

    return list;
}

const initForm = () => {
    if (hasMainQuestion.value) form.main = undefined;

    if (hasTabQuestions.value) {
        form.tab = [];
        form.radio = null;
    }

    if (hasTextQuestions.value) {
        form.description = texts.value.reduce((acc, element) => {
            acc[element.id] = '';
            return acc;
        }, {});
    }

    if (hasCheckboxQuestions.value) form.checkbox = [];

    if (hasFilesQuestions.value) {
        form.files = filesFields.value.reduce((acc, element) => {
            acc[element.id] = {
                new: [],
                old: []
            };

            return acc;
        }, {});
    }
};

function setForm(payload) {
    if (hasMainQuestion.value && Object.hasOwn(payload, 'main')) {
        if (isNotNullish(payload.main.value)) form.main = payload.main.value;
        else hasNullMainAnswer.value = true;
    }

    if (hasTabQuestions.value && Object.hasOwn(payload, 'tab')) {
        form.tab = payload.tab.reduce((acc, element) => {
            if (element.field === 2 && element.value) acc.push(element.id);
            return acc;
        }, []);

        const radioValue = payload.tab.find(element => {
            return element.field === 4 && element.value;
        });

        if (radioValue) form.radio = radioValue.id;
    }

    if (hasTextQuestions.value && Object.hasOwn(payload, 'text-answer')) {
        form.description = payload['text-answer'].reduce((acc, element) => {
            acc[element.id] = element.value;
            return acc;
        }, {});
    }

    if (hasCheckboxQuestions.value && Object.hasOwn(payload, 'checkbox')) {
        form.checkbox = payload.checkbox.reduce((acc, element) => {
            if (element.value) acc.push(element.id);
            return acc;
        }, []);
    }

    if (hasFilesQuestions.value && Object.hasOwn(payload, 'files')) {
        form.files = payload.files.reduce((acc, element) => {
            acc[element.id] = {
                new: [],
                old: element.files?.length ? [...element.files] : []
            };

            return acc;
        }, {});
    }
}

initForm();

watch(
    () => props.question,
    () => {
        initForm();
    }
);

// custom

const isCustomCompleted = ref(false);

function setCustomCompleted(value) {
    isCustomCompleted.value = value;
}

function setMainAnswer() {
    form.main = false;
}

// validation

const notify = useNotify();

function validate(withNotify = true) {
    if (isNullish(form.main) && !hasNullMainAnswer.value) {
        if (withNotify) notify.info('Вы должны ответить на все вопросы');

        return false;
    }

    return true;
}

// expose

function getMainAnswer() {
    return form.main;
}

function setAnswer(value) {
    if (value === null) {
        form.main = undefined;
        hasNullMainAnswer.value = true;
    } else {
        form.main = value;
        hasNullMainAnswer.value = false;
    }
}

function resetAnswer() {
    hasNullMainAnswer.value = false;
    form.main = undefined;
}

defineExpose({
    validate,
    getForm,
    setForm,
    setCustomCompleted,
    getMainAnswer,
    getMainAnswers,
    getFilesAnswers,
    getTabAnswers,
    getCheckboxAnswers,
    getTextAnswers,
    setAnswer,
    resetAnswer
});
</script>
