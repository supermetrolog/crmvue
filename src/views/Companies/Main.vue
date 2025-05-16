<template>
    <section>
        <div class="container-fluid">
            <div class="row mb-2 mb-md-4">
                <FormCompany
                    v-if="companyFormIsVisible"
                    @close="companyFormIsVisible = false"
                    @created="getCompanies"
                />
                <FormCompanySearch v-if="queryIsInitialized" class="col-12" />
                <div class="col-12 my-2">
                    <div class="company-table__filters">
                        <Chip
                            v-for="item in humanizedSelectedQueryFilters"
                            :key="item.value"
                            @delete="removeFilter(item.value)"
                            :value="item.value"
                            :html="item.label"
                        />
                    </div>
                </div>
            </div>
            <div class="row mb-1">
                <UserFolders
                    v-model:selected="currentFolder"
                    category="company"
                    class="col-12"
                    movable
                    editable
                    selectable
                />
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="d-flex flex-column flex-md-row justify-content-between">
                        <PaginationClassic
                            ref="firstPagination"
                            @next="next"
                            :pagination="COMPANIES_PAGINATION"
                            :loading="!COMPANIES_PAGINATION && isLoading"
                        />
                        <div
                            class="company-table__actions justify-content-start align-items-center"
                        >
                            <Switch
                                v-if="!isMobile"
                                v-model="viewMode"
                                false-title="Таблица"
                                true-title="Карточки"
                            />
                            |
                            <UiButton
                                @click="companyFormIsVisible = true"
                                color="light"
                                :disabled="isLoading"
                                small
                                icon="fa-solid fa-plus"
                            >
                                Создать компанию
                            </UiButton>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <component
                            :is="currentViewComponentName"
                            v-if="COMPANIES.length"
                            @show-message="showPinnedMessage"
                            @unpin-message="unpinMessage"
                            @deleted-from-folder="onDeletedFromFolder"
                            @create-pinned-message="createPinnedMessage"
                            :companies="COMPANIES"
                            :loader="isLoading"
                        />
                        <Spinner v-else-if="isLoading" />
                        <EmptyData v-else>Ничего не найдено</EmptyData>
                    </AnimationTransition>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        v-if="COMPANIES_PAGINATION"
                        @next="nextWithScroll"
                        :pagination="COMPANIES_PAGINATION"
                    />
                </div>
            </div>
        </div>
        <teleport to="body">
            <FormModalChatMemberMessage
                v-if="messageFormIsVisible"
                @close="closeMessageForm"
                @created="onCreatedMessage"
                :model-id="currentCompany.id"
                model-type="company"
            />
            <UiModal
                v-model:visible="pinnedMessageViewIsVisible"
                title="Просмотр закрепленного сообщения"
                width="800"
            >
                <UiCol :cols="12">
                    <Spinner v-if="pinnedMessageIsLoading" label="Загрузка сообщения.." />
                    <MessengerChatMessage
                        v-else-if="pinnedMessage"
                        :message="pinnedMessage"
                        :editable="false"
                        pinned
                    />
                </UiCol>
            </UiModal>
        </teleport>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import FormCompanySearch from '@/components/Forms/Company/FormCompanySearch.vue';
import CompanyTable from '@/components/Company/Table/CompanyTable.vue';
import CompanyGrid from '@/components/Company/CompanyGrid.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute, useRouter } from 'vue-router';
import Spinner from '@/components/common/Spinner.vue';
import { useMobile } from '@/composables/useMobile.js';
import Chip from '@/components/common/Chip.vue';
import { useSelectedFilters } from '@/composables/useSelectedFilters.js';
import { ActivePassive, CompanyCategories } from '@/const/const.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { companyOptions } from '@/const/options/company.options.js';
import { dayjsFromMoscow, toDateFormat } from '@/utils/formatters/date.js';
import UserFolders from '@/components/UserFolder/UserFolders.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useDebounceFn } from '@vueuse/core';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useTimeoutFn } from '@vueuse/core';
import FormModalChatMemberMessage from '@/components/Forms/FormModalChatMemberMessage.vue';
import api from '@/api/api.js';
import MessengerChatMessage from '@/components/Messenger/Chat/Message/MessengerChatMessage.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { useNotify } from '@/utils/use/useNotify.js';

const route = useRoute();
const router = useRouter();
const store = useStore();

const COMPANIES = computed(() => store.getters.COMPANIES);
const COMPANIES_PAGINATION = computed(() => store.getters.COMPANIES_PAGINATION);
const { consultantsOptions } = useConsultantsOptions();

const isMobile = useMobile();
const isLoading = ref(true);
const viewMode = ref(false);
const companyFormIsVisible = ref(false);
const firstPagination = ref(null);

