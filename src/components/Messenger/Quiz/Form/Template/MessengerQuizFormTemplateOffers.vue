<template>
    <div class="messenger-quiz-question">
        <div class="messenger-quiz-question__header">
            <p
                v-if="offers.length"
                class="messenger-quiz-question__title"
                :class="{ disabled: disabled }"
            >
                2. Актуальны ли эти ({{ offers.length }}) текущие предложения?
            </p>
            <p v-else class="messenger-quiz-question__title disabled">
                2. У клиента нет предложений..
            </p>
        </div>
        <AccordionSimple v-if="offers.length" opened class="mt-1">
            <template #title="{ opened }">
                <AccordionSimpleTriggerButton
                    v-if="!opened"
                    :label="`Предложения клиента (${offers.length})`"
                />
                <span v-else></span>
            </template>
            <template #body>
                <div class="d-flex gap-1 px-1 pt-1">
                    <UiButton @click="markAllAsNotProcessed" small color="white">
                        Отметить все "Не опросил"
                    </UiButton>
                    <UiButton @click="markAllAsWithoutChanges" small color="white">
                        Отметить все "Без изменений"
                    </UiButton>
                    <UiButton @click="clearAll" small color="white" icon="fa-solid fa-sync">
                        Сбросить ответы
                    </UiButton>
                </div>
                <div
                    class="messenger-quiz-question__list messenger-quiz-question__offers px-1 mt-1"
                >
                    <MessengerQuizFormTemplateOfferMix
                        v-for="offerMix in offers"
                        :key="offerMix.object_id"
                        ref="offerEls"
                        @show-preview="openPreview(offerMix.offers[0].object.photo ?? [])"
                        :offer-mix="offerMix"
                        :questions
                    />
                </div>
                <AccordionSimpleTriggerButton
                    class="mt-1"
                    :label="`Скрыть предложения (${offers.length})`"
                />
            </template>
        </AccordionSimple>
    </div>
</template>
<script setup>
import { useTemplateRef } from 'vue';
import MessengerQuizFormTemplateOfferMix from '@/components/Messenger/Quiz/Form/Template/OfferMix/MessengerQuizFormTemplateOfferMix.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getLinkFile } from '@/utils/url.js';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    offers: {
        type: Array,
        required: true
    }
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

function markAllAsWithoutChanges() {
    setAllAnswers(3);
}

function markAllAsNotProcessed() {
    setAllAnswers(2);
}

function clearAll() {
    setAllAnswers(null);
}

// preview

const { preview } = usePreviewer();

function openPreview(photos) {
    preview(photos.map((photo, key) => ({ src: getLinkFile(photo), id: key })));
}
</script>
