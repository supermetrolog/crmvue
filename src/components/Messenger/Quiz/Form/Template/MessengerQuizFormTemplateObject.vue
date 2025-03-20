<template>
    <div class="messenger-quiz-form-template-offer">
        <div class="messenger-quiz-form-template-offer__row">
            <SurveyQuestionObject
                @show-preview="$emit('show-preview')"
                @object-sold="$emit('object-sold')"
                @object-destroyed="$emit('object-destroyed')"
                @open="$emit('open')"
                :object
                class="messenger-quiz-form-template-offer__preview"
                :class="{ passive: isPassive, active: isActive }"
            />
            <div class="messenger-quiz-form-template-offer__aside">
                <MessengerQuizFormRadioChip
                    v-if="hasAnswers === 1"
                    @click="hasAnswers = null"
                    unselect
                    :value="1"
                    class="dashboard-bg-success text-white"
                    label="Опросил"
                >
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <i class="fa-solid fa-check fs-3" />
                        <span>Опросил</span>
                    </div>
                </MessengerQuizFormRadioChip>
                <MessengerQuizFormRadioChip
                    v-else
                    v-model="hasAnswers"
                    unselect
                    :value="1"
                    label="К вопросам"
                />
                <MessengerQuizFormRadioChip
                    v-model="hasAnswers"
                    unselect
                    :value="2"
                    label="Не опросил"
                    class="messenger-quiz-question__no-answer"
                />
                <MessengerQuizFormRadioChip
                    v-model="hasAnswers"
                    unselect
                    :value="3"
                    label="Без изменений"
                />
            </div>
        </div>
        <UiModal
            v-model:visible="modalIsVisible"
            @close="cancel"
            :width="1300"
            custom-close
            :close-on-press-esc="false"
            :close-on-outside-click="false"
            :title="`Просмотр объекта #${object.id}, ${object.address}`"
        >
            <Carousel :title="`Объект #${object.id}`" :slides />
            <div class="d-flex mt-2">
                <MessengerDialogObjectPreview
                    class="messenger-quiz-form-template-offer__panel"
                    :object
                />
                <div class="messenger-quiz-form-template-offer__questions">
                    <SurveyQuestionObjectOffersTabs
                        class="messenger-quiz-form-template-offer__offers"
                        :offers="object.offerMix"
                    />
                    <p class="font-weight-semi fs-4">Вопросы по объекту:</p>
                    <div class="d-flex gap-2">
                        <UiButton @click="setAllAnswers(false, 'Нет')" small color="white">
                            Отметить все "Нет"
                        </UiButton>
                        <UiButton @click="setAllAnswers(null, 'Не ответил')" small color="white">
                            Отметить все "Не ответил"
                        </UiButton>
                        <UiButton
                            @click="resetAllAnswers"
                            small
                            color="white"
                            icon="fa-solid fa-sync"
                        >
                            Сбросить ответы
                        </UiButton>
                    </div>
                    <MessengerQuizQuestion
                        v-for="(question, key) in questions"
                        :key="question.id"
                        ref="questionEls"
                        :question="question"
                        class="messenger-quiz-question-card"
                        :number="key + 1"
                    />
                    <div class="d-flex gap-2">
                        <UiButton
                            @click="submit"
                            icon="fa-solid fa-check"
                            color="success-light"
                            bolder
                        >
                            Сохранить ответы
                        </UiButton>
                        <UiButton
                            v-if="currentAnswers"
                            @click="clear"
                            icon="fa-solid fa-trash"
                            color="light"
                            bolder
                        >
                            Очистить ответы
                        </UiButton>
                        <UiButton @click="cancel" icon="fa-solid fa-ban" color="light" bolder>
                            Отмена
                        </UiButton>
                    </div>
                </div>
            </div>
            <template #actions>
                <UiButton @click="submit" icon="fa-solid fa-check" color="success-light" bolder>
                    Сохранить ответы
                </UiButton>
                <UiButton
                    v-if="currentAnswers"
                    @click="clear"
                    icon="fa-solid fa-trash"
                    color="light"
                    bolder
                >
                    Очистить ответы
                </UiButton>
                <UiButton @click="cancel" icon="fa-solid fa-ban" color="light" bolder>
                    Отмена
                </UiButton>
            </template>
        </UiModal>
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/Question/MessengerQuizQuestion.vue';
import { computed, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerQuizFormRadioChip from '@/components/Messenger/Quiz/Form/MessengerQuizFormRadioChip.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import SurveyQuestionObject from '@/components/Survey/QuestionOfferMix/SurveyQuestionObject.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import Carousel from '@/components/common/Carousel.vue';
import MessengerDialogObjectPreview from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreview.vue';
import { getLinkFile } from '@/utils/url.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import SurveyQuestionObjectOffersTabs from '@/components/Survey/QuestionOfferMix/SurveyQuestionObjectOffersTabs.vue';

const emit = defineEmits(['show-preview', 'object-sold', 'object-destroyed', 'open', 'changed']);
const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    object: {
        type: Object,
        required: true
    }
});

