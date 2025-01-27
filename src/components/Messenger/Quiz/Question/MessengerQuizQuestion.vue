<template>
    <div class="messenger-quiz-question">
        <AccordionSimple ref="accordion" opened>
            <template #title>
                <div v-if="canEdit" class="messenger-quiz-question__actions">
                    <Button @click="$emit('edit')" small success>Редактировать</Button>
                    <Button @click="$emit('delete')" small danger>Удалить</Button>
                </div>
                <div class="messenger-quiz-question__header">
                    <MessengerQuizQuestionSuccessIcon v-if="hasFullAnswer || isDisabled" />
                    <MessengerQuizQuestionWarningIcon v-else-if="form.main != null" />
                    <MessengerQuizQuestionDangerIcon v-else />
                    <p class="messenger-quiz-question__title">
                        <span v-if="showId" class="mr-1">#{{ question.id }}</span>
                        <span>{{ question.text }}</span>
                    </p>
                    <div v-if="question.answers?.['yes-no']" class="messenger-quiz-question__main">
                        <RadioChip
                            v-model="form.main"
                            :disabled
                            :value="true"
                            label="Да"
                            unselect
                        />
                        <RadioChip
                            v-model="form.main"
                            :disabled
                            :value="false"
                            label="Нет"
                            unselect
                        />
                        <RadioChip
                            v-model="hasNullMainAnswer"
                            :value="true"
                            label="Не ответил"
                            :disabled
                            unselect
                        />
                    </div>
                    <MessengerButton
                        v-else-if="canEdit"
                        @click="$emit('add-answer', question.id, 'yes-no')"
                        color="success"
                        class="messenger-quiz-question__button"
                    >
                        <i class="fa-solid fa-plus mr-1" />
                        <span>Добавить "Да/Нет"</span>
                    </MessengerButton>
                    <AccordionSimpleTrigger />
                </div>
            </template>
            <template #body>
                <DashboardChip v-if="canEdit" class="dashboard-bg-warning-l mb-1">
                    Основные опции
                </DashboardChip>
                <div class="messenger-quiz-question__additions">
                    <slot name="additions" :disabled="isDisabled">
                        <template v-if="question.answers?.tab">
                            <CheckboxChip
                                v-for="answer in checkboxTabs"
                                :key="answer.id"
                                v-model="form.tab"
                                @icon-clicked="$emit('edit-answer', answer)"
                                handled-icon
                                :value="answer.id"
                                :text="answer.value"
                                :icon="canEdit ? 'fa-solid fa-pen' : undefined"
                                icon-label="Редактировать"
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
                        </template>
                        <slot name="after-additions" :disabled="isDisabled" />
                        <MessengerButton
                            v-if="canEdit"
                            @click="$emit('add-answer', question.id, 'tab')"
                            color="success"
                            class="messenger-quiz-question__button"
                        >
                            <i class="fa-solid fa-plus mr-1" />
                            <span>Добавить</span>
                        </MessengerButton>
                    </slot>
                </div>
                <div>
                    <slot name="description">
                        <DashboardChip v-if="canEdit" class="dashboard-bg-warning-l mt-2 mb-1">
                            Текстовые поля
                        </DashboardChip>
                        <template v-if="question.answers?.['text-answer']">
                            <div v-for="answer in texts" :key="answer.id" class="position-relative">
                                <Textarea
                                    v-model="form.description[answer.id]"
                                    :placeholder="answer.value"
                                    class="messenger-quiz-question__field"
                                    auto-height
                                    :disabled="isDisabled"
                                    :min-height="80"
                                />
                                <div v-if="canEdit" class="messenger-quiz-question__edits">
                                    <HoverActionsButton
                                        @click="$emit('edit-answer', answer)"
                                        label="Редактировать"
                                        small
                                    >
                                        <i class="fa-solid fa-pen" />
                                    </HoverActionsButton>
                                </div>
                            </div>
                        </template>
                        <MessengerButton
                            v-if="canEdit"
                            @click="$emit('add-answer', question.id, 'text-answer')"
                            color="success"
                            class="messenger-quiz-question__button mt-1 mb-2"
                        >
                            <i class="fa-solid fa-plus mr-1" />
                            <span>Добавить</span>
                        </MessengerButton>
                    </slot>
                </div>
                <DashboardChip v-if="canEdit" class="dashboard-bg-warning-l">
                    Дополнительные возможности
                </DashboardChip>
                <div
                    v-if="canEdit || question.answers?.checkbox"
                    class="messenger-quiz-question__interests"
                >
                    <template v-if="question.answers?.checkbox">
                        <CheckboxChip
                            v-for="answer in checkboxes"
                            :key="answer.id"
                            v-model="form.checkbox"
                            @icon-clicked="$emit('edit-answer', answer)"
                            handled-icon
                            :value="answer.id"
                            :text="answer.value"
                            :icon="canEdit ? 'fa-solid fa-pen' : undefined"
                            icon-label="Редактировать"
                            :disabled="isDisabled"
                        />
                    </template>
                    <MessengerButton
                        v-if="canEdit"
                        @click="$emit('add-answer', question.id, 'checkbox')"
                        color="success"
                        class="messenger-quiz-question__button"
                    >
                        <i class="fa-solid fa-plus mr-1" />
                        <span>Добавить</span>
                    </MessengerButton>
                </div>
                <slot name="after-content" :disabled="isDisabled" />
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import Button from '@/components/common/Button.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { isEmpty } from '@/utils/helpers/common/isEmpty.js';
import MessengerQuizQuestionSuccessIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionSuccessIcon.vue';
import MessengerQuizQuestionDangerIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionDangerIcon.vue';
import MessengerQuizQuestionWarningIcon from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionWarningIcon.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

defineEmits(['edit', 'delete', 'edit-answer', 'add-answer']);
const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    showId: {
        type: Boolean,
        default: false
    },
    canEdit: {
        type: Boolean,
        default: false
    },
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    disabled: Boolean
});

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

const tabs = computed(() =>
    props.question.answers.tab.filter(element => element.deleted_at === null)
);
const texts = computed(() =>
    props.question.answers['text-answer'].filter(element => element.deleted_at === null)
);
const checkboxes = computed(() =>
    props.question.answers.checkbox.filter(element => element.deleted_at === null)
);

const isDisabled = computed(() => {
    return (
        props.disabled || ((form.main === false || hasNullMainAnswer.value) && props.canBeDisabled)
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
            type: 'main'
        });

    if (hasTabQuestions.value) {
        const answers = props.question.answers.tab.map(element => ({
            question_answer_id: element.id,
            value:
                form.tab.some(_element => Number(_element) === element.id) ||
                element.id === Number(form.radio)
        }));

        list.push(...answers);
    }

    if (hasTextQuestions.value) {
        const answers = props.question.answers['text-answer'].map(element => {
            const data = {
                question_answer_id: element.id
            };

            if (form.description[element.id]?.length) {
                data.value = form.description[element.id];
            }

            return data;
        });

        list.push(...answers);
    }

    if (hasCheckboxQuestions.value) {
        const answers = props.question.answers.checkbox.map(element => ({
            question_answer_id: element.id,
            value: form.checkbox.some(_element => Number(_element) === element.id)
        }));

        list.push(...answers);
    }

    return list;
};

defineExpose({ getForm });

initForm();
</script>
