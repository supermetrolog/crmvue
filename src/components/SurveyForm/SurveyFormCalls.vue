<template>
    <div class="survey-form-calls p-2">
        <div class="survey-form-calls__header mb-1">
            <div class="survey-form-calls__title">Выберите контакт для разговора</div>
        </div>
        <div class="survey-form-calls__list">
            <SurveyFormContact
                v-for="contact in contacts"
                :key="contact.id"
                v-model="form[contact.id]"
                @show-comments="showComments(contact)"
                @edit="editContact(contact)"
                @select="selectCurrentContact(contact)"
                @schedule-call="createScheduleCallTask(contact)"
                @change="$emit('change')"
                @close="currentContact = null"
                :contact="contact"
                :active="currentContact?.id === contact.id"
                :most-callable="contact.id === mostCallableContactId"
                editable
                full
            />
        </div>
        <teleport to="body">
            <FormCompanyContact
                v-if="formIsVisible"
                @close="closeForm"
                @created="$emit('contact-created', $event)"
                @updated="onContactUpdated"
                :formdata="updatingContact"
                :company_id="company?.id"
            />
            <UiModal
                v-model:visible="commentsModalIsOpen"
                :title="`Просмотр комментариев (${comments.length})`"
                :width="600"
            >
                <MessengerQuizContactsComments
                    @updated="onUpdatedComment"
                    @deleted="onDeletedComment"
                    @created="onCreatedComment"
                    :comments
                    :contact="viewedCommentsContact"
                />
            </UiModal>
            <CallScheduler
                v-if="scheduleCallModalIsVisible"
                @created="onCreatedScheduledCall"
                @close="closeScheduleCallModal"
                :company="company"
                :contact="scheduleCallContact"
                :chat-member-id
                :relations="schedulerRelations"
            />
        </teleport>
    </div>
</template>
<script setup>
import { computed, ref, shallowRef, watch } from 'vue';
import SurveyFormContact from '@/components/SurveyForm/SurveyFormContact.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerQuizContactsComments from '@/components/MessengerQuiz/MessengerQuizContactsComments.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import CallScheduler from '@/components/CallScheduler/CallScheduler.vue';

const emit = defineEmits(['contact-created', 'contact-updated', 'change']);
const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    contacts: {
        type: Array,
        default: () => []
    },
    chatMemberId: {
        type: Number,
        required: true
    },
    surveyId: Number
});

const mostCallableContactId = computed(() => {
    let currentMaxIndex = 0;

    for (let i = 0; i < props.contacts.length; i++) {
        if (props.contacts[i].calls?.length > props.contacts[currentMaxIndex].calls.length) {
            currentMaxIndex = i;
        }
    }

    return props.contacts[currentMaxIndex].id;
});

const form = defineModel({ type: Object, default: () => ({}) });

function generateForm() {
    for (const contact of props.contacts) {
        if (!(contact.id in form.value)) {
            form.value[contact.id] = {
                available: null,
                scheduled: null,
                contact_id: contact.id,
                full_name: contact.full_name
            };
        }
    }
}

watch(() => props.contacts.length, generateForm, { immediate: true });

// select

const currentContact = ref(null);

function selectCurrentContact(contact) {
    if (currentContact.value?.id === contact.id) {
        currentContact.value = null;
    } else {
        currentContact.value = contact;
    }
}

// edit

const updatingContact = shallowRef(null);
const formIsVisible = ref(false);

function editContact(contact) {
    updatingContact.value = contact;
    formIsVisible.value = true;
}

function closeForm() {
    formIsVisible.value = false;
    updatingContact.value = null;
}

function onContactUpdated(_, contact) {
    emit('contact-updated', contact);
}

// comments

const viewedCommentsContact = shallowRef(null);
const comments = shallowRef([]);
const commentsModalIsOpen = ref(false);

function showComments(contact) {
    viewedCommentsContact.value = contact;

    comments.value = contact.comments;
    commentsModalIsOpen.value = true;
}

function onDeletedComment(commentId) {
    spliceById(comments.value, commentId);
}

function onUpdatedComment(comment) {
    const commentIndex = comments.value.findIndex(element => element.id === comment.id);
    if (commentIndex !== -1) Object.assign(comments.value[commentIndex], comment);
}

function onCreatedComment(comment) {
    comments.value.push(comment);
}

// scheduled calls
const scheduleCallModalIsVisible = ref(false);
const scheduleCallContact = shallowRef(null);

async function createScheduleCallTask(contact) {
    scheduleCallContact.value = contact;
    scheduleCallModalIsVisible.value = true;
}

function closeScheduleCallModal() {
    scheduleCallModalIsVisible.value = false;
    scheduleCallContact.value = null;
}

function onCreatedScheduledCall(_, payload) {
    form.value[scheduleCallContact.value.id].scheduled = payload.start;
}

const schedulerRelations = computed(() => {
    if (props.surveyId) {
        return [{ entity_type: 'survey', entity_id: props.surveyId }];
    }

    return [];
});
</script>
