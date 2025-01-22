<template>
    <div class="messenger-quiz__content">
        <div v-if="disabled" class="messenger-quiz__disabled">
            <DashboardChip class="dashboard-bg-primary">
                Отсутствуют активные контакты
            </DashboardChip>
            <Button @click="$emit('suggest-contact')" small icon class="dashboard-bg-primary">
                <i class="fa-solid fa-user-plus" />
                <span>Создать контакт</span>
            </Button>
        </div>
        <Loader v-if="isLoading" />
        <template v-else>
            <MessengerQuizQuestionCallUnavailable
                v-for="contact in unavailableContacts"
                :key="contact.id"
                :contact="contact"
            />
            <MessengerQuizQuestionCall
                v-if="contacts.length && contactModel"
                @set-as-unavailable="actionsModalIsVisible = true"
                @schedule-call="$emit('schedule-call')"
                @move-contact="moveContact"
                @delete-contact="deleteContact"
                :contact="contactModel"
            />
            <component
                :is="currentTemplateComponent"
                ref="quizForm"
                :questions="filteredQuestions"
                :disabled="disabled || !contacts.length"
            />
        </template>
        <Modal
            @close="actionsModalIsVisible = false"
            :show="actionsModalIsVisible"
            :width="800"
            :close-on-press-esc="false"
            :close-on-outside-click="false"
            :title="`Результат звонка с ${contactModel?.first_name}`"
        >
            <Loader v-if="actionsIsLoading" />
            <MessengerQuizQuestionCallActions
                @schedule-call="$emit('schedule-call')"
                @move-contact="moveContact"
                @delete-contact="deleteContact"
                @close="actionsModalIsVisible = false"
                @submit="submitUnavailableAndSuggestNext"
                :contact="contactModel"
            />
        </Modal>
        <Modal
            @close="suggestModalIsVisible = false"
            :show="suggestModalIsVisible"
            :width="800"
            :close-on-press-esc="false"
            :close-on-outside-click="false"
            title="Выбор контакта для прозвона"
        >
            <MessengerQuizContacts
                v-model:contact="contactModel"
                @suggest="$emit('suggest-contact')"
                :contacts
                grid
                label="Список доступных контактов"
            />
            <div class="d-flex gap-2 mt-2 justify-content-center">
                <Button @click="suggestModalIsVisible = false" success>Подтвердить</Button>
            </div>
        </Modal>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerQuizFormObjectTemplate from '@/components/Messenger/Quiz/MessengerQuizFormObjectTemplate.vue';
import MessengerQuizFormCompanyTemplate from '@/components/Messenger/Quiz/MessengerQuizFormCompanyTemplate.vue';
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue';
import Loader from '@/components/common/Loader.vue';
import { quizQuestionsGroups } from '@/const/quiz.js';
import { messenger, messengerTemplates } from '@/const/messenger.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Button from '@/components/common/Button.vue';
import MessengerQuizQuestionCall from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionCall.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizQuestionCallActions from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionCallActions.vue';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import api from '@/api/api.js';
import { toBoldHTML } from '@/utils/formatters/html.js';
import MessengerQuizContacts from '@/components/Messenger/Quiz/MessengerQuizContacts.vue';
import MessengerQuizQuestionCallUnavailable from '@/components/Messenger/Quiz/Question/MessengerQuizQuestionCallUnavailable.vue';

const contactModel = defineModel('contact');
const emit = defineEmits(['suggest-contact', 'schedule-call', 'mark-contact-as-unavailable']);
const props = defineProps({
    disabled: Boolean,
    contacts: {
        type: Array,
        default: () => []
    },
    unavailableContacts: {
        type: Array,
        default: () => []
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
    getForm
});

// contacts suggest

const notify = useNotify();
const suggestModalIsVisible = ref(false);

function markContactAsUnavailableAnsSuggest() {
    emit('mark-contact-as-unavailable', contactModel.value);

    nextTick(() => {
        if (props.contacts.length) {
            suggestModalIsVisible.value = true;
        }
    });
}

// unavailable contacts

const actionsModalIsVisible = ref(false);
const actionsIsLoading = ref(false);

async function submitUnavailableAndSuggestNext(data) {
    actionsIsLoading.value = true;

    const messageIsCreated = await sendMessageAboutContactIsUnavailable(data);

    actionsIsLoading.value = false;

    if (!messageIsCreated) return;

    actionsModalIsVisible.value = false;

    markContactAsUnavailableAnsSuggest();
}

// tasks

const { createTaskWithTemplate } = useTaskManager();

async function moveContact() {
    const taskPayload = await createTaskPayload(
        `Перенести контакт (${contactModel.value.full_name}) в другую компанию: `
    );
    if (!taskPayload) return;

    await sendMessageAboutContactIsArchived(taskPayload, contactModel.value);
}

async function deleteContact() {
    const taskPayload = await createTaskPayload(
        `Нужно архивировать контакт ${contactModel.value.full_name}`
    );
    if (!taskPayload) return;

    await sendMessageAboutContactIsArchived(taskPayload, contactModel.value);
}

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

async function sendMessageAboutContactIsUnavailable(data) {
    const messagePayload = {
        message: `Контакт ${toBoldHTML(contactModel.value.full_name)} (#${contactModel.value.id}) ${data.result.toLowerCase()}. ${data.description}`,
        contact_ids: [contactModel.value.id],
        template: messengerTemplates.UNAVAILABLE_CONTACT
    };

    const createdMessage = await api.messenger.sendMessage(
        store.state.Messenger.currentDialog.id,
        messagePayload
    );

    if (createdMessage) {
        notify.success('Сообщение успешно создано');

        return true;
    }

    return false;
}
</script>
