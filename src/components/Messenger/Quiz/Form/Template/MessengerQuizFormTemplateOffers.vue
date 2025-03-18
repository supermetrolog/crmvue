<template>
    <div
        class="messenger-quiz-question messenger-quiz-question-template-offers"
        :class="{ active: everyOfferHasAnswer }"
    >
        <div class="messenger-quiz-question__header">
            <p
                v-if="offers.length"
                class="messenger-quiz-question__title"
                :class="{ disabled: disabled }"
            >
                {{ number }}. Актуальны ли эти ({{ offers.length }}) текущие предложения?
            </p>
            <p v-else class="messenger-quiz-question__title disabled">
                {{ number }}. У клиента нет предложений..
            </p>
        </div>
        <UiField v-if="everyOfferHasAnswer" color="success-light" class="mt-1">
            <i class="fa-solid fa-check" />
            <span>Все предложения обработаны</span>
        </UiField>
        <MessengerQuizFormTemplateAccordion
            v-if="offers.length"
            ref="accordion"
            class="mt-1"
            :footer-label="`Скрыть предложения (${offers.length})`"
            :label="`Предложения клиента (${offers.length})`"
            list-class="messenger-quiz-question__offers"
        >
            <template #actions>
                <UiButton @click="markAllAsNotProcessed" small color="white">
                    Отметить все "Не опросил"
                </UiButton>
                <UiButton @click="markAllAsWithoutChanges" small color="white">
                    Отметить все "Без изменений"
                </UiButton>
                <UiButton @click="clearAll" small color="white" icon="fa-solid fa-sync">
                    Сбросить ответы
                </UiButton>
            </template>
            <template #items>
                <MessengerQuizFormTemplateOfferMix
                    v-for="offerMix in offers"
                    :key="offerMix.object_id"
                    ref="offerEls"
                    @show-preview="openPreview(offerMix.offers[0].object.photo ?? [])"
                    @object-sold="onObjectSold(offerMix)"
                    @object-destroyed="onObjectDestroyed(offerMix)"
                    @changed="onChangeOfferMixAnswer"
                    :offer-mix="offerMix"
                    :questions
                />
            </template>
        </MessengerQuizFormTemplateAccordion>
    </div>
</template>
<script setup>
import { ref, useTemplateRef, watch } from 'vue';
import MessengerQuizFormTemplateOfferMix from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateOfferMix.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getLinkFile } from '@/utils/url.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import MessengerQuizFormTemplateAccordion from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateAccordion.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { useDebounceFn } from '@vueuse/core';
import UiField from '@/components/common/UI/UiField.vue';

const emit = defineEmits(['object-sold', 'object-destroyed']);
const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    offers: {
        type: Array,
        required: true
    },
    number: Number
});

// questions

const offerEls = useTemplateRef('offerEls');

// form

function getForm() {
    if (props.questions.length) return offerEls.value.map(element => element.getForm());
    return [];
}

function validate() {
    return offerEls.value.every(element => element.validate());
}

function setForm(form) {
    const answer = form.custom?.[0]?.value;

    if (answer) {
        const answerMap = answer.reduce((acc, offer) => {
            acc[offer.object_id] = Number(offer.answer);
            return acc;
        }, {});

        props.offers.forEach((offer, key) => {
            if (answerMap[offer.object_id]) {
                offerEls.value[key].setAnswer(answerMap[offer.object_id]);
            }
        });
    }
}

defineExpose({ getForm, validate, setForm });

function setAllAnswers(value) {
    offerEls.value.map(element => element.setAnswer(value));
}

function checkHasCompletedAnswer() {
    return offerEls.value.some(element => element.getAnswer() === 1);
}

async function markAllAsWithoutChanges() {
    if (checkHasCompletedAnswer()) {
        const confirmed = await confirm(
            'Отметить все "Без изменений"',
            'Вы уверены, что хотите пометить все предложения "Без изменений"? Заполненные вопросы по объектам будут очищены.'
        );

        if (!confirmed) return;
    }

    setAllAnswers(3);
}

async function markAllAsNotProcessed() {
    if (checkHasCompletedAnswer()) {
        const confirmed = await confirm(
            'Отметить все "Не опросил"',
            'Вы уверены, что хотите пометить все предложения "Не опросил"? Заполненные вопросы по объектам будут очищены.'
        );

        if (!confirmed) return;
    }

    setAllAnswers(2);
}

const { confirm } = useConfirm();

async function clearAll() {
    const confirmed = await confirm(
        'Сбросить ответы',
        'Вы уверены, что хотите сбросить все ответы по предложениям?'
    );

    if (confirmed) setAllAnswers(null);
}

// preview

const { preview } = usePreviewer();

function openPreview(photos) {
    preview(photos.map((photo, key) => ({ src: getLinkFile(photo), id: key })));
}

// object

function generateObjectEmittedPayload(offerMix) {
    return {
        id: offerMix.object_id,
        company_name: getCompanyShortName(offerMix.offers[0].company, offerMix.offers[0].company_id)
    };
}

function onObjectSold(offerMix) {
    emit('object-sold', generateObjectEmittedPayload(offerMix));
}

function onObjectDestroyed(offerMix) {
    emit('object-destroyed', generateObjectEmittedPayload(offerMix));
}

const everyOfferHasAnswer = ref(false);

function checkEveryOfferHasAnswer() {
    return offerEls.value.every(element => element.hasAnswer());
}

const onChangeOfferMixAnswer = useDebounceFn(() => {
    everyOfferHasAnswer.value = checkEveryOfferHasAnswer();
}, 50);

// close accordion

const accordionEl = useTemplateRef('accordion');

watch(everyOfferHasAnswer, value => {
    if (value) accordionEl.value.close();
});
</script>
