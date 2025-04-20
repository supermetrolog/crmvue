<template>
    <div
        class="messenger-quiz-question messenger-quiz-question-template-offers"
        :class="{ active: everyOfferHasAnswer }"
    >
        <div class="messenger-quiz-question__header">
            <template v-if="objects.length">
                <p class="messenger-quiz-question__title" :class="{ disabled: disabled }">
                    {{ number }}. Актуальны ли эти ({{ objects.length }}) текущие предложения?
                </p>
                <UiButton
                    @click="openModal(objects[0])"
                    color="white"
                    icon="fa-solid fa-up-right-from-square"
                >
                    Открыть список
                </UiButton>
            </template>
            <p v-else class="messenger-quiz-question__title disabled">
                {{ number }}. У клиента нет предложений..
            </p>
        </div>
        <UiField v-if="everyOfferHasAnswer" color="success-light" class="mt-1">
            <i class="fa-solid fa-check" />
            <span>Все предложения обработаны</span>
        </UiField>
        <MessengerQuizFormTemplateAccordion
            v-if="objects.length"
            ref="accordion"
            class="mt-1"
            :footer-label="`Скрыть предложения (${objects.length})`"
            :label="`Предложения клиента (${objects.length})`"
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
                <MessengerQuizFormTemplateObject
                    v-for="object in objects"
                    :key="object.id"
                    ref="offerEls"
                    v-model="objectsForms[object.id].hasAnswer"
                    @show-preview="openPreview(object.photo ?? [])"
                    @object-sold="onObjectSold(object)"
                    @object-destroyed="onObjectDestroyed(object)"
                    @changed="onChangeOfferMixAnswer"
                    @show-questions="openModal(object)"
                    :object="object"
                    :questions
                />
            </template>
        </MessengerQuizFormTemplateAccordion>
        <teleport to="body">
            <UiModal
                v-show="modalIsVisible"
                @close="closeModal"
                custom-close
                show
                :width="1700"
                :close-on-press-esc="false"
                :lock-scroll="false"
                title="Предложения клиента"
            >
                <div class="messenger-quiz-question-template-offers__modal">
                    <div class="messenger-quiz-question-template-offers__objects">
                        <p class="mb-1 font-weight-semi fs-3">
                            Объекты клиента ({{ objects.length }}):
                        </p>
                        <div class="messenger-quiz-question-template-offers__column">
                            <div
                                v-for="object in objects"
                                :key="object.id"
                                class="messenger-quiz-question-template-offers__object"
                            >
                                <SurveyQuestionObject
                                    @show-preview="openPreview(object.photo ?? [])"
                                    @object-sold="onObjectSold(object)"
                                    @object-destroyed="onObjectDestroyed(object)"
                                    @click="changeQuestionsObject(object)"
                                    :object="object"
                                    class="messenger-quiz-question-template-offers__object-preview"
                                    :class="{ active: currentObject?.id === object.id }"
                                />
                                <AnimationTransition :speed="0.4">
                                    <i
                                        v-if="objectsForms[object.id].valid"
                                        class="fa-solid fa-circle-check messenger-quiz-question-template-offers__icon"
                                        :class="
                                            objectsForms[object.id].hasAnswer === 1
                                                ? 'text-success'
                                                : 'text-warning'
                                        "
                                    />
                                    <i
                                        v-else-if="objectsForms[object.id].valid === false"
                                        class="fa-solid fa-circle-exclamation messenger-quiz-question-template-offers__icon text-danger"
                                    />
                                    <i
                                        v-else
                                        class="fa-regular fa-circle messenger-quiz-question-template-offers__icon text-danger"
                                    />
                                </AnimationTransition>
                            </div>
                        </div>
                    </div>
                    <div v-if="currentObject" class="w-100">
                        <p
                            class="mb-1 font-weight-semi fs-3 messenger-quiz-question-template-offers__address"
                        >
                            {{ currentObject.address ?? `Объект #${currentObject.id}` }}
                        </p>
                        <MessengerQuizFormTemplateOffersPreview
                            class="messenger-quiz-question-template-offers__preview"
                            :object="currentObject"
                        >
                            <template #questions>
                                <div class="d-flex gap-2">
                                    <UiButton
                                        @click="setAllAnswersForObject(false, 'Нет')"
                                        small
                                        color="white"
                                        :disabled="currentObjectHasDisablingAnswer"
                                    >
                                        Отметить все "Нет"
                                    </UiButton>
                                    <UiButton
                                        @click="setAllAnswersForObject(null, 'Не ответил')"
                                        small
                                        color="white"
                                        :disabled="currentObjectHasDisablingAnswer"
                                    >
                                        Отметить все "Не ответил"
                                    </UiButton>
                                    <UiButton
                                        @click="resetAllAnswersForObject"
                                        small
                                        color="white"
                                        icon="fa-solid fa-sync"
                                        :disabled="currentObjectHasDisablingAnswer"
                                    >
                                        Сбросить ответы
                                    </UiButton>
                                </div>
                                <div class="position-relative">
                                    <div
                                        v-if="currentObjectHasDisablingAnswer"
                                        class="messenger-quiz-question-template-offers__answer"
                                    >
                                        <UiField color="dark">
                                            {{ disablingAnswerLabel }}
                                        </UiField>
                                    </div>
                                    <div v-for="object in objects" :key="object.id">
                                        <div v-show="object.id === currentObject.id">
                                            <MessengerQuizQuestion
                                                v-for="(question, key) in questions"
                                                :key="question.id"
                                                :ref="
                                                    el => {
                                                        questionElsByObject[object.id][key] = el;
                                                    }
                                                "
                                                :question="question"
                                                class="messenger-quiz-question-card mb-1"
                                                :number="key + 1"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex gap-1">
                                    <UiButton
                                        @click="saveAnswers(true)"
                                        icon="fa-solid fa-check"
                                        color="success-light"
                                        :disabled="currentObjectHasDisablingAnswer"
                                    >
                                        Сохранить ответы
                                    </UiButton>
                                    <UiButton @click="setAnswer(2)" color="light">
                                        Не опросил
                                    </UiButton>
                                    <UiButton @click="setAnswer(3)" color="light">
                                        Без изменений
                                    </UiButton>
                                    <AnimationTransition :speed="0.4">
                                        <UiButton
                                            v-if="currentObjectHasDisablingAnswer"
                                            @click="setAnswer(null)"
                                            icon="fa-solid fa-ban"
                                            color="danger-light"
                                        >
                                            Отменить выбор
                                        </UiButton>
                                    </AnimationTransition>
                                </div>
                            </template>
                        </MessengerQuizFormTemplateOffersPreview>
                    </div>
                </div>
                <template #actions="{ close }">
                    <UiButton @click="close" icon="fa-solid fa-check" color="success-light" bolder>
                        Сохранить все ответы
                    </UiButton>
                </template>
            </UiModal>
        </teleport>
    </div>
