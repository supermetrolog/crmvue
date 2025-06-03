<template>
    <div class="survey-form-calls">
        <div class="survey-form-calls__header mb-1">
            <div class="survey-form-calls__title">Выберите контакт для разговора</div>
        </div>
        <div class="survey-form-calls__list">
            <SurveyFormContact
                v-for="(contact, key) in contacts"
                :key="contact.id"
                v-model="form[contact.id]"
                @show-comments="showComments(contact)"
                @edit="editContact(contact)"
                @select="selectCurrentContact(contact, key)"
                @schedule-call="createScheduleCallTask(contact)"
                @change="$emit('change')"
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
        </teleport>
    </div>
</template>
<script setup>
import { computed, ref, shallowRef, watch } from 'vue';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import { useNotify } from '@/utils/use/useNotify.js';
import SurveyFormContact from '@/components/SurveyForm/SurveyFormContact.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerQuizContactsComments from '@/components/MessengerQuiz/MessengerQuizContactsComments.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import api from '@/api/api.js';
import dayjs from 'dayjs';
import { useAuth } from '@/composables/useAuth.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';

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
    }
});

const mostCallableContactId = computed(() => {
    let currentMaxIndex = 0;

    for (let i = 0; i < props.contacts.length; i++) {
        if (props.contacts[i].calls.length > props.contacts[currentMaxIndex].calls.length) {
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
const currentContactKey = ref(null);

function selectCurrentContact(contact, key) {
    if (currentContact.value?.id === contact.id) {
        currentContact.value = null;
        currentContactKey.value = null;
    } else {
        currentContact.value = contact;
        currentContactKey.value = key;
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

const { currentUserId } = useAuth();
const { createTaskWithTemplate } = useTaskManager();
const notify = useNotify();

async function createScheduleCallTask(contact) {
    const contactFullName = getContactFullName(contact);
    const companyName = getCompanyShortName(props.company);

    const message = `Прозвонить ${contactFullName} (${companyName}, #${contact.company_id})`;

    const taskPayload = await createTaskWithTemplate({
        title: message.slice(0, 255),
        message: message.length > 255 ? message : null,
        step: TASK_FORM_STEPS.DATE,
        user_id: currentUserId.value,
        callPresets: true
    });

    if (!taskPayload) return;

    // TODO: Добавить шаблон сообщения для schedule-call

    const messagePayload = {
        message: `Запланировал звонок с ${contactFullName} на ${dayjs(taskPayload.end).format('D.MM.YYYY, HH:mm')}!`,
        contact_ids: [contact.id],
        template: 'schedule-call'
    };

    try {
        const createdMessage = await api.messenger.sendMessageWithTask(
            props.chatMemberId,
            messagePayload,
            taskPayload
        );

        if (createdMessage) notify.success('Звонок контакту успешно запланирован');
    } catch (error) {
        notify.error('Не удалось запланировать звонок. Попробуйте еще раз');
    }

    form.value[contact.id].scheduled = taskPayload.end;
}
</script>
