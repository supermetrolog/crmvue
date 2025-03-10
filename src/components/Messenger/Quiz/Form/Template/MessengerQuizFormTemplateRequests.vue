<template>
    <div class="messenger-quiz-question">
        <div class="messenger-quiz-question__header">
            <p
                v-if="requests.length"
                class="messenger-quiz-question__title"
                :class="{ disabled: disabled }"
            >
                3. Актуальны ли эти ({{ requests.length }}) текущие запросы?
            </p>
            <p v-else class="messenger-quiz-question__title disabled">
                3. У клиента нет запросов..
            </p>
        </div>
        <AccordionSimple v-if="requests.length" opened class="mt-1">
            <template #title="{ opened }">
                <AccordionSimpleTriggerButton
                    v-if="!opened"
                    :label="`Запросы клиента (${requests.length})`"
                />
                <span v-else></span>
            </template>
            <template #body>
                <div class="d-flex gap-1 px-1 pt-1">
                    <UiButton @click="setAllAnswers(true)" small color="white">
                        Отметить все "Да"
                    </UiButton>
                    <UiButton @click="setAllAnswers(false)" small color="white">
                        Отметить все "Нет"
                    </UiButton>
                    <UiButton @click="setAllAnswers(null)" small color="white">
                        Отметить все "Не ответил"
                    </UiButton>
                    <UiButton
                        @click="setAllAnswers(undefined)"
                        small
                        color="white"
                        icon="fa-solid fa-sync"
                    >
                        Сбросить ответы
                    </UiButton>
                </div>
                <div
                    class="messenger-quiz-question__list messenger-quiz-question__requests mt-1 px-1"
                >
                    <MessengerQuizFormTemplateRequest
                        v-for="request in requests"
                        :key="request.id"
                        ref="requestEls"
                        :request="request"
                    />
                </div>
                <AccordionSimpleTriggerButton
                    class="mt-1"
                    :label="`Скрыть запросы (${requests.length})`"
                />
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import { useTemplateRef } from 'vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import MessengerQuizFormTemplateRequest from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateRequest.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { toBool } from '@/utils/helpers/string/toBool.js';

const props = defineProps({
    requests: {
        type: Array,
        required: true
    },
    disabled: Boolean
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
</script>
