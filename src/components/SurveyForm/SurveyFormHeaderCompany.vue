<template>
    <div class="survey-form-header-company">
        <div class="row">
            <UiCol :cols="4">
                <CompanyShortCard
                    @update-logo="logoFormIsVisible = true"
                    :company
                    :logo-size="100"
                    :avatar-size="25"
                    editable-logo
                />
            </UiCol>
            <UiCol :cols="7">
                <CompanyTabs :company class="survey-form-header-company__tabs">
                    <template #additional>
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
        <div class="survey-form-header-company__actions">
            <UiButtonIcon
                @click="companyModalIsVisible = true"
                icon="fa-solid fa-maximize"
                label="Развернуть карточку компании"
            />
            <UiDropdownActions label="Действия над компанией" icon="fa-solid fa-ellipsis-vertical">
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="companyFormIsVisible = true"
                        label="Редактировать"
                        icon="fa-solid fa-pen"
                    />
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
                    <UiDropdownActionsButton
                        @handle="toChat"
                        label="Перейти в чат компании"
                        icon="fa-solid fa-comment"
                    />
                    <UiDropdownActionsButton
                        @handle="logoFormIsVisible = true"
                        label="Изменить логотип"
                        icon="fa-solid fa-image"
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
                            @update-logo="logoFormIsVisible = true"
                            :company
                            :logo-size="100"
                            :avatar-size="25"
                            editable-logo
                        />
                    </UiCol>
                    <UiCol :cols="7">
                        <CompanyTabs :company class="survey-form-header-company__tabs">
                            <template #additional>
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
        </teleport>
    </div>
</template>
<script setup>
import FormCompanyLogo from '@/components/Forms/Company/FormCompanyLogo.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, ref, useTemplateRef } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';
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
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerQuizInlineElement from '@/components/MessengerQuiz/MessengerQuizInlineElement.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

const emit = defineEmits(['update-logo', 'update-company']);
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
    }
});

// logo form

const logoFormIsVisible = ref(false);
const logoEdited = ref(false);

function closeForm() {
    logoFormIsVisible.value = false;
    logoEdited.value = false;
}

const notify = useNotify();

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
};

// tippy

useTippyText(useTemplateRef('companyLogoEl'), 'Нажмите, чтобы редактировать логотип');

// surveys

const lastSurveyCreatedAt = computed(() => toBeautifulDateFormat(props.surveys[0].created_at));

// preview

const companyModalIsVisible = ref(false);

const { show: showSurvey } = useAsyncPopup('surveyPreview');

// TODO: Превью всех опросов
</script>