</template>
<script setup>
import { computed, ref, shallowRef, useTemplateRef, watch } from 'vue';
import MessengerQuizFormTemplateObject from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateObject.vue';
import { usePreviewer } from '@/composables/usePreviewer.js';
import { getLinkFile } from '@/utils/url.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import MessengerQuizFormTemplateAccordion from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateAccordion.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useDebounceFn } from '@vueuse/core';
import UiField from '@/components/common/UI/UiField.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerQuizFormTemplateOffersPreview from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplateOffersPreview.vue';
import SurveyQuestionObject from '@/components/Survey/QuestionOfferMix/SurveyQuestionObject.vue';
import MessengerQuizQuestion from '@/components/Messenger/Quiz/Question/MessengerQuizQuestion.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const emit = defineEmits(['object-sold', 'object-destroyed']);
const props = defineProps({
    questions: {
        type: Array,
        required: true
    },
    disabled: Boolean,
    objects: {
        type: Array,
        required: true
    },
    number: Number
});

// questions

const offerEls = useTemplateRef('offerEls');

// form

function getForm() {
    if (props.questions.length) {
        const offersForm = offerEls.value.map(element => element.getForm());

        for (const offer of offersForm) {
            if (offer.answer === 1) {
                offer.form = Object.values(questionElsByObject.value[offer.object_id])
                    .map(element => element.getForm())
                    .flat();
            }
        }

        return offersForm;
    }
    return [];
}

function validate() {
    return offerEls.value.every(element => {
        const offerFormIsValid = element.validate();

        if (!offerFormIsValid) return false;

        const objectId = element.getObjectId();
        const answer = objectsForms.value[objectId].hasAnswer;
        if (answer === 2 || answer === 3) return true;

        return Object.values(questionElsByObject.value[element.getObjectId()]).every(element =>
            element.validate()
        );
    });
}

