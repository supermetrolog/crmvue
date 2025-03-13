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
                v-if="offers.length"
                ref="offersEl"
                @object-sold="$emit('object-sold', $event)"
                @object-destroyed="$emit('object-destroyed', $event)"
                class="messenger-quiz__question"
                :questions="objectGroupQuestions"
                :offers
                :disabled
                :first-offer-opened="isObjectChatMember"
            />
            <MessengerQuizFormTemplateRequests
                v-if="requests.length"
                ref="requestsEl"
                class="messenger-quiz__question"
                :requests
                :disabled
                :number="offers.length ? 3 : 2"
            />
        </template>
        <MessengerQuizQuestion
            v-for="(question, key) in companyGroupQuestions"
            :key="question.id"
            ref="questionEls"
            :question="question"
            :disabled
            class="messenger-quiz__question"
            :number="questionsOffset + key"
        />
        <MessengerQuizFormUnavailableWindow
            v-if="canBeCreated && !isLoading && !hasAvailableContact"
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
import MessengerQuizFormUnavailableWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormUnavailableWindow.vue';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';

defineEmits(['object-sold', 'object-destroyed']);
const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    hasAvailableContact: Boolean,
    canBeCreated: Boolean,
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

const questionsOffset = computed(() => {
    return [offers.value.length ? 1 : 0, requests.value.length ? 1 : 0, 2].reduce(
        (acc, n) => acc + n
    );
});

// form

function getForm() {
    const answers = questionEls.value
        .map(element => element.getForm())
        .filter(isNotNullish)
        .flat();

    const offersForm = offers.value.length ? offersEl.value.getForm() : [];

    if (offers.value.length) {
        const offersActualQuestion = props.questions.find(
            question => question.template === 'offers'
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

const store = useStore();

const isObjectChatMember = computed(() => {
    if (isNotNullish(store.state.Messenger.currentDialogType)) {
        return store.state.Messenger.currentDialogType === messenger.dialogTypes.OBJECT;
    }

    return false;
});

const offers = ref([]);
const requests = ref([]);

const isLoading = ref(false);

async function fetchOffersAndRequests() {
    isLoading.value = true;

    const [offersResponse, requestsResponse] = await Promise.allSettled([
        fetchOffers(),
        fetchRequests()
    ]);

    if (offersResponse?.value?.data?.length) {
        const formattedOffers = Object.values(
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

        if (isObjectChatMember.value) {
            const currentObjectId = store.state.Messenger.currentDialog.model.object_id;

            offers.value = formattedOffers
                .filter(offer => offer.object_id === currentObjectId)
                .concat(formattedOffers.filter(offer => offer.object_id !== currentObjectId));
        } else {
            offers.value = formattedOffers;
        }
    }

    if (requestsResponse.value?.data?.length) {
        requests.value = requestsResponse.value.data;
    }

    isLoading.value = false;
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
            'offer,',
        'per-page': 0
    });
}

async function fetchRequests() {
    return await api.request.search({ company_id: props.companyId, status: 1 });
}

onMounted(async () => {
    if (props.companyId && props.canBeCreated) {
        await fetchOffersAndRequests();
        processQueueJobs();
    }
});
</script>
