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
        <MessengerQuizFormTemplateAccordion
            v-if="offers.length"
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
                    @open="openOfferCard(offerMix)"
                    @show-preview="openPreview(offerMix.offers[0].object.photo ?? [])"
                    @object-sold="onObjectSold(offerMix)"
                    @object-destroyed="onObjectDestroyed(offerMix)"
                    :offer-mix="offerMix"
                    :questions
                />
            </template>
        </MessengerQuizFormTemplateAccordion>
        <UiModal
            v-model:visible="offerCardIsVisible"
            :width="1000"
            :title="`Просмотр объекта #${viewedObject?.id}`"
        >
            <p class="mb-2 fs-2"><i class="fa-solid fa-earth mr-1" />{{ viewedObject.address }}</p>
            <Carousel
                :title="`Объект #${viewedObject.id}`"
                :slides="viewedObjectSlides"
                class="mb-2"
            />
            <MessengerDialogObjectPreview :object-id="viewedObject.id" />
        </UiModal>
    </div>
</template>
<script setup>
import { onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import MessengerQuizFormTemplateOfferMix from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateOfferMix.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getLinkFile } from '@/utils/url.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import MessengerQuizFormTemplateAccordion from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateAccordion.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { useConfirm } from '@/composables/useConfirm.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerDialogObjectPreview from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreview.vue';
import Carousel from '@/components/common/Carousel.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

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
    firstOfferOpened: Boolean
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

onMounted(() => {
    if (props.offers.length && props.firstOfferOpened) {
        offerEls.value[0].setAnswer(1);
    }
});

function setAllAnswers(value) {
    offerEls.value.map(element => element.setAnswer(value));
}

function markAllAsWithoutChanges() {
    setAllAnswers(3);
}

function markAllAsNotProcessed() {
    setAllAnswers(2);
}

const { confirm } = useConfirm();

async function clearAll() {
    const confirmed = await confirm('Вы уверены, что хотите сбросить все ответы по предложениям?');
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

// card

const offerCardIsVisible = ref(false);
const viewedObject = shallowRef(null);
const viewedObjectSlides = shallowRef([]);

function clearCurrentViewedObject() {
    viewedObject.value = null;
    viewedObjectSlides.value = [];
}

function openOfferCard(offerMix) {
    if (isNotNullish(viewedObject.value) && viewedObject.value.id !== offerMix.object_id) {
        clearCurrentViewedObject();
    }

    viewedObject.value = offerMix.offers[0].object;

    if (offerMix.offers[0]?.object?.photo?.length) {
        if (offerMix.offers[0].object.thumb) {
            viewedObjectSlides.value = [{ id: 0, src: offerMix.offers[0].object.thumb }];
        }

        viewedObjectSlides.value = [
            ...viewedObjectSlides.value,
            ...offerMix.offers[0].object.photo
                .filter(element =>
                    offerMix.offers[0].object.thumb
                        ? !offerMix.offers[0].object.thumb.includes(element)
                        : true
                )
                .map((element, key) => ({ id: key + 1, src: getLinkFile(element) }))
        ];
    }

    offerCardIsVisible.value = true;
}
</script>
