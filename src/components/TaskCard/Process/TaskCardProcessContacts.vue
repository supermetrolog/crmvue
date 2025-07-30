<template>
    <TaskCardProcessDefault @show-survey="$emit('show-survey', $event)" :task :relations>
        <template #list>
            <TaskCardProcessEntityContact
                v-for="contact in contacts"
                :key="contact.id"
                @edit="editContact(contact.entity)"
                @enable="enableContact(contact.entity_id)"
                @disable="disableContact(contact.entity)"
                @change-company="changeContactCompany(contact.entity)"
                :contact="contact.entity"
                :loading="isLoading"
                data-tour-id="task-process:show-contacts"
            />
            <UiButton
                @click="formIsVisible = true"
                small
                icon="fa-solid fa-plus"
                color="white"
                data-tour-id="task-process:create-contact"
            >
                Добавить контакт
            </UiButton>
        </template>
        <template #modals>
            <FormCompanyContact
                v-if="formIsVisible"
                @close="closeForm"
                @created="closeForm"
                @updated="onUpdatedContact"
                :formdata="editedContact"
                :pinned-task="task"
                :company_id="companyId"
            />
            <FormContactDisable
                v-if="disableContactFormIsVisible"
                @close="disableContactFormIsVisible = false"
                @disabled="onContactDisabled"
                :contact="disablingContact"
                :pinned-task="task"
            />
            <FormContactChangeCompany
                v-if="changeContactCompanyFormIsVisible"
                @close="closeChangeContactCompanyForm"
                @changed="onContactCompanyChanged"
                :contact="changeCompanyContact"
                :pinned-task="task"
            />
        </template>
    </TaskCardProcessDefault>
</template>

<script setup lang="ts">
import { TaskRelationEntity, TaskRelationEntityModelTypeEnum, TaskView } from '@/types/task';
import { computed, ref } from 'vue';
import api from '@/api/api';
import { useNotify } from '@/utils/use/useNotify';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import TaskCardProcessEntityContact from '@/components/TaskCard/Process/TaskCardProcessEntityContact.vue';
import { contactOptions } from '@/const/options/contact.options';
import FormContactDisable from '@/components/Forms/FormContactDisable.vue';
import { createTourStepElementGenerator, useTourStep } from '@/composables/useTour/useTourStep';
import TaskCardProcessDefault from '@/components/TaskCard/Process/TaskCardProcessDefault.vue';
import FormContactChangeCompany from '@/components/Forms/FormContactChangeCompany.vue';

defineEmits<{ (e: 'show-survey', surveyId: number): void }>();

const props = defineProps<{
    task: TaskView;
    relations: TaskRelationEntity[];
}>();

const contacts = computed(() =>
    props.relations.filter(
        relation => relation.entity_type === TaskRelationEntityModelTypeEnum.CONTACT
    )
);

const companies = computed(() =>
    props.relations.filter(
        relation => relation.entity_type === TaskRelationEntityModelTypeEnum.COMPANY
    )
);

const companyId = computed(() => {
    if (companies.value.length) {
        return companies.value[0].entity_id;
    }

    if (contacts.value.length) {
        return contacts.value[0].entity.company_id;
    }

    return undefined;
});

const isLoading = ref(false);

// edit

const editedContact = ref(null);
const formIsVisible = ref(false);

async function editContact(contact) {
    isLoading.value = true;
    editedContact.value = await api.contacts.get(contact.id);
    isLoading.value = false;

    formIsVisible.value = true;
}

function closeForm() {
    formIsVisible.value = false;
    editedContact.value = null;
}

function onUpdatedContact(contactId, contact) {
    const index = contacts.value.findIndex(r => r.entity_id === contactId);
    if (index !== -1) {
        Object.assign(contacts.value[index].entity, contact);
    }

    editedContact.value = null;
    formIsVisible.value = false;
}

// disable

const disablingContact = ref(null);
const disableContactFormIsVisible = ref(false);

function disableContact(contact) {
    disablingContact.value = contact;
    disableContactFormIsVisible.value = true;
}

function onContactDisabled(payload) {
    const index = contacts.value.findIndex(r => r.entity_id === disablingContact.value.id);
    if (index !== -1) {
        contacts.value[index].entity.status = 0;
        Object.assign(contacts.value[index].entity, payload);
    }

    disablingContact.value = null;
    disableContactFormIsVisible.value = false;
}

const notify = useNotify();

// enable

const { execute: enableContact } = useAsync(api.contacts.enable, {
    onFetchResponse: ({ args }) => {
        notify.success('Контакт успешно восстановлен.');

        const index = contacts.value.findIndex(r => r.entity_id === args[0]);
        if (index !== -1) {
            contacts.value[index].entity.status = contactOptions.statusStatement.ACTIVE;
        }
    },
    confirmation: true,
    confirmationContent: {
        title: 'Восстановить контакт',
        message: 'Вы уверены, что хотите восстановить контакт из архива?'
    }
});

// change company {

const changeContactCompanyFormIsVisible = ref(false);
const changeCompanyContact = ref(null);

async function changeContactCompany(contact) {
    changeCompanyContact.value = contact;
    changeContactCompanyFormIsVisible.value = true;
}

function closeChangeContactCompanyForm() {
    changeContactCompanyFormIsVisible.value = false;
    changeCompanyContact.value = null;
}

function onContactCompanyChanged(payload) {
    Object.assign(changeCompanyContact.value, payload);
    closeChangeContactCompanyForm();
}

// tour

const createTourStepElement = createTourStepElementGenerator('task-process');

useTourStep({
    key: 1,
    element: createTourStepElement('show-survey'),
    popover: {
        title: 'Просмотр опроса',
        description:
            'Мгновенно открывайте опрос для просмотра результатов, необходимых для выполнения задачи.',
        side: 'right',
        align: 'start'
    }
});

useTourStep({
    key: 2,
    element: createTourStepElement('show-contacts'),
    popover: {
        title: 'Управление контактом',
        description:
            'Редактируйте, архивируйте, восстанавливайте и просматривайте контакт в пару нажатий.',
        side: 'right',
        align: 'start'
    }
});

useTourStep({
    key: 3,
    element: createTourStepElement('create-contact'),
    popover: {
        title: 'Создавайте контакт',
        description:
            'Создавайте контакт без перехода на страницу компании. Информация из карточки задачи останется рядом с вами.',
        side: 'right',
        align: 'start'
    }
});
</script>
