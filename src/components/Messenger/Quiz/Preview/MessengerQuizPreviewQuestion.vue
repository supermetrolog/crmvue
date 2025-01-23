<template>
    <div class="messenger-quiz-question">
        <div class="messenger-quiz-question__header">
            <i
                v-if="hasFullAnswer"
                class="fa-solid fa-circle-check color-success animate__animated animate__tada"
            ></i>
            <i
                v-else-if="hasMainQuestion && mainQuestionAnswer !== null"
                class="fa-solid fa-circle-exclamation color-warning animate__animated animate__pulse"
            ></i>
            <i
                v-else
                class="fa-solid fa-circle-exclamation color-danger animate__animated animate__flash"
            ></i>
            <p class="messenger-quiz-question__title">
                {{ question.text }}
            </p>
            <div v-if="hasMainQuestion" class="d-flex gap-1">
                <Chip
                    html="Да"
                    :class="{
                        'dashboard-bg-success text-white':
                            Boolean(mainQuestionAnswer) && isNotNullish(mainQuestionAnswer)
                    }"
                />
                <Chip
                    html="Нет"
                    :class="{
                        'dashboard-bg-success text-white':
                            !Boolean(mainQuestionAnswer) && isNotNullish(mainQuestionAnswer)
                    }"
                />
                <Chip
                    html="Не ответил"
                    :class="{
                        'dashboard-bg-success text-white': isNullish(mainQuestionAnswer)
                    }"
                />
            </div>
            <p v-else>Без ответа</p>
        </div>
        <div v-if="hasTabQuestions" class="messenger-quiz-question__additions">
            <Chip
                v-for="addition in question.answers.tab"
                :key="addition.id"
                :html="addition.value"
                class="mr-1"
                :class="{
                    'dashboard-bg-success text-white': Boolean(addition.surveyQuestionAnswer?.value)
                }"
            />
        </div>
        <div v-if="hasTextQuestions">
            <slot name="textarea" :answers="question.answers['text-answer']">
                <Textarea
                    v-for="addition in question.answers['text-answer']"
                    :key="addition.id"
                    disabled
                    :model-value="
                        addition.surveyQuestionAnswer?.value?.length
                            ? addition.surveyQuestionAnswer?.value
                            : '-'
                    "
                    :label="addition.value"
                    class="messenger-quiz-question__field mt-1"
                    :class="{ disabled: !addition.surveyQuestionAnswer?.value?.length }"
                    :auto-height="addition.surveyQuestionAnswer?.value?.length"
                />
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
        <div class="d-flex flex-column mt-2">
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
import Textarea from '@/components/common/Forms/Textarea.vue';
import Chip from '@/components/common/Chip.vue';
import { computed } from 'vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerChatMessageAdditionsTask from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditionsTask.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const hasFullAnswer = computed(() =>
    Object.values(props.question.answers).every(element => {
        if (element == null) return false;
        if (Array.isArray(element)) return element.length;
        if (typeof element === 'string') return element.length;
        if (typeof element === 'object') {
            return Object.values(element).every(_element => {
                if (typeof _element === 'string') return _element.length;
                return _element != null;
            });
        }

        return true;
    })
);

const hasMainQuestion = computed(() => Boolean(props.question.answers['yes-no']));
const hasTabQuestions = computed(() => Boolean(props.question.answers.tab));
const hasTextQuestions = computed(() => Boolean(props.question.answers['text-answer']));
const hasCheckboxQuestions = computed(() => Boolean(props.question.answers.checkbox));

const mainQuestionAnswer = computed(() => {
    if (props.question.answers['yes-no'][0].surveyQuestionAnswer)
        return props.question.answers['yes-no'][0].surveyQuestionAnswer.value;
    return null;
});

const tasks = computed(() => {
    return Object.keys(props.question.answers).reduce((acc, answerKey) => {
        const answerTasks = props.question.answers[answerKey].reduce((acc_, answer) => {
            if (answer.surveyQuestionAnswer.tasks?.length) {
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
