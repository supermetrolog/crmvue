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
                @show="showSurvey"
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
                    @schedule-call="$emit('schedule-call', contact.entity)"
                    :contact="contact.entity"
                    class="messenger-quiz__question"
                />
            </template>
            <MessengerQuizFormTemplate
                ref="quizFormEl"
                @object-sold="$emit('object-sold', $event)"
                @object-destroyed="$emit('object-destroyed', $event)"
                :questions="questions"
                :disabled="formIsDisabled"
                :has-available-contact="hasAvailableContact"
                :company-id="companyId"
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
import MessengerQuizQuestionCall from '@/components/Messenger/Quiz/Question/Call/MessengerQuizQuestionCall.vue';
import MessengerQuizFormContactSuggestModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactSuggestModal.vue';
import MessengerQuizFormDisabledWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormDisabledWindow.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import MessengerQuizFormContactUnavailableModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactUnavailableModal.vue';
import MessengerQuizFormTemplate from '@/components/Messenger/Quiz/Form/Template/MessengerQuizFormTemplate.vue';
import MessengerQuizFormRemainingWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormRemainingWindow.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Spinner from '@/components/common/Spinner.vue';
import { messenger } from '@/const/messenger.js';

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

const hasAvailableContact = computed(() =>
    selectedContacts.value.every(element => element.form.available === true)
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

const { show: _showSurvey } = useAsyncPopup('surveyPreview');

function showSurvey() {
    _showSurvey({ surveyId: props.lastSurvey.id });
}
</script>
