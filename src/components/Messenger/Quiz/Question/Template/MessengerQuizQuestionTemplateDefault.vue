<template>
    <div class="messenger-quiz-question">
        <div class="messenger-quiz-question__header">
            <MessengerQuizQuestionPrimaryIcon v-if="isDisabled" />
            <MessengerQuizQuestionSuccessIcon v-else-if="hasFullAnswer || isCustomCompleted" />
            <MessengerQuizQuestionWarningIcon v-else-if="form.main != null" />
            <MessengerQuizQuestionDangerIcon v-else />
            <p class="messenger-quiz-question__title">
                <span>{{ question.text }}</span>
            </p>
            <div v-if="question.answers?.['yes-no']" class="messenger-quiz-question__main">
                <RadioChip
                    v-model="form.main"
                    :disabled="disabled || disabledByTemplate"
                    :value="true"
                    unselect
                    label="Да"
                />
                <RadioChip
                    v-model="form.main"
                    :disabled="disabled || disabledByTemplate"
                    :value="false"
                    unselect
                    label="Нет"
                />
                <RadioChip
                    v-model="hasNullMainAnswer"
                    :value="true"
                    :disabled="disabled || disabledByTemplate"
                    unselect
                    class="messenger-quiz-question__no-answer"
                    label="Не ответил"
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
            >
                <template v-if="question.answers?.['text-answer'] && !isDisabled">
                    <div v-for="answer in texts" :key="answer.id" class="position-relative">
                        <Textarea
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
                :value="answer.id"
                :text="answer.value"
                :disabled="isDisabled"
            />
        </div>
        <slot name="after-content" :disabled="isDisabled" />
    </div>
</template>
<script setup>
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import MessengerQuizQuestionSuccessIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionSuccessIcon.vue';
import MessengerQuizQuestionDangerIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionDangerIcon.vue';
import MessengerQuizQuestionWarningIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionWarningIcon.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerQuizQuestionPrimaryIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionPrimaryIcon.vue';
import { useNotify } from '@/utils/use/useNotify.js';

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
    }
});

const disabledByTemplate = ref(false);
const hiddenByTemplate = ref(false);

function toggleDisabled() {
    disabledByTemplate.value = !disabledByTemplate.value;
}

function toggleHidden() {
    hiddenByTemplate.value = !hiddenByTemplate.value;
}

const form = reactive({});
const accordion = useTemplateRef('accordion');

const hasNullMainAnswer = ref(false);

watch(hasNullMainAnswer, value => {
    if (value) form.main = null;
});

watch(
    () => form.main,
    value => {
        if (isNotNullish(value)) hasNullMainAnswer.value = false;
    }
);

const hasMainAnswer = computed(() => isNotNullish(form.main));

const hasFullAnswer = computed(() => {
    if (isNullish(form.main)) return false;

    if (hasTabQuestions.value && isEmptyArray(form.tab) && isNullish(form.radio)) return false;

    if (hasTextQuestions.value && Object.values(form.description).every(isEmpty)) return false;

    // May be something expressions here if needed

    return true;
});

const hasMainQuestion = computed(() => Boolean(props.question.answers?.['yes-no']));
const hasTabQuestions = computed(() => Boolean(props.question.answers?.tab));
const hasTextQuestions = computed(() => Boolean(props.question.answers?.['text-answer']));
const hasCheckboxQuestions = computed(() => Boolean(props.question.answers?.checkbox));

const checkboxTabs = computed(() => tabs.value.filter(element => element.field_id === 2));
const radioTabs = computed(() => tabs.value.filter(element => element.field_id === 4));

// tabs

function checkAnswerIsNotIgnored(answer) {
    return answer.effects.every(effect => !props.ignoredEffects.has(effect.kind));
}

const tabs = computed(() =>
    props.question.answers.tab.filter(
        element => element.deleted_at === null && checkAnswerIsNotIgnored(element)
    )
);

// other

const texts = computed(() =>
    props.question.answers['text-answer'].filter(element => element.deleted_at === null)
);
const checkboxes = computed(() =>
    props.question.answers.checkbox.filter(element => element.deleted_at === null)
);

const isDisabled = computed(() => {
    return (
        props.disabled ||
        ((form.main === false || hasNullMainAnswer.value) && props.canBeDisabled) ||
        disabledByTemplate.value
    );
});

const initForm = () => {
    if (hasMainQuestion.value) form.main = undefined;

    if (hasTabQuestions.value) {
        form.tab = [];
        form.radio = null;
    }

    if (hasTextQuestions.value)
        form.description = props.question.answers['text-answer'].reduce((acc, element) => {
            acc[element.id] = '';
            return acc;
        }, {});

    if (hasCheckboxQuestions.value) form.checkbox = [];
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
}

watch(
    () => props.question,
    () => {
        initForm();
    }
);

watch(isDisabled, () => {
    accordion.value?.toggle();
});

const getForm = () => {
    const list = [];

    if (hasMainQuestion.value)
        list.push({
            question_answer_id: props.question.answers['yes-no'][0].id,
            value: hasNullMainAnswer.value ? null : isNullish(form.main) ? undefined : form.main,
            type: 'main',
            question_id: props.question.id,
            effects: new Set(
                props.question.answers['yes-no'][0].effects.map(element => element.kind)
            )
        });

    if (hasTabQuestions.value) {
        const answers = props.question.answers.tab.map(element => ({
            question_answer_id: element.id,
            value:
                !hasNullMainAnswer.value &&
                (form.tab.some(_element => Number(_element) === element.id) ||
                    element.id === Number(form.radio)),
            question_id: props.question.id,
            effects: new Set(element.effects.map(element => element.kind))
        }));

        list.push(...answers);
    }

    if (hasTextQuestions.value) {
        const answers = props.question.answers['text-answer'].map(element => {
            const data = {
                question_answer_id: element.id,
                question_id: props.question.id,
                effects: new Set(element.effects.map(element => element.kind))
            };

            if (form.description[element.id]?.length && !hasNullMainAnswer.value) {
                data.value = form.description[element.id];
            }

            return data;
        });

        list.push(...answers);
    }

    if (hasCheckboxQuestions.value) {
        const answers = props.question.answers.checkbox.map(element => ({
            question_answer_id: element.id,
            value:
                !hasNullMainAnswer.value &&
                form.checkbox.some(_element => Number(_element) === element.id),
            question_id: props.question.id,
            effects: new Set(element.effects.map(element => element.kind))
        }));

        list.push(...answers);
    }

    return list;
};

initForm();

// custom

const isCustomCompleted = ref(false);

function setCustomCompleted(value) {
    isCustomCompleted.value = value;
}

// validation

const notify = useNotify();

function validate() {
    if (isNullish(form.main) && !hasNullMainAnswer.value) {
        notify.info('Вы должны ответить на все вопросы');
        return false;
    }

    return true;
}

function getMainAnswer() {
    return form.main;
}

defineExpose({ getForm, validate, setCustomCompleted, getMainAnswer, setForm });
</script>
