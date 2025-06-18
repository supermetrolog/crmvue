<template>
    <div class="survey-form-header-company">
        <div class="row">
            <UiCol :cols="4">
                <CompanyShortCard
                    @update-logo="updateLogo"
                    :company
                    :logo-size="100"
                    :avatar-size="25"
                    :editable-logo="editable"
                    :show-name="false"
                />
            </UiCol>
            <UiCol :cols="7">
                <CompanyTabs :company class="survey-form-header-company__tabs">
                    <template #additional>
                        <Tab v-if="surveysCount" :name="`Опросы (${surveysCount})`">
                            <div class="d-flex flex-column gap-1">
                                <MessengerQuizInlineElement
                                    v-for="survey in lastSurveys"
                                    :key="survey.id"
                                    @show="showSurvey({ surveyId: survey.id })"
                                    :quiz="survey"
                                />
                            </div>
                        </Tab>
                        <Tab
                            v-if="survey && survey.tasks?.length"
                            :name="`Поставленные задачи (${survey.tasks.length})`"
                        >
                            <div class="survey-form-header-company__tasks">
                                <DashboardTableTasksItem
                                    v-for="task in survey.tasks"
                                    :key="task.id"
                                    @view="$emit('show-task', task)"
                                    :task="task"
                                    class="survey-form-header-company__task"
                                    :avatar-size="35"
                                    :observer-size="25"
                                    :show-diligence="false"
                                />
                            </div>
                        </Tab>
                        <Tab
                            v-if="survey && survey.tasks?.length && callTasks.length"
                            :name="`Запланирован звонок (${callTasks.length})`"
                        >
                            <div class="survey-form-header-company__tasks">
                                <DashboardTableTasksItem
                                    v-for="task in callTasks"
                                    :key="task.id"
                                    @view="$emit('show-task', task)"
                                    :task="task"
                                    class="survey-form-header-company__task"
                                    :avatar-size="35"
                                    :observer-size="25"
                                    :show-diligence="false"
                                />
                            </div>
                        </Tab>
                    </template>
                </CompanyTabs>
            </UiCol>
        </div>
        <div class="survey-form-header-company__actions">
            <UserFoldersDropdown
                @create="folderModalIsVisible = true"
                :entity="company.id"
                morph="company"
                button-color="light"
                creatable
                class="mr-1"
            />
            <UiDropdownActions
                :title="company.full_name"
                label="Действия над компанией"
                icon="fa-solid fa-ellipsis-vertical"
            >
                <template #trigger>
                    <UiDropdownActionsTrigger
                        label="Действия над компанией"
                        color="light"
                        class="op-7"
                    />
                </template>
                <template #menu>
                    <template v-if="editable">
                        <UiDropdownActionsButton
                            @handle="$emit('create-task')"
                            label="Создать задачу"
                            icon="fa-solid fa-bolt"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-call')"
                            :icon="company.scheduled ? 'fa-solid fa-check' : 'fa-solid fa-phone'"
                            :label="
                                company.scheduled ? 'Звонок запланирован' : 'Запланировать звонок'
                            "
                            :disabled="company.scheduled"
                        />
                        <UiDropdownActionsButton
                            @handle="companyFormIsVisible = true"
                            label="Редактировать"
                            icon="fa-solid fa-pen"
                        />
                        <template v-if="canBeArchived">
                            <UiDropdownActionsButton
                                v-if="isPassive"
                                @handle="enableCompany(company.id)"
                                label="Восстановить компанию"
                                icon="fa-solid fa-undo"
                            />
                            <UiDropdownActionsButton
                                v-else
                                @handle="disableCompanyFormIsVisible = true"
                                label="Отправить в архив"
                                icon="fa-solid fa-ban text-danger"
                            />
                        </template>
                        <UiDropdownActionsButton
                            @handle="updateLogo"
                            label="Изменить логотип"
                            icon="fa-solid fa-image"
                        />
                    </template>
                    <UiDropdownActionsButton
                        @handle="toChat"
                        label="Перейти в чат компании"
                        icon="fa-solid fa-comment"
                    />
                </template>
            </UiDropdownActions>
        </div>
        <teleport to="body">
            <UiModal
                v-model:visible="logoFormIsVisible"
                @closed="closeForm"
                :close-on-outside-click="!logoEdited"
                :close-on-press-esc="!logoEdited"
                :min-height="200"
                :width="800"
                title="Обновление логотипа"
            >
                <FormCompanyLogo
                    @updated="onUpdateLogo"
                    @deleted="onDeleteLogo"
                    @canceled="closeForm"
                    @edited="logoEdited = true"
                    :company
                />
            </UiModal>
            <FormCompany
                v-if="companyFormIsVisible"
                @close="companyFormIsVisible = false"
                @updated="$emit('update-company')"
                :form-data="company"
            />
            <FormCompanyDisable
                v-if="disableCompanyFormIsVisible"
                @close="disableCompanyFormIsVisible = false"
                @disabled="onDisabledCompany"
                :company
            />
            <UiModal
                v-model:visible="companyModalIsVisible"
                title="Карточка компании"
                :width="1400"
                :min-height="300"
            >
                <div class="row">
                    <UiCol :cols="4">
                        <CompanyShortCard
                            @update-logo="updateLogo"
                            :company
                            :logo-size="100"
                            :avatar-size="25"
                            :editable-logo="editable"
                        />
                    </UiCol>
                    <UiCol :cols="7">
                        <CompanyTabs :company class="survey-form-header-company__tabs">
                            <template v-if="surveysCount" #additional>
                                <Tab :name="`Опросы (${surveysCount})`">
                                    <div class="d-flex flex-column gap-1">
                                        <MessengerQuizInlineElement
                                            v-for="survey in lastSurveys"
                                            :key="survey.id"
                                            @show="showSurvey({ surveyId: survey.id })"
                                            :quiz="survey"
                                        />
                                    </div>
                                </Tab>
                            </template>
                        </CompanyTabs>
                    </UiCol>
                </div>
            </UiModal>
            <FormUserFolder
                v-if="folderModalIsVisible"
                @close="closeFolderForm"
                @created="onCreatedFolder"
                category="company"
            />
        </teleport>
    </div>
