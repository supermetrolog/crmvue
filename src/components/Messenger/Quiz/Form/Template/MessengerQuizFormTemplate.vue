<template>
    <div class="messenger-quiz-template position-relative">
        <Spinner
            v-if="isLoading"
            small
            label="Загрузка предложений и запросов.."
            class="messenger-quiz__question py-1"
        />
        <template v-else-if="companyId && canBeCreated">
            <MessengerQuizFormTemplateOffers
                v-if="objects.length"
                ref="offersEl"
                @object-sold="$emit('object-sold', $event)"
                @object-destroyed="$emit('object-destroyed', $event)"
                class="messenger-quiz-question-card mb-2"
                :questions="objectGroupQuestions"
                :objects
                :disabled
                :number="startQuestionNumber"
            />
            <MessengerQuizFormTemplateRequests
                v-if="requests.length"
                ref="requestsEl"
                class="messenger-quiz-question-card mb-2"
                :requests
                :disabled
                :number="objects.length ? startQuestionNumber + 1 : startQuestionNumber"
            />
        </template>
        <MessengerQuizQuestion
            v-for="(question, key) in companyGroupQuestions"
            :key="question.id"
            ref="questionEls"
            :question="question"
            :disabled
            class="messenger-quiz-question-card mb-2"
            :number="questionsOffset + key"
        />
        <MessengerQuizFormWarningNeedCompletedCall
            v-if="(!canBeCreated && isLoading) || (canBeCreated && !hasAvailableContact)"
        />
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/Question/MessengerQuizQuestion.vue';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { quizQuestionsGroups } from '@/const/quiz.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerQuizFormTemplateOffers from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateOffers.vue';
import MessengerQuizFormTemplateRequests from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateRequests.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';
import MessengerQuizFormWarningNeedCompletedCall from '@/components/Messenger/Quiz/Form/Warning/MessengerQuizFormWarningNeedCompletedCall.vue';

defineEmits(['object-sold', 'object-destroyed']);
const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    hasAvailableContact: Boolean,
    canBeCreated: Boolean,
    companyId: Number,
    startQuestionNumber: {
        type: Number,
        default: 1
    }
});

// questions

const questionEls = useTemplateRef('questionEls');
const offersEl = useTemplateRef('offersEl');
const requestsEl = useTemplateRef('requestsEl');

const objectGroupQuestions = computed(() =>
    props.questions.filter(question => question.group === quizQuestionsGroups.OBJECT)
);

const companyGroupQuestions = computed(() =>
    props.questions.filter(question => question.group === quizQuestionsGroups.COMPANY)
);

const questionsOffset = computed(() => {
    return (
        props.startQuestionNumber +
        Number(objects.value.length > 0) +
        Number(requests.value.length > 0)
    );
});

// form

function getForm() {
    const answers = questionEls.value
        .map(element => element.getForm())
        .filter(isNotNullish)
        .flat();

    const offersForm = objects.value.length ? offersEl.value.getForm() : [];

    if (objects.value.length) {
        const offersActualQuestion = props.questions.find(
            question => question.template === 'offers'
        );

        if (offersActualQuestion && offersActualQuestion.answers.custom) {
            const offersActualQuestionAnswer = offersActualQuestion.answers.custom[0];

            answers.push({
                question_answer_id: offersActualQuestionAnswer.id,
                value: offersForm.map(object => ({
                    object_id: object.object_id,
                    offers: object.offers.map(offer => ({
                        id: offer.id,
                        deal_type: offer.deal_type,
                        calc_area: offer.calc_area
                    })),
                    answer: object.answer
                }))
            });
        }
    }

    if (requests.value.length) {
        const requestsForm = requests.value.length ? requestsEl.value.getForm() : [];
        const requestsActualQuestion = props.questions.find(
            question => question.template === 'requests'
        );

        if (requestsActualQuestion && requestsActualQuestion.answers.custom) {
            const requestsActualQuestionAnswer = requestsActualQuestion.answers.custom[0];

            answers.push({
                question_answer_id: requestsActualQuestionAnswer.id,
                value: requestsForm
            });
        }
    }

    return { answers, offersAnswers: offersForm };
}

function validate() {
    const objectsIsValid = !objects.value.length || offersEl.value.validate();
    if (!objectsIsValid) return false;

    const requestsIsValid = !requests.value.length || requestsEl.value.validate();
    if (!requestsIsValid) return false;

    return questionEls.value.every(element => element.validate());
}

const queueJob = [];

function processQueueJobs() {
    queueJob.forEach(job => job());
    queueJob.splice(0);
}

function setForm(form) {
    companyGroupQuestions.value.forEach((question, key) => {
        questionEls.value[key].setForm(form.find(element => element.question_id === question.id));
    });

    const offersForm = form.find(element => element.question_template === 'offers');
    const requestsForm = form.find(element => element.question_template === 'requests');

    if (offersForm) {
        queueJob.push(() => offersEl.value.setForm(offersForm));
    }

    if (requestsForm) {
        queueJob.push(() => requestsEl.value.setForm(requestsForm));
    }
}

defineExpose({ getForm, validate, setForm });

// offers

const store = useStore();

const isObjectChatMember = computed(() => {
    if (isNotNullish(store.state.Messenger.currentDialogType)) {
        return store.state.Messenger.currentDialogType === messenger.dialogTypes.OBJECT;
    }

    return false;
});

const objects = ref([]);
const requests = ref([]);

const isLoading = ref(false);

async function fetchObjectsAndRequests() {
    isLoading.value = true;

    const [objectsResponse, requestsResponse] = await Promise.allSettled([
        fetchObjects(),
        fetchRequests()
    ]);

    if (objectsResponse?.value?.data?.length) {
        if (isObjectChatMember.value) {
            const currentObjectId = store.state.Messenger.currentDialog.model.object_id;

            objects.value = objectsResponse.value.data
                .filter(object => object.id === currentObjectId)
                .concat(objectsResponse.value.data.filter(object => object.id !== currentObjectId));
        } else {
            objects.value = objectsResponse.value.data;
        }
    }

    if (requestsResponse.value?.data?.length) {
        requests.value = requestsResponse.value.data;
    }

    isLoading.value = false;
}

async function fetchObjects() {
    return await api.object.list({ company_id: props.companyId, 'per-page': 0 });
}

async function fetchRequests() {
    return await api.request.search({ company_id: props.companyId, status: 1 });
}

onMounted(async () => {
    if (props.companyId && props.canBeCreated) {
        await fetchObjectsAndRequests();
        processQueueJobs();
    }
});
</script>
