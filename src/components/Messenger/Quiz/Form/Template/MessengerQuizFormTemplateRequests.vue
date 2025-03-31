<template>
    <div class="messenger-quiz-question" :class="{ active: everyRequestHasAnswer }">
        <div class="messenger-quiz-question__header">
            <p
                v-if="requests.length"
                class="messenger-quiz-question__title"
                :class="{ disabled: disabled }"
            >
                <span>{{ number }}. </span>
                <span>Актуальны ли эти ({{ requests.length }}) текущие запросы?</span>
            </p>
            <p v-else class="messenger-quiz-question__title disabled">
                3. У клиента нет запросов..
            </p>
        </div>
        <UiField v-if="everyRequestHasAnswer" color="success-light" class="mt-1">
            <i class="fa-solid fa-check" />
            <span>Все запросы обработаны</span>
        </UiField>
        <MessengerQuizFormTemplateAccordion
            v-if="requests.length"
            ref="accordion"
            class="mt-1"
            :label="`Запросы клиента (${requests.length})`"
            :footer-label="`Скрыть запросы (${requests.length})`"
            list-class="messenger-quiz-question__requests"
        >
            <template #actions>
                <UiButton @click="setAllAnswers(true)" small color="white">
                    Отметить все "Да"
                </UiButton>
                <UiButton @click="setAllAnswers(false)" small color="white">
                    Отметить все "Нет"
                </UiButton>
                <UiButton @click="setAllAnswers(null)" small color="white">
                    Отметить все "Не ответил"
                </UiButton>
                <UiButton @click="resetAllAnswers" small color="white" icon="fa-solid fa-sync">
                    Сбросить ответы
                </UiButton>
            </template>
            <template #items>
                <MessengerQuizFormTemplateRequest
                    v-for="request in requests"
                    :key="request.id"
                    ref="requestEls"
                    @edit="editRequest(request)"
                    @change="onChangeRequestAnswer"
                    :request="request"
                    editable
                />
            </template>
        </MessengerQuizFormTemplateAccordion>
        <Teleport to="body">
            <FormCompanyRequest
                v-if="editFormIsVisible"
                @close="closeEditForm"
                @updated="updateRequest"
                :form-data="editedRequest"
            />
        </Teleport>
    </div>
</template>
<script setup>
import { ref, shallowRef, useTemplateRef, watch } from 'vue';
import MessengerQuizFormTemplateRequest from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateRequest.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { toBool } from '@/utils/helpers/string/toBool.js';
import MessengerQuizFormTemplateAccordion from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateAccordion.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import api from '@/api/api.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { useDebounceFn } from '@vueuse/core';
import UiField from '@/components/common/UI/UiField.vue';

const props = defineProps({
    requests: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    number: Number
});

// questions

const requestEls = useTemplateRef('requestEls');

// form

function getForm() {
    if (props.requests.length) return requestEls.value.map(element => element.getForm());
    return [];
}

function validate() {
    return requestEls.value.every(element => element.validate());
}

function setForm(form) {
    const answer = form.custom?.[0]?.value;

    if (answer) {
        const answerMap = answer.reduce((acc, request) => {
            acc[request.id] = {
                answer: isString(request.answer) ? toBool(request.answer) : null,
                action: request.action ? Number(request.action) : null,
                description: request.description
            };
            return acc;
        }, {});

        props.requests.forEach((request, key) => {
            if (answerMap[request.id]) {
                requestEls.value[key].setForm(answerMap[request.id]);
            }
        });
    }
}

defineExpose({ getForm, validate, setForm });

function setAllAnswers(value) {
    requestEls.value.map(element => element.setAnswer(value));
}

const { confirm } = useConfirm();

async function resetAllAnswers() {
    const confirmed = await confirm(
        'Сбросить ответы',
        'Вы уверены, что хотите сбросить все ответы по запросам?'
    );
    if (confirmed) setAllAnswers(undefined);
}

// edit

const editedRequest = shallowRef(null);
const editFormIsVisible = ref(false);

function editRequest(request) {
    editedRequest.value = request;
    editFormIsVisible.value = true;
}

function closeEditForm() {
    editFormIsVisible.value = false;
    editedRequest.value = null;
}

async function updateRequest() {
    const updatedRequest = await api.request.get(editedRequest.value.id);

    if (updatedRequest) {
        const index = props.requests.findIndex(element => element.id === updatedRequest.id);

        if (index !== -1) {
            Object.assign(props.requests[index], updatedRequest);
        }
    }

    closeEditForm();
}

// completed

const everyRequestHasAnswer = ref(false);

function checkEveryRequestHasAnswer() {
    return requestEls.value.every(element => element.hasAnswer());
}

const onChangeRequestAnswer = useDebounceFn(() => {
    everyRequestHasAnswer.value = checkEveryRequestHasAnswer();
}, 50);

// close accordion

const accordionEl = useTemplateRef('accordion');

watch(everyRequestHasAnswer, value => {
    if (value) accordionEl.value.close();
});
</script>
