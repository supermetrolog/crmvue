<template>
    <div class="messenger-quiz-header">
        <Spinner v-if="isLoading" class="small" label="Загрузка контактов.." />
        <DashboardChip v-else class="dashboard-bg-gray-l mb-1">
            Список контактов ({{ contacts.length }}):
        </DashboardChip>
        <div ref="contactsListEl" @wheel.prevent class="messenger-quiz-header__list">
            <MessengerQuizContact
                v-for="contact in contacts"
                :key="contact.id"
                @show-comments="showComments(contact)"
                @edit="editContact(contact)"
                @delete="deleteContact(contact)"
                @move="moveContact(contact)"
                @click="selectCurrentContact(contact)"
                :contact="contact"
                :active="currentContact?.id === contact.id"
                class="messenger-quiz-header__contact"
            />
        </div>
        <Modal
            @close="commentsIsOpen = false"
            :title="`Просмотр комментариев (${comments.length})`"
            :width="600"
            :show="commentsIsOpen"
        >
            <DashboardChip class="dashboard-bg-warning-l mb-3 w-100 text-center">
                <i class="fa-solid fa-exclamation-triangle mr-2" />
                <span>Раздел в разработке. Сейчас доступен в режиме просмотра.</span>
            </DashboardChip>
            <div class="messenger-quiz-header-comments">
                <div v-if="comments.length" class="messenger-quiz-header-comments__list">
                    <DashboardChip
                        v-for="comment in comments"
                        :key="comment.id"
                        class="dashboard-bg-success-l w-100"
                    >
                        <p>{{ comment.comment }}</p>
                        <p>
                            <small>
                                <span>{{ comment.author.userProfile.medium_name }}</span>
                                <span class="text-grey ml-1">
                                    {{ toDateFormat(comment.created_at) }}
                                </span>
                            </small>
                        </p>
                    </DashboardChip>
                </div>
                <EmptyData v-else>Список комментариев пуст..</EmptyData>
                <div class="messenger-quiz-header-comments__footer mt-3">
                    <Button @click="commentsIsOpen = false" small>Закрыть</Button>
                </div>
            </div>
        </Modal>
        <teleport to="body">
            <FormCompanyContact
                v-if="formIsVisible"
                @close="closeForm"
                @updated="onContactUpdated"
                :formdata="updatingContact"
            />
        </teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useNotify } from '@/utils/useNotify.js';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import api from '@/api/api.js';
import { messenger } from '@/const/messenger.js';
import { toBoldHTML, toDateFormat } from '@/utils/formatter.js';
import MessengerQuizContact from '@/components/Messenger/Quiz/MessengerQuizContact.vue';
import { useHorizontalScroll } from '@/composables/useHorizontalScroll.js';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import { contactOptions } from '@/const/options/contact.options.js';

const currentContact = defineModel('contact');

const store = useStore();
const notify = useNotify();
const { createTaskWithTemplate } = useTaskManager();
const contactsListEl = useTemplateRef('contactsListEl');

useHorizontalScroll(contactsListEl);

const commentsIsOpen = ref(false);
const comments = shallowRef([]);

const formIsVisible = ref(false);
const updatingContact = shallowRef(null);

const isLoading = ref(false);
const contacts = ref([]);

const company = computed(() => store.state.Messenger.currentPanel);
const mainContact = computed(() => {
    return contacts.value.find(contact => contact.isMain);
});

const createTaskPayload = templateMessage => {
    return createTaskWithTemplate({
        message: templateMessage,
        step: TASK_FORM_STEPS.MESSAGE,
        focusMessage: true
    });
};

const sendMessageAboutContactIsArchived = async (taskPayload, contact) => {
    const chatMemberId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.COMPANY,
        model_id: company.value.id
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
};

const selectCurrentContact = contact => {
    currentContact.value = contact;
};

const moveContact = async contact => {
    const taskPayload = await createTaskPayload('Перенести контакт в другую компанию: ', contact);
    if (!taskPayload) return;

    await sendMessageAboutContactIsArchived(taskPayload);
};

const deleteContact = async contact => {
    const taskPayload = await createTaskPayload('Нужно архивировать контакт', contact);
    if (!taskPayload) return;

    await sendMessageAboutContactIsArchived(taskPayload);
};

const showComments = contact => {
    comments.value = contact.comments;
    commentsIsOpen.value = true;
};

const fetchContacts = async () => {
    isLoading.value = true;

    const response = await api.contacts.getByCompany(company.value.id);
    if (response?.length)
        contacts.value = response.filter(
            contact => contact.status === contactOptions.statusStatement.ACTIVE
        );

    isLoading.value = false;
};

const setInitialCurrentContact = () => {
    currentContact.value = mainContact.value ?? contacts.value[0];
};

const closeForm = () => {
    formIsVisible.value = false;
    updatingContact.value = null;
};

const editContact = contact => {
    updatingContact.value = contact;
    formIsVisible.value = true;
};

const onContactUpdated = async (_, contact) => {
    const contactIndex = contacts.value.findIndex(element => element.id === contact.id);
    if (contactIndex !== -1) {
        if (contact.status === contactOptions.statusStatement.PASSIVE)
            contacts.value.splice(contactIndex, 1);
        else Object.assign(contacts.value[contactIndex], contact);
    }

    store.commit('Messenger/onContactUpdated', contact);
};

onMounted(async () => {
    await fetchContacts();
    setInitialCurrentContact();
});
</script>
