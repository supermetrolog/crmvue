<template>
    <div class="messenger-quiz__content">
        <Spinner v-if="isLoading" small label="Загрузка вопросов.." />
        <template v-else>
            <AnimationTransition :speed="0.4">
                <MessengerQuizFormWarningNoContacts
                    v-if="disabled"
                    @suggest-create-contact="$emit('suggest-create-contact')"
                />
                <MessengerQuizFormWarningAlreadyCreated
                    v-else-if="!canBeCreated"
                    @show="showSurvey"
                    @schedule-call="scheduleContactsCall"
                    :last-survey="lastSurvey"
                />
            </AnimationTransition>
            <div class="d-flex flex-column my-2 gap-2">
                <MessengerQuizQuestionCall
                    v-for="(contact, key) in selectedContacts"
                    :key="contact.entity.id"
                    ref="selectedContactsEls"
                    v-model:form="contact.form"
                    @schedule-call="$emit('schedule-call', contact.entity, companyName)"
                    :contact="contact.entity"
                    class="messenger-quiz__question"
                    :number="key + 1"
                />
                <AnimationTransition :speed="0.4">
                    <UiButton
                        v-if="selectedContactsUnavailable && availableContacts.length > 0"
                        @click="suggestNextContact"
                        icon="fa-solid fa-user-plus"
                        color="success-light"
                        center
                        bolder
                        class="mx-auto"
                    >
                        Выбрать другой контакт для звонка
                    </UiButton>
                </AnimationTransition>
            </div>
            <MessengerQuizFormTemplate
                ref="quizFormEl"
                @object-sold="$emit('object-sold', $event)"
                @object-destroyed="$emit('object-destroyed', $event)"
                :questions="questions"
                :disabled="formIsDisabled"
                :has-available-contact="hasAvailableContact"
                :company-id="companyId"
                :can-be-created="canBeCreated && !disabled"
                :start-question-number="selectedContacts.length + 1"
            />
        </template>
        <MessengerQuizFormContactSuggestModal
            v-model:visible="suggestModalIsVisible"
            @suggest="$emit('suggest-create-contact')"
            @selected="selectNextContact"
            :contacts="availableContacts"
        />
        <UiModal
            v-model:visible="contactPickerIsVisible"
            title="Выбор контакта для звонка"
            :width="1200"
        >
            <DashboardChip class="dashboard-bg-warning-l mb-2 mx-auto w-auto text-center">
                Выберите контакта для запланированного звонка.
            </DashboardChip>
            <MessengerQuizContacts
                @selected="selectedContact = $event"
                label="Список контактов"
                :contacts="contacts"
                grid
            />
            <template #actions="{ close }">
                <UiButton
                    @click="scheduleCall"
                    uppercase
                    bolder
                    :disabled="!selectedContact"
                    color="success"
                    icon="fa-solid fa-check"
                >
                    Сохранить
                </UiButton>
                <UiButton @click="close" uppercase bolder color="light" icon="fa-solid fa-ban">
                    Отмена
                </UiButton>
            </template>
        </UiModal>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import MessengerQuizQuestionCall from '@/components/Messenger/Quiz/Question/Call/MessengerQuizQuestionCall.vue';
import MessengerQuizFormContactSuggestModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactSuggestModal.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import MessengerQuizFormTemplate from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplate.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Spinner from '@/components/common/Spinner.vue';
import { messenger } from '@/const/messenger.js';
import MessengerQuizContacts from '@/components/Messenger/Quiz/MessengerQuizContacts.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import MessengerQuizFormWarningNoContacts from '@/components/Messenger/Quiz/Form/Warning/MessengerQuizFormWarningNoContacts.vue';
import MessengerQuizFormWarningAlreadyCreated from '@/components/Messenger/Quiz/Form/Warning/MessengerQuizFormWarningAlreadyCreated.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const contactModel = defineModel('contact');
const selectedContacts = defineModel('selected-contacts');

const emit = defineEmits([
    'suggest-create-contact',
    'schedule-call',
    'select-next-contact',
    'change-last-contact',
    'object-sold',
    'object-destroyed'
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

const companyName = computed(() => {
    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.COMPANY) {
        return getCompanyShortName(store.state.Messenger.currentDialog.model);
    }

    return getCompanyShortName(store.state.Messenger.currentPanel);
});

const companyId = computed(() => {
    if (store.state.Messenger.currentDialogType === messenger.dialogTypes.COMPANY)
        return Number(store.state.Messenger.currentDialog.model_id);

    return store.state.Messenger.currentDialog.model.object.company_id;
});

const quizFormEl = useTemplateRef('quizFormEl');

const isLoading = ref(false);

// questions

const questions = computed(() => store.state.Quizz.questions);

const fetchQuestions = async () => {
    isLoading.value = true;
    await store.dispatch('fetchQuestions');
    isLoading.value = false;
};

onMounted(() => {
    if (!questions.value?.length) fetchQuestions();
});

// form

function getForm() {
    const { answers, offersAnswers } = quizFormEl.value.getForm();

    return {
        answers,
        offersAnswers,
        isCanceled: formIsDisabled.value
    };
}

defineExpose({
    getForm,
    validate() {
        return (
            selectedContactsEls.value.every(element => element.validate()) &&
            (formIsDisabled.value || quizFormEl.value.validate())
        );
    }
});

// contacts suggest

const selectedContactsUnavailable = computed(() => {
    return selectedContacts.value.every(element => {
        if (element.form.available === true) return element.form.reason !== 1;
        return element.form.available === false;
    });
});

const contactCanBeSuggested = computed(
    () => availableContactsCount.value > 0 && selectedContactsUnavailable.value
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

const allSelectedContactsIsNegative = computed(() =>
    selectedContacts.value.every(
        element => isNotNullish(element.form.available) && element.form.reason !== 1
    )
);

const hasAvailableContact = computed(() =>
    selectedContacts.value.some(
        element => element.form.available === true && element.form.reason === 1
    )
);

const formIsDisabled = computed(() => {
    return (
        props.disabled ||
        !props.contacts.length ||
        (allSelectedContactsIsNegative.value && !availableContactsCount.value)
    );
});

const selectedContactsEls = useTemplateRef('selectedContactsEls');

// edit

const { show: _showSurvey } = useAsyncPopup('surveyPreview');

function showSurvey() {
    _showSurvey({ surveyId: props.lastSurvey.id });
}

// schedule call

const contactPickerIsVisible = ref(false);
const selectedContact = shallowRef(null);

function scheduleContactsCall() {
    contactPickerIsVisible.value = true;
}

function scheduleCall() {
    contactPickerIsVisible.value = false;
    emit('schedule-call', selectedContact.value, companyName.value);
}
</script>