</template>
<script setup>
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, ref, useTemplateRef } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { messenger } from '@/const/messenger.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import FormCompanyDisable from '@/components/Forms/Company/FormCompanyDisable.vue';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import { useAsync } from '@/composables/useAsync.js';
import api from '@/api/api.js';
import { useTippyText } from '@/composables/useTippyText.js';
import CompanyShortCard from '@/components/CompanyShortCard/CompanyShortCard.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import CompanyTabs from '@/components/CompanyTabs/CompanyTabs.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerQuizInlineElement from '@/components/MessengerQuiz/MessengerQuizInlineElement.vue';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';
import UserFoldersDropdown from '@/components/UserFolder/UserFoldersDropdown.vue';
import FormUserFolder from '@/components/Forms/FormUserFolder.vue';
import { useUserFolders } from '@/composables/useUserFolders.js';
import { useAuth } from '@/composables/useAuth.js';
import DashboardTableTasksItem from '@/components/Dashboard/Table/TasksItem/DashboardTableTasksItem.vue';

const emit = defineEmits([
    'update-logo',
    'update-company',
    'to-chat',
    'create-task',
    'schedule-call',
    'show-task'
]);
const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    lastSurveys: {
        type: Array,
        default: () => []
    },
    surveysCount: {
        type: Number,
        default: 0
    },
    editable: Boolean,
    survey: Object
});

// logo form

const logoFormIsVisible = ref(false);
const logoEdited = ref(false);

function closeForm() {
    logoFormIsVisible.value = false;
    logoEdited.value = false;
}

const notify = useNotify();

function updateLogo() {
    if (!props.editable) return;

    logoFormIsVisible.value = true;
}

function onUpdateLogo(logo) {
    closeForm();
    notify.success('Логотип компании обновлен');
    emit('update-logo', logo);
}

function onDeleteLogo() {
    closeForm();
    notify.success('Логотип компании удален');
    emit('update-logo', null);
}

const { currentUserId, currentUserIsModeratorOrHigher } = useAuth();
const canBeArchived = computed(
    () =>
        props.company.consultant_id === currentUserId.value || currentUserIsModeratorOrHigher.value
);

const companyFormIsVisible = ref(false);
const disableCompanyFormIsVisible = ref(false);

const { execute: enableCompany } = useAsync(api.companies.enable, {
    onFetchResponse: () => {
        notify.success('Компания успешно восстановлена.');
        emit('update-company');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Восстановить компанию',
        message: 'Вы уверены, что хотите восстановить компанию из архива?'
    }
});

function onDisabledCompany() {
    disableCompanyFormIsVisible.value = false;
    emit('update-company');
}

const isPassive = computed(() => !props.company.status);

// chat

const { openChat } = useMessenger();

const toChat = () => {
    openChat(props.company.id, props.company.id, messenger.dialogTypes.COMPANY);
    emit('to-chat');
};

// tippy

useTippyText(useTemplateRef('companyLogoEl'), 'Нажмите, чтобы редактировать логотип');

// folders

const { folders } = useUserFolders('company');

const folderModalIsVisible = ref(false);

function closeFolderForm() {
    folderModalIsVisible.value = false;
}

function onCreatedFolder(folder) {
    folderModalIsVisible.value = false;
    folders.value.unshift(folder);
}

// tasks

const callTasks = computed(() => {
    return props.survey.tasks.filter(task => task.type === 'scheduled_call');
});

// preview

const companyModalIsVisible = ref(false);

const { show: showSurvey } = useAsyncPopup('surveyPreview');

// TODO: Превью всех опросов
</script>