// questions

const questionEls = useTemplateRef('questionEls');

// form

const hasAnswers = ref(null);

const isActive = computed(() => hasAnswers.value === 1 || hasAnswers.value === 3);
const isPassive = computed(() => hasAnswers.value === 2);

function getForm() {
    const payload = {
        object_id: props.object.id,
        offers: props.object.offerMix.map(offer => ({
            id: offer.id,
            deal_type: offer.deal_type,
            calc_area: offer.calc_area_general
        })),
        answer: hasAnswers.value
    };

    if (hasAnswers.value === 1) {
        payload.form = currentAnswers.value;
    }

    return payload;
}

function getLocaleForm() {
    const form = questionEls.value.map(element => element.getForm());
    return form.filter(isNotNullish).flat();
}

const notify = useNotify();

function validate() {
    if (props.disabled) return true;

    if (hasAnswers.value === 1) {
        const isValid = questionEls.value.every(element => element.validate());

        if (!isValid) notify.info(`Заполните все вопросы по предложению #${props.object.id}`);

        return isValid;
    }

    const isValid = isNotNullish(hasAnswers.value);

    if (!isValid) notify.info(`Заполните положение по предложению #${props.object.id}`);

    return isValid;
}

function setForm(form) {
    // form.forEach((question, key) => {
    //     questionEls.value[key].setForm(question);
    // });
}

function setAnswer(answer) {
    hasAnswers.value = answer;
}

function checkHasAnswer() {
    return isNotNullish(hasAnswers.value);
}

function getAnswer() {
    return hasAnswers.value;
}

defineExpose({ getForm, validate, setForm, setAnswer, hasAnswer: checkHasAnswer, getAnswer });

// modal

watch(hasAnswers, value => {
    emit('changed', value);
    if (value === 1) openModal();
});

const modalIsVisible = ref(false);

const slides = shallowRef([]);

const currentAnswers = ref(null);

function openModal() {
    if (!slides.value.length) {
        if (props.object.photo?.length) {
            if (props.object.thumb) {
                slides.value = [{ id: 0, src: props.object.thumb }];
            }

            slides.value = [
                ...slides.value,
                ...props.object.photo
                    .filter(element =>
                        props.object.thumb ? !props.object.thumb.includes(element) : true
                    )
                    .map((element, key) => ({ id: key + 1, src: getLinkFile(element) }))
            ];
        }
    }

    modalIsVisible.value = true;
}

const { confirm } = useConfirm();

async function submit() {
    const isValid = validate();
    if (!isValid) return;

    currentAnswers.value = getLocaleForm();

    modalIsVisible.value = false;
}

async function clear() {
    const confirmed = await confirm({
        title: 'Очистить ответы',
        message: 'Ответы на вопросы будут очищены',
        okButton: 'Да, очистить',
        okIcon: 'fa-solid fa-trash'
    });

    if (!confirmed) return;

    hasAnswers.value = false;
    currentAnswers.value = null;
    modalIsVisible.value = false;
}

function cancel() {
    if (!currentAnswers.value) {
        hasAnswers.value = null;
    }

    modalIsVisible.value = false;
    currentAnswers.value = null;
}

// actions

async function setAllAnswers(value, label = null) {
    const confirmed = await confirm(
        `Отметить все "${label}"`,
        'Ответы на все вопросы по предложению будут перезаписаны'
    );

    if (!confirmed) return;

    questionEls.value.map(element => element.setAnswer(value));
}

async function resetAllAnswers() {
    const confirmed = await confirm({
        title: 'Очистить ответы',
        message: 'Ответы на вопросы будут очищены',
        okButton: 'Да, очистить',
        okIcon: 'fa-solid fa-trash'
    });

    if (!confirmed) return;

    questionEls.value.map(element => element.resetAnswer());
}
</script>
