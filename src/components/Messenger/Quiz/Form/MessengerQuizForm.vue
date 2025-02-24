<template>
    <div class="messenger-quiz__content">
        <Spinner v-if="isLoading" small label="Загрузка вопросов.." />
        <template v-else>
            <MessengerQuizFormDisabledWindow
                v-if="disabled"
                @suggest-contact="$emit('suggest-create-contact')"
            />
            <MessengerQuizFormRemainingWindow
                v-else-if="!canBeCreated"
                @edit="editSurvey"
                :last-survey="lastSurvey"
            />
            <template v-else>
                <MessengerQuizQuestionCall
                    v-for="contact in selectedContacts"
                    :key="contact.entity.id"
                    ref="selectedContactsEls"
                    v-model:form="contact.form"
                    @set-as-unavailable="setContactAsUnavailable(contact)"
                    @skip="suggestNextContact"
                    @toggle-call-schedule="$emit('toggle-call-schedule', contact.entity)"
                    :contact="contact.entity"
                    class="messenger-quiz__question"
                />
                <div
                    v-if="isObjectQuestionGroup"
                    class="messenger-quiz__question messenger-quiz-question"
                >
                    <Checkbox v-model="withRelated" class="messenger-quiz__related">
                        <div class="messenger-quiz__related-text">
                            <span>Заполнить по всем объектам собственника</span>
                            <i
                                v-tippy="
                                    'Для каждого объекта собственника будет создан опросник и соответствующие задачи при необходимости.'
                                "
                                class="fa-regular fa-question-circle fs-4"
                            />
                        </div>
                    </Checkbox>
                </div>
            </template>
            <MessengerQuizFormTemplate
                ref="quizForm"
                :questions="filteredQuestions"
                :disabled="formIsDisabled"
                :with-related
            />
        </template>
        <MessengerQuizFormContactSuggestModal
            v-model:visible="suggestModalIsVisible"
            @suggest="$emit('suggest-create-contact')"
            @selected="selectNextContact"
            :contacts="availableContacts"
        />
        <MessengerQuizFormContactUnavailableModal
            v-model:visible="unavailableModalIsVisible"
            v-model:form="currentUnavailableForm"
            @confirm="confirmUnavailableContact"
            @cancel="cancelUnavailableContact"
        />
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { quizEffectKinds, quizQuestionsGroups } from '@/const/quiz.js';
import { messenger } from '@/const/messenger.js';
import MessengerQuizQuestionCall from '@/components/Messenger/Quiz/Question/Call/MessengerQuizQuestionCall.vue';
import MessengerQuizFormContactSuggestModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactSuggestModal.vue';
import MessengerQuizFormDisabledWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormDisabledWindow.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import MessengerQuizFormContactUnavailableModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactUnavailableModal.vue';
import MessengerQuizFormTemplate from '@/components/Messenger/Quiz/Form/MessengerQuizFormTemplate.vue';
import MessengerQuizFormRemainingWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormRemainingWindow.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Spinner from '@/components/common/Spinner.vue';
import Checkbox from '@/components/common/Forms/Checkbox.vue';

const contactModel = defineModel('contact');
const selectedContacts = defineModel('selected-contacts');

const emit = defineEmits([
    'suggest-create-contact',
    'toggle-call-schedule',
    'select-next-contact',
    'change-last-contact'
]);

const props = defineProps({
    disabled: Boolean,
    contacts: {
        type: Array,
        default: () => []
    },
    availableContacts: {
        type: Array,
        required: true
    },
    canBeDisabled: {
        type: Boolean,
        default: true
    },
    canBeCreated: Boolean,
    lastSurvey: Object
});

const store = useStore();
const quizForm = useTemplateRef('quizForm');

const isLoading = ref(false);

const currentQuestionGroup = computed(() => {
    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.COMPANY)
        return quizQuestionsGroups.COMPANY;

    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.REQUEST)
        return quizQuestionsGroups.COMPANY;

    if (
        store.state.Messenger.currentDialog.model.type ===
        messenger.objectChatMemberTypes.RENT_OR_SALE
    )
        return quizQuestionsGroups.OBJECT;

    return quizQuestionsGroups.COMPANY;
});

const isObjectQuestionGroup = computed(
    () => currentQuestionGroup.value === quizQuestionsGroups.OBJECT
);

const questions = computed(() => store.state.Quizz.questions);

const filteredQuestions = computed(() =>
    questions.value.filter(question => question.group === currentQuestionGroup.value)
);

const fetchQuestions = async () => {
    isLoading.value = true;
    await store.dispatch('fetchQuestions');
    isLoading.value = false;
};

onMounted(() => {
    if (!questions.value?.length) fetchQuestions();
});

const withRelated = ref(false);

