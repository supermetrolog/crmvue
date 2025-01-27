<template>
    <div class="messenger-quiz__content">
        <MessengerQuizFormDisabledWindow
            v-if="disabled"
            @suggest-contact="$emit('suggest-create-contact')"
        />
        <Loader v-if="isLoading" />
        <template v-else>
            <MessengerQuizQuestionCall
                v-for="contact in selectedContacts"
                :key="contact.entity.id"
                ref="selectedContactsEls"
                v-model:form="contact.form"
                @toggle-call-schedule="$emit('toggle-call-schedule', contact.entity)"
                :contact="contact.entity"
                class="messenger-quiz__question"
            />
            <AnimationTransition v-if="contacts.length && selectedContacts.length" :speed="0.5">
                <MessengerQuizFormContactSuggestButton
                    v-if="contactCanBeSuggested"
                    @click="suggestNextContact"
                />
            </AnimationTransition>
            <component
                :is="currentTemplateComponent"
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
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerQuizFormObjectTemplate from '@/components/Messenger/Quiz/Form/MessengerQuizFormObjectTemplate.vue';
import MessengerQuizFormCompanyTemplate from '@/components/Messenger/Quiz/Form/MessengerQuizFormCompanyTemplate.vue';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import Loader from '@/components/common/Loader.vue';
import { quizQuestionsGroups } from '@/const/quiz.js';
import { messenger } from '@/const/messenger.js';
import MessengerQuizQuestionCall from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionCall.vue';
import MessengerQuizFormContactSuggestModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactSuggestModal.vue';
import MessengerQuizFormDisabledWindow from '@/components/Messenger/Quiz/Form/MessengerQuizFormDisabledWindow.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerQuizFormContactSuggestButton from '@/components/Messenger/Quiz/Form/MessengerQuizFormContactSuggestButton.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';

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
    }
});

const TEMPLATES = {
    object: MessengerQuizFormObjectTemplate,
    company: MessengerQuizFormCompanyTemplate,
    request: MessengerQuizFormObjectTemplate
};

const store = useStore();
const quizForm = useTemplateRef('quizForm');

const isLoading = ref(false);

const currentTemplateComponent = computed(() => TEMPLATES[store.state.Messenger.currentDialogType]);

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
    return quizForm.value?.getForm();
};

defineExpose({
    getForm,
    validate() {
        return selectedContactsEls.value.every(element => element.validate());
    }
});

// contacts suggest

const selectedContactsUnavailable = computed(() => {
    return selectedContacts.value.every(element => {
        if (isNullish(element.form.available)) return false;
        if (element.form.available) return isNotNullish(element.form.action);
        return true;
    });
});

const contactCanBeSuggested = computed(
    () => availableContactsCount.value > 0 && selectedContactsUnavailable.value
);

const suggestModalIsVisible = ref(false);

function suggestNextContact() {
    if (!availableContactsCount.value) return;
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
    selectedContacts.value.every(element => element.form.available === false)
);

const formIsDisabled = computed(() => {
    return (
        props.disabled ||
        !props.contacts.length ||
        (allSelectedContactsIsNegative.value && !availableContactsCount.value)
    );
});

const selectedContactsEls = useTemplateRef('selectedContactsEls');
</script>
