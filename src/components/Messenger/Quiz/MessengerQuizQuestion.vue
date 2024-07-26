<template>
    <div class="messenger-quiz-question">
        <AccordionSimple opened>
            <template #title>
                <div class="messenger-quiz-question__header">
                    <i
                        v-if="hasFullAnswer"
                        class="fa-solid fa-circle-check color-success animate__animated animate__tada"
                    ></i>
                    <i
                        v-else-if="form.main != null"
                        class="fa-solid fa-circle-exclamation color-warning animate__animated animate__pulse"
                    ></i>
                    <i
                        v-else
                        class="fa-solid fa-circle-exclamation color-danger animate__animated animate__flash"
                    ></i>
                    <p class="messenger-quiz-question__title">
                        {{ question.text }}
                    </p>
                    <RadioGroup v-if="question.answers['yes-no']" v-model="form.main" unselect />
                    <AccordionSimpleTrigger />
                </div>
            </template>
            <template #body>
                <div v-if="question.answers.tab" class="messenger-quiz-question__additions">
                    <CheckboxChip
                        v-for="answer in question.answers.tab"
                        :key="answer.id"
                        v-model="form.tab"
                        :value="answer.id"
                        :text="answer.value"
                    />
                </div>
                <div v-if="question.answers['text-answer']">
                    <Textarea
                        v-for="answer in question.answers['text-answer']"
                        :key="answer.id"
                        v-model="form.description[answer.id]"
                        :placeholder="answer.value"
                        class="messenger-quiz-question__field"
                        auto-height
                    />
                </div>
                <div v-if="question.answers.checkbox" class="messenger-quiz-question__interests">
                    <CheckboxChip
                        v-for="answer in question.answers.checkbox"
                        :key="answer.id"
                        v-model="form.checkbox"
                        :value="answer.id"
                        :text="answer.value"
                    />
                </div>
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import RadioGroup from '@/components/common/Forms/RadioGroup.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import { computed, reactive } from 'vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const form = reactive({});

const hasFullAnswer = computed(() =>
    Object.values(form).every(element => {
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

const initForm = () => {
    if (hasMainQuestion.value) form.main = null;
    if (hasTabQuestions.value) form.tab = [];
    if (hasTextQuestions.value)
        form.description = props.question.answers['text-answer'].reduce((acc, element) => {
            acc[element.id] = '';
            return acc;
        }, {});
    if (hasCheckboxQuestions.value) form.checkbox = [];
};

const getForm = () => {
    const list = [];

    if (hasMainQuestion.value)
        list.push({
            question_answer_id: props.question.answers['yes-no'][0].id,
            value: form.main
        });

    if (hasTabQuestions.value) {
        const answers = props.question.answers.tab.map(element => ({
            question_answer_id: element.id,
            value: form.tab.some(_element => Number(_element) === element.id)
        }));

        list.push(...answers);
    }

    if (hasTextQuestions.value) {
        const answers = props.question.answers['text-answer'].map(element => ({
            question_answer_id: element.id,
            value: form.description[element.id]
        }));

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