const getForm = () => {
    const form = quizForm.value?.getForm();

    if (currentQuestionGroup.value === quizQuestionsGroups.COMPANY) return form;

    // objects group

    const relatedAnswers = {
        objects: {},
        offers: []
    };

    const freeAreaMustBeEditAnswer = form.find(answer =>
        answer.effects.has(quizEffectKinds.OBJECT_FREE_AREA_MUST_BE_EDIT)
    );

    if (freeAreaMustBeEditAnswer && freeAreaMustBeEditAnswer.value) {
        const filteredOffers = freeAreaMustBeEditAnswer.form.offers.reduce(
            (acc, offer) => {
                const payload = {
                    id: offer.id,
                    comment: offer.form.comment
                };

                if (offer.form.action === 0) acc.deleted.push(payload);
                if (offer.form.action === 1) acc.edited.push(payload);
                if (offer.form.action === 2) acc.skipped.push(payload);

                return acc;
            },
            { deleted: [], edited: [], skipped: [] }
        );

        freeAreaMustBeEditAnswer.form.objects.forEach(object => {
            relatedAnswers.objects[object.id] = {
                answer: object.answer
            };
        });

        relatedAnswers.offers.push(filteredOffers);
    }

    const wantsToSellMustBeEditAnswer = form.find(answer =>
        answer.effects.has(quizEffectKinds.COMPANY_WANTS_TO_SELL_MUST_BE_EDITED)
    );

    if (wantsToSellMustBeEditAnswer && wantsToSellMustBeEditAnswer.value) {
        const filteredOffers = wantsToSellMustBeEditAnswer.form.offers.reduce(
            (acc, offer) => {
                const payload = {
                    id: offer.id,
                    comment: offer.form.comment
                };

                if (offer.form.action === 0) acc.deleted.push(payload);
                if (offer.form.action === 1) acc.edited.push(payload);
                if (offer.form.action === 2) acc.skipped.push(payload);

                return acc;
            },
            { deleted: [], edited: [], skipped: [] }
        );

        wantsToSellMustBeEditAnswer.form.objects.forEach(object => {
            if (relatedAnswers.objects[object.id]) {
                Object.assign(relatedAnswers.objects[object.id].answer, object.answer);
            } else {
                relatedAnswers.objects[object.id] = {
                    answer: object.answer
                };
            }
        });

        relatedAnswers.offers.push(filteredOffers);
    }

    const companiesIdentifiedAnswer = form.find(answer =>
        answer.effects.has(quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED)
    );

    if (companiesIdentifiedAnswer && companiesIdentifiedAnswer.form?.objects?.length) {
        companiesIdentifiedAnswer.form.objects.forEach(object => {
            if (relatedAnswers.objects[object.id]) {
                Object.assign(relatedAnswers.objects[object.id].answer, object.answer);
            } else {
                relatedAnswers.objects[object.id] = {
                    answer: object.answer
                };
            }
        });
    }

    return {
        answers: form,
        isCanceled: formIsDisabled.value,
        relatedAnswers,
        withRelated: withRelated.value
    };
};

defineExpose({
    getForm,
    validate() {
        return (
            selectedContactsEls.value.every(element => element.validate()) &&
            (formIsDisabled.value || quizForm.value?.validate())
        );
    }
});

// contacts suggest

const selectedContactsUnavailableOrSkipped = computed(() => {
    return selectedContacts.value.every(element => {
        if (isNullish(element.form.available)) return element.form.skipped;
        if (element.form.available) return isNotNullish(element.form.action);
        return true;
    });
});

const contactCanBeSuggested = computed(
    () => availableContactsCount.value > 0 && selectedContactsUnavailableOrSkipped.value
);

const suggestModalIsVisible = ref(false);

function suggestNextContact() {
    if (!availableContactsCount.value || !contactCanBeSuggested.value) return;
    suggestModalIsVisible.value = true;
}

function selectNextContact(contact) {
    emit('select-next-contact', contact);
    suggestModalIsVisible.value = false;
}

// unavailable contacts

const unavailableModalIsVisible = ref(false);
const currentUnavailableForm = ref(null);

function setContactAsUnavailable(contact) {
    currentUnavailableForm.value = contact;

    unavailableModalIsVisible.value = true;
}

function cancelUnavailableContact() {
    unavailableModalIsVisible.value = false;
    currentUnavailableForm.value = null;
}

function confirmUnavailableContact() {
    unavailableModalIsVisible.value = false;
    suggestNextContact();
}

// available contacts

const availableContactsCount = computed(
    () => props.contacts.length - selectedContacts.value.length
);

watch(
    () => contactModel.value?.id,
    () => {
        if (contactCanBeSuggested.value) {
            emit('select-next-contact', contactModel.value);
        } else {
            emit('change-last-contact', contactModel.value);
        }
    }
);

const allSelectedContactsIsNegativeOrSkipped = computed(() =>
    selectedContacts.value.every(
        element => element.form.available === false || element.form.skipped
    )
);

const formIsDisabled = computed(() => {
    return (
        props.disabled ||
        !props.contacts.length ||
        (allSelectedContactsIsNegativeOrSkipped.value && !availableContactsCount.value)
    );
});

const selectedContactsEls = useTemplateRef('selectedContactsEls');

// edit

const { show: showSurvey } = useAsyncPopup('surveyPreview');

function editSurvey() {
    showSurvey({ surveyId: props.lastSurvey.id, editMode: true });
}
</script>
