<template>
    <div class="messenger-quiz-header">
        <div class="messenger-quiz-header__heading mb-1">
            <DashboardChip class="dashboard-bg-gray-l">
                Список контактов ({{ contacts.length }}):
            </DashboardChip>
            <HoverActionsButton
                @click="$emit('suggest')"
                label="Добавить контакт"
                class="dashboard-bg-gray-l"
                small
            >
                <i class="fa-solid fa-user-plus"></i>
            </HoverActionsButton>
        </div>
        <div ref="contactsListEl" @wheel.prevent class="messenger-quiz-header__list">
            <MessengerQuizContact
                v-for="contact in contacts"
                :key="contact.id"
                @show-comments="showComments(contact)"
                @edit="$emit('edit', contact)"
                @delete="deleteContact(contact)"
                @move="moveContact(contact)"
                @schedule-call="$emit('schedule-call', contact)"
                @click="selectCurrentContact(contact)"
                :contact="contact"
                :active="currentContact?.id === contact.id"
                class="messenger-quiz-header__contact"
            />
        </div>
        <Modal
            @close="closeCommentsModal"
            :title="`Просмотр комментариев (${comments.length})`"
            :width="600"
            :show="commentsModalIsOpen"
        >
            <MessengerQuizContactsComments @close="closeCommentsModal" :comments />
        </Modal>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { ref, shallowRef, useTemplateRef } from 'vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import api from '@/api/api.js';
import { messenger } from '@/const/messenger.js';
import { toBoldHTML } from '@/utils/formatters/html.js';
import MessengerQuizContact from '@/components/Messenger/Quiz/MessengerQuizContact.vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import MessengerQuizContactsComments from '@/components/Messenger/Quiz/MessengerQuizContactsComments.vue';

const currentContact = defineModel('contact');
defineEmits(['suggest', 'edit', 'schedule-call']);
defineProps({
    contacts: {
        type: Array,
        required: true
    }
});

const store = useStore();
const notify = useNotify();
const { createTaskWithTemplate } = useTaskManager();
const contactsListEl = useTemplateRef('contactsListEl');

useHorizontalScroll(contactsListEl);

function createTaskPayload(templateMessage) {
    return createTaskWithTemplate({
        message: templateMessage,
        step: TASK_FORM_STEPS.MESSAGE,
        focusMessage: true
    });
}

async function sendMessageAboutContactIsArchived(taskPayload, contact) {
    const chatMemberId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.COMPANY,
        model_id: store.state.Messenger.currentPanel.id
    });

    if (!chatMemberId) {
        notify.info('Чат компании не найден в системе.. Создайте задачу вручную.');
        return;
    }

    const messagePayload = {
        to_chat_member_id: chatMemberId,
        message: `Контакт ${toBoldHTML(contact.full_name)} (#${contact.id}) больше не связан с этой компаний.`,
        contact_ids: [contact.id]
    };

    const createdMessage = await api.messenger.sendMessageWithTask(
        chatMemberId,
        messagePayload,
        taskPayload
    );

    if (createdMessage) {
        notify.success('Сообщение и задача успешно созданы');
    } else {
        notify.error('Произошла ошибка. Попробуйте еще раз..');
    }
}

function selectCurrentContact(contact) {
    currentContact.value = contact;
}

async function moveContact(contact) {
    const taskPayload = await createTaskPayload('Перенести контакт в другую компанию: ', contact);
    if (!taskPayload) return;

    await sendMessageAboutContactIsArchived(taskPayload, contact);
}

async function deleteContact(contact) {
    const taskPayload = await createTaskPayload('Нужно архивировать контакт', contact);
    if (!taskPayload) return;

    await sendMessageAboutContactIsArchived(taskPayload, contact);
}

// COMMENTS

const commentsModalIsOpen = ref(false);
const comments = shallowRef([]);

function showComments(contact) {
    comments.value = contact.comments;
    commentsModalIsOpen.value = true;
}

function closeCommentsModal() {
    commentsModalIsOpen.value = false;
}
</script>
