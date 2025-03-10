<template>
    <div class="messenger-quiz-template position-relative">
        <Spinner v-if="isLoading" small label="Загрузка предложений и запросов.." />
        <template v-else-if="companyId">
            <MessengerQuizFormTemplateOffers
                ref="offersEl"
                class="messenger-quiz__question"
                :questions="objectGroupQuestions"
                :offers
                :disabled
            />
            <MessengerQuizFormTemplateRequests
                ref="requestsEl"
                class="messenger-quiz__question"
                :requests
                :disabled
            />
        </template>
        <MessengerQuizQuestion
            v-for="(question, key) in companyGroupQuestions"
            :key="question.id"
            ref="questionEls"
            :question="question"
            :disabled
            class="messenger-quiz__question"
            :number="4 + key"
        />
        <MessengerQuizFormUnavailableWindow v-if="!isLoading && !hasAvailableContact" />
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
import MessengerQuizFormUnavailableWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormUnavailableWindow.vue';

const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    hasAvailableContact: Boolean,
    companyId: Number
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

// form

function getForm() {
    const offersForm = offersEl.value.getForm();
    const requestsForm = requestsEl.value.getForm();

    const answers = questionEls.value
        .map(element => element.getForm())
        .filter(isNotNullish)
        .flat();

    const offersActualQuestion = props.questions.find(question => question.template === 'offers');
    const requestsActualQuestion = props.questions.find(
        question => question.template === 'requests'
    );

    if (offersActualQuestion && offersActualQuestion.answers.custom) {
        const offersActualQuestionAnswer = offersActualQuestion.answers.custom[0];

        answers.push({
            question_answer_id: offersActualQuestionAnswer.id,
            value: offersForm.map(offerMix => ({
                object_id: offerMix.object_id,
                offers: offerMix.offers.map(offer => ({
                    visual_id: offer.visual_id,
                    id: offer.id,
                    deal_type: offer.deal_type,
                    calc_area: offer.calc_area
                })),
                answer: offerMix.answer
            }))
        });
    }

    if (requestsActualQuestion && requestsActualQuestion.answers.custom) {
        const requestsActualQuestionAnswer = requestsActualQuestion.answers.custom[0];

        answers.push({
            question_answer_id: requestsActualQuestionAnswer.id,
            value: requestsForm
        });
    }

    return { answers, offersAnswers: offersForm };
}

function validate() {
    const offersIsValid = !offers.value.length || offersEl.value.validate();
    if (!offersIsValid) return false;

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

const offers = ref([]);
const requests = ref([]);
const objects = ref([]);

const isLoading = ref(false);

async function fetchOffersAndObjects() {
    isLoading.value = true;

    const [offersResponse, objectsResponse, requestsResponse] = await Promise.allSettled([
        fetchOffers(),
        fetchObjects(),
        fetchRequests()
    ]);

    if (offersResponse?.value?.data?.length) {
        offers.value = Object.values(
            offersResponse.value.data.reduce((acc, offer) => {
                if (acc[offer.object_id]) acc[offer.object_id].offers.push(offer);
                else {
                    acc[offer.object_id] = {
                        object_id: offer.object_id,
                        offers: [offer]
                    };
                }

                return acc;
            }, {})
        );
    }

    if (objectsResponse?.value?.data?.length) {
        objects.value = objectsResponse.value.data;
    }

    if (requestsResponse.value?.length) {
        requests.value = requestsResponse.value;
    }

    isLoading.value = false;
}

async function fetchObjects() {
    return api.object.list({ company_id: props.companyId });
}

async function fetchOffers() {
    return api.offers.search({
        company_id: props.companyId,
        type_id: [2, 3],
        status: 1,
        expand:
            'contact.emails,contact.phones,' +
            'object,' +
            'company.mainContact.phones,company.mainContact.emails,company.objects_count,company.requests_count,company.active_contacts_count,' +
            'offer,' +
            'consultant.userProfile',
        'per-page': 0
    });
}

async function fetchRequests() {
    return await api.request.byCompanyId(props.companyId);
}

onMounted(async () => {
    await fetchOffersAndObjects();

    processQueueJobs();
});
</script>