const gettersForFilters = {
    consultant_id: value => {
        if (consultantsOptions.value.length)
            return consultantsOptions.value.find(element => Number(element.value) === Number(value))
                ?.label;
        return null;
    },
    categories: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(category => CompanyCategories[category]).join(', ');
        return null;
    },
    activityGroup: value => companyOptions.activityGroup[value],
    activityProfile: value => companyOptions.activityProfile[value],
    dateStart: value => toDateFormat(value, 'DD.MM.YYYY'),
    dateEnd: value => toDateFormat(value, 'DD.MM.YYYY'),
    status: value => {
        if (!value) return null;
        return ActivePassive[value];
    },
    productRanges: value => {
        return value.join(', ');
    },
    activity_group_ids: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(group => companyOptions.activityGroup[group]).join(', ');
        return null;
    },
    activity_profile_ids: value => {
        if (isArray(value) && !isEmptyArray(value))
            return value.map(profile => companyOptions.activityProfile[profile]).join(', ');
        return null;
    }
};

const { humanizedSelectedQueryFilters } = useSelectedFilters({}, gettersForFilters);

const getCompanies = async () => {
    isLoading.value = true;

    const query = { ...route.query };

    if (isNotNullish(currentFolder.value)) {
        query.folder_ids = [currentFolder.value];
    }

    await store.dispatch('SEARCH_COMPANIES', { query });

    isLoading.value = false;
};

const debouncedFetchCompanies = useDebounceFn(getCompanies, 300);

const { next, nextWithScroll, queryIsInitialized } = useTableContent(getCompanies, {
    scrollTo: firstPagination
});

const currentViewComponentName = computed(() => {
    if (isMobile) return CompanyGrid;
    return viewMode.value ? CompanyGrid : CompanyTable;
});

function removeFilter(filter) {
    const query = { ...route.query };

    delete query[filter];

    router.replace({ query });
}

// folders

const currentFolder = ref(null);

watch(currentFolder, debouncedFetchCompanies);

function onDeletedFromFolder(companyId, folderId) {
    if (isNotNullish(currentFolder.value) && currentFolder.value === folderId) {
        const companyIndex = store.state.Companies.companies.findIndex(
            offer => offer.id === companyId
        );
        if (companyIndex === -1) return;

        store.state.Companies.companies[companyIndex].isDeleting = true;

        useTimeoutFn(() => {
            store.state.Companies.companies.splice(companyIndex, 1);
        }, 500);
    }
}

// pinned message

const currentCompany = shallowRef(null);
const messageFormIsVisible = ref(false);

function createPinnedMessage(company) {
    currentCompany.value = company;
    messageFormIsVisible.value = true;
}

function closeMessageForm() {
    messageFormIsVisible.value = false;
    currentCompany.value = null;
}

const isPinning = ref(false);

async function onCreatedMessage(message) {
    const companyId = currentCompany.value.id;

    closeMessageForm();

    isPinning.value = true;

    try {
        await api.messenger.pinMessage(message.to_chat_member_id, message.id);

        const companyIndex = COMPANIES.value.findIndex(company => company.id === companyId);
        if (companyIndex !== -1) COMPANIES.value[companyIndex].chat_member_pinned_message = message;
    } finally {
        isPinning.value = false;
    }
}

const pinnedMessage = ref(null);
const pinnedMessageViewIsVisible = ref(false);
const pinnedMessageIsLoading = ref(false);

async function showPinnedMessage(message) {
    pinnedMessageIsLoading.value = true;
    pinnedMessageViewIsVisible.value = true;

    try {
        pinnedMessage.value = await api.messenger.getPinned(message.to_chat_member_id);
        pinnedMessage.value.dayjs_date = dayjsFromMoscow(pinnedMessage.value.created_at);
    } finally {
        pinnedMessageIsLoading.value = false;
    }
}

const { confirm } = useConfirm();
const notify = useNotify();

async function unpinMessage(message, companyId) {
    const confirmed = await confirm(
        'Открепить сообщение',
        'Вы уверены, что хотите открепить сообщение?'
    );
    if (!confirmed) return;

    try {
        const unpinned = await api.messenger.unpinMessage(message.to_chat_member_id);
        if (unpinned) {
            notify.success('Сообщение успешно откреплено');

            const companyIndex = COMPANIES.value.findIndex(company => company.id === companyId);
            if (companyIndex !== -1)
                COMPANIES.value[companyIndex].chat_member_pinned_message = null;
        }
    } catch (error) {
        notify.error('Произошла ошибка. Попробуйте позже');
        // TODO: Log sentry
    }
}
</script>
