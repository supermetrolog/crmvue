<template>
    <div class="messenger-quiz-question messenger-quiz-preview-question">
        <div class="messenger-quiz-question__header">
            <i v-if="mainQuestionIcon" :class="mainQuestionIcon" />
            <p
                class="messenger-quiz-question__title"
                :class="{ 'text-through': hasMainQuestion && hasUnknownAnswer }"
            >
                {{ question.text }}
            </p>
            <Chip v-if="hasMainQuestion" :class="mainQuestionClass">
                {{ mainQuestionText }}
            </Chip>
        </div>
        <div
            v-if="hasTabQuestions && selectedTabAnswers.length"
            class="messenger-quiz-question__additions gap-1 mt-1"
        >
            <Chip
                v-for="addition in selectedTabAnswers"
                :key="addition.id"
                :html="addition.value"
                class="mr-1 dashboard-bg-success-l"
            />
        </div>
        <div v-if="hasTextQuestions && filledTextAnswers.length" class="mt-1">
            <slot name="textarea" :answers="question.answers['text-answer']">
                <p
                    v-for="addition in filledTextAnswers"
                    :key="addition.id"
                    class="messenger-quiz-preview-question__description"
                >
                    {{ addition.surveyQuestionAnswer?.value }}
                </p>
            </slot>
        </div>
        <div
            v-if="hasCheckboxQuestions && selectedCheckboxes.length"
            class="d-flex gap-1 flex-wrap mt-1"
        >
            <Chip
                v-for="interest in selectedCheckboxes"
                :key="interest.id"
                :html="interest.value"
                class="dashboard-bg-success text-white"
            />
        </div>
        <div v-if="hasCustomQuestions" class="text-left">
            <slot name="custom">
                <SurveyCardCustom :question />
            </slot>
        </div>
        <div v-if="hasFilesQuestions && fileAnswers.length" class="mt-1">
            <div v-for="answer in fileAnswers" :key="answer.id">
                <div v-if="answer.surveyQuestionAnswer?.files?.length" class="row">
                    <File
                        v-for="file in answer.surveyQuestionAnswer?.files"
                        :key="file.id"
                        :file="file"
                        read-only
                        class="col-2"
                    />
                </div>
            </div>
        </div>
        <div v-if="tasks.length" class="d-flex flex-column mt-2">
            <MessengerChatMessageAdditionsTask
                v-for="task in tasks"
                :key="task.id"
                :addition="task"
                :show-tags="false"
                class="messenger-quiz-question__task"
            />
        </div>
    </div>
</template>
<script setup>
import Chip from '@/components/common/Chip.vue';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerChatMessageAdditionsTask from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsTask.vue';
import File from '@/components/common/Forms/File.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import SurveyCardCustom from '@/components/SurveyCard/SurveyCardCustom.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const hasMainQuestion = computed(() => Boolean(props.question.answers['yes-no']));

const mainQuestionAnswer = computed(() => {
    if (hasMainQuestion.value && props.question.answers['yes-no'][0].surveyQuestionAnswer)
        return props.question.answers['yes-no'][0].surveyQuestionAnswer.value;
    return null;
});

const mainQuestionText = computed(() => {
    if (Boolean(mainQuestionAnswer.value) && isNotNullish(mainQuestionAnswer.value)) return 'Да';
    if (!mainQuestionAnswer.value && isNotNullish(mainQuestionAnswer.value)) return 'Нет';
    return 'Не ответил';
});

const mainQuestionClass = computed(() => {
    if (Boolean(mainQuestionAnswer.value) && isNotNullish(mainQuestionAnswer.value))
        return 'dashboard-bg-success text-white';
    if (!mainQuestionAnswer.value && isNotNullish(mainQuestionAnswer.value))
        return 'dashboard-bg-danger text-white';
    return 'dashboard-bg-light';
});

const mainQuestionIcon = computed(() => {
    if (Boolean(mainQuestionAnswer.value) && isNotNullish(mainQuestionAnswer.value))
        return 'fa-solid fa-circle-check color-success';
    if (!mainQuestionAnswer.value && isNotNullish(mainQuestionAnswer.value))
        return 'fa-solid fa-circle-exclamation color-danger';
    return null;
});

const hasUnknownAnswer = computed(() => isNullish(mainQuestionAnswer.value));

// tabs

const hasTabQuestions = computed(() => Boolean(props.question.answers.tab));

const selectedTabAnswers = computed(() => {
    return props.question.answers.tab.filter(element => element.surveyQuestionAnswer?.value);
});

// checkboxes

const hasCheckboxQuestions = computed(() => Boolean(props.question.answers.checkbox));

const selectedCheckboxes = computed(() => {
    return props.question.answers.checkbox.filter(element => element.surveyQuestionAnswer?.value);
});

// task

const tasks = computed(() => {
    return Object.keys(props.question.answers).reduce((acc, answerKey) => {
        const answerTasks = props.question.answers[answerKey].reduce((acc_, answer) => {
            if (answer.surveyQuestionAnswer?.tasks?.length) {
                acc_.push(...answer.surveyQuestionAnswer.tasks);
            }

            return acc_;
        }, []);

        if (answerTasks.length) {
            acc.push(...answerTasks);
        }

        return acc;
    }, []);
});

// text

const hasTextQuestions = computed(() => Boolean(props.question.answers['text-answer']));

const filledTextAnswers = computed(() => {
    return props.question.answers['text-answer'].filter(
        element => element.surveyQuestionAnswer?.value
    );
});

// files

const hasFilesQuestions = computed(() => Boolean(props.question.answers.files));

const fileAnswers = computed(() => {
    return props.question.answers.files.filter(
        element => element.surveyQuestionAnswer?.files?.length
    );
});

// custom

const hasCustomQuestions = computed(() => Boolean(props.question.answers.custom));
</script>
