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
            </template>
            <MessengerQuizFormTemplate
                ref="quizForm"
                :questions="filteredQuestions"
                :disabled="formIsDisabled"
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
import { quizQuestionsGroups } from '@/const/quiz.js';
import { messenger } from '@/const/messenger.js';
import MessengerQuizQuestionCall from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionCall.vue';
import MessengerQuizFormContactSuggestModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactSuggestModal.vue';
import MessengerQuizFormDisabledWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormDisabledWindow.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import MessengerQuizFormContactUnavailableModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactUnavailableModal.vue';
import MessengerQuizFormTemplate from '@/components/Messenger/Quiz/Form/MessengerQuizFormTemplate.vue';
import MessengerQuizFormRemainingWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormRemainingWindow.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import Spinner from '@/components/common/Spinner.vue';

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

const getForm = () => {
    return { answers: quizForm.value?.getForm(), isCanceled: formIsDisabled.value };
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
