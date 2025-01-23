<template>
    <div class="messenger-quiz-question">
        <div class="messenger-quiz-question__header">
            <span class="messenger-quiz-question__title">
                {{ question.text }}
            </span>
            <Chip v-if="hasMainQuestion" :class="mainQuestionClass">
                {{ mainQuestionText }}
            </Chip>
            <p v-else>Без ответа</p>
        </div>
        <div
            v-if="hasTabQuestions && selectedTabAnswers.length"
            class="messenger-quiz-question__additions"
        >
            <Chip
                v-for="addition in selectedTabAnswers"
                :key="addition.id"
                :html="addition.value"
                class="mr-1 dashboard-bg-success-l font-weight-bold"
            />
        </div>
        <div v-if="hasTextQuestions && filledTextAnswers.length">
            <slot name="textarea" :answers="question.answers['text-answer']">
                <p
                    v-for="addition in filledTextAnswers"
                    :key="addition.id"
                    class="messenger-quiz-question__description"
                >
                    {{ addition.surveyQuestionAnswer?.value }}
                </p>
            </slot>
        </div>
        <div v-if="hasCheckboxQuestions" class="messenger-quiz-question__interests">
            <Chip
                v-for="interest in question.answers.checkbox"
                :key="interest.id"
                :html="interest.value"
                :class="{
                    'dashboard-bg-success text-white': Boolean(interest.surveyQuestionAnswer?.value)
                }"
            />
        </div>
        <MessengerChatMessageAdditionsTask
            v-for="task in tasks"
            :key="task.id"
            :addition="task"
            :show-tags="false"
            class="messenger-quiz-question__task"
        />
    </div>
</template>
<script setup>
import Chip from '@/components/common/Chip.vue';
import { computed } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerChatMessageAdditionsTask from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsTask.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

//  main

const hasMainQuestion = computed(() => Boolean(props.question.answers['yes-no']));

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

// tabs

const hasTabQuestions = computed(() => Boolean(props.question.answers.tab));

const selectedTabAnswers = computed(() => {
    return props.question.answers.tab.filter(element => element.surveyQuestionAnswer?.value);
});

// text

const hasTextQuestions = computed(() => Boolean(props.question.answers['text-answer']));

const filledTextAnswers = computed(() => {
    return props.question.answers['text-answer'].filter(
        element => element.surveyQuestionAnswer?.value
    );
});

const hasCheckboxQuestions = computed(() => Boolean(props.question.answers.checkbox));

// checkbox

const mainQuestionAnswer = computed(() => {
    if (props.question.answers['yes-no'][0].surveyQuestionAnswer)
        return props.question.answers['yes-no'][0].surveyQuestionAnswer.value;
    return null;
});

// tasks

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
</script>