function setForm(form) {
    const answer = form.custom?.[0]?.value;

    if (answer) {
        const answerMap = answer.reduce((acc, offer) => {
            acc[offer.object_id] = Number(offer.answer);
            return acc;
        }, {});

        props.objects.forEach((object, key) => {
            if (answerMap[object.id]) {
                offerEls.value[key].setAnswer(answerMap[object.id]);
            }
        });
    }
}

defineExpose({ getForm, validate, setForm });

function setAllAnswers(value) {
    offerEls.value.map(element => element.setAnswer(value));
}

function setAnswer(value) {
    const index = props.objects.findIndex(object => object.id === currentObject.value.id);
    if (index === -1) return;

    offerEls.value[index].setAnswer(value);
    objectsForms.value[currentObject.value.id].hasAnswer = value;
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

// objects

// TODO: Inject Company

function generateObjectEmittedPayload(object) {
    return {
        id: object.id
        // company_name: getCompanyShortName(object.company, object.company_id)
    };
}

function onObjectSold(object) {
    emit('object-sold', generateObjectEmittedPayload(object));
}

function onObjectDestroyed(object) {
    emit('object-destroyed', generateObjectEmittedPayload(object));
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

// modal

const modalIsVisible = ref(false);
const currentObject = shallowRef(null);

function openModal(object) {
    for (const form of Object.values(objectsForms.value)) {
        if (form.hasAnswer === 2 || form.hasAnswer === 3) form.valid = true;
    }

    showQuestions(object);
    modalIsVisible.value = true;
}

function showQuestions(object) {
    currentObject.value = object;
}

function changeQuestionsObject(object) {
    saveAnswers();
    showQuestions(object);
}

const objectsForms = ref(
    props.objects.reduce((acc, object) => {
        acc[object.id] = {
            valid: null,
            answer: null,
            hasAnswer: null
        };

        return acc;
    }, {})
);

const currentObjectHasDisablingAnswer = computed(() => {
    const answer = objectsForms.value[currentObject.value.id].hasAnswer;

    return answer === 2 || answer === 3;
});

const disablingAnswerLabel = computed(() => {
    const answer = objectsForms.value[currentObject.value.id].hasAnswer;

    if (answer === 2) return 'Не опросил';
    if (answer === 3) return 'Без изменений';
});

const questionElsByObject = ref(
    props.objects.reduce((acc, object) => {
        acc[object.id] = {};
        return acc;
    }, {})
);

function mapCurrentQuestions(callable) {
    return Object.values(questionElsByObject.value[currentObject.value.id]).map(callable);
}

function walkCurrentQuestions(callable) {
    for (const element of Object.values(questionElsByObject.value[currentObject.value.id])) {
        callable(element);
    }
}

async function setAllAnswersForObject(value, label = null) {
    const confirmed = await confirm(
        `Отметить все "${label}"`,
        'Ответы на все вопросы по предложению будут перезаписаны'
    );

    if (!confirmed) return;

    walkCurrentQuestions(element => element.setAnswer(value));
}

async function resetAllAnswersForObject() {
    const confirmed = await confirm({
        title: 'Очистить ответы',
        message: 'Ответы на вопросы будут очищены',
        okButton: 'Да, очистить',
        okIcon: 'fa-solid fa-trash'
    });

    if (!confirmed) return;

    walkCurrentQuestions(element => element.resetAnswer());
}

const notify = useNotify();

function validateCurrentObject(withNotify = false) {
    if (props.disabled) return true;

    if (currentObjectHasDisablingAnswer.value) return true;

    const isValid = Object.values(questionElsByObject.value[currentObject.value.id]).every(
        element => element.validate(withNotify)
    );

    if (!isValid && withNotify)
        notify.info(`Заполните все вопросы по объекту #${currentObject.value.id}`);

    return isValid;
}

function saveAnswers(withNotify = false) {
    const isValid = validateCurrentObject(withNotify);

    objectsForms.value[currentObject.value.id].valid = isValid;
    objectsForms.value[currentObject.value.id].answer = mapCurrentQuestions(element =>
        element.getForm()
    );

    if (isValid) {
        if (!currentObjectHasDisablingAnswer.value) setAnswer(1);

        if (withNotify) {
            notify.success('Ответы успешно сохранены');
        }
    }
}

function closeModal() {
    if (currentObject.value) {
        saveAnswers();
    }

    modalIsVisible.value = false;
}
</script>
