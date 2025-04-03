<template>
    <section class="companies-requests">
        <div class="container-fluid">
            <div class="row mb-4">
                <FormCompanyRequestSearch v-if="queryIsInitialized" class="col-8" />
            </div>
            <div class="row justify-content-between">
                <PaginationClassic
                    ref="firstPagination"
                    @next="next"
                    class="col-6"
                    :pagination="pagination"
                    :loading="isLoading"
                />
                <div class="company-table__actions col-12 col-md-4 align-items-end">
                    <Switch
                        v-if="!isMobile"
                        v-model="isCardView"
                        false-title="Таблица"
                        true-title="Карточки"
                    />
                    <UiButton
                        @click="fetchRequests"
                        color="light"
                        icon="fa-solid fa-refresh"
                        :disabled="isLoading"
                    >
                        Обновить
                    </UiButton>
                </div>
            </div>
            <div class="row">
                <div class="col-12 offers-page__table">
                    <AnimationTransition :speed="0.2">
                        <component
                            :is="currentViewComponentName"
                            @edit="editRequest"
                            @toggle-disable="toggleDisableRequest"
                            @view="viewRequest"
                            @to-chat="openInChat"
                            :requests="requests"
                            :loader="isLoading"
                        />
                    </AnimationTransition>
                    <EmptyData v-if="!isLoading && !requests.length">
                        Ничего не найдено...
                    </EmptyData>
                </div>
                <div class="col-12">
                    <PaginationClassic
                        @next="nextWithScroll"
                        :pagination="pagination"
                        :loading="isLoading"
                    />
                </div>
            </div>
        </div>
        <teleport to="body">
            <DashboardCardRequestView
                v-if="requestViewIsVisible"
                @close="requestViewIsVisible = false"
                @edit="editRequest(viewingRequest)"
                @toggle-disable="toggleDisableRequest(viewingRequest)"
                @to-chat="toChatFromView"
                :editable="userCanEdit(viewingRequest)"
                :request="viewingRequest"
            />
            <FormModalCompanyRequestDisable
                @close="formDisableIsVisible = false"
                @disabled="onRequestUpdated(disablingRequest)"
                :show="formDisableIsVisible"
                :request_id="disablingRequest?.id"
            />
            <FormCompanyRequest
                v-if="formRequestIsVisible"
                @close="formRequestIsVisible = false"
                @updated="onRequestUpdated(editableRequest)"
                :form-data="editableRequest"
            />
        </teleport>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import FormCompanyRequestSearch from '@/components/Forms/Company/FormCompanyRequestSearch.vue';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import CompanyRequestTable from '@/components/Company/Request/CompanyRequestTable.vue';
import CompanyRequestTableMobile from '@/components/Company/Request/CompanyRequestTableMobile.vue';
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import { useTableContent } from '@/composables/useTableContent.js';
import { useRoute, useRouter } from 'vue-router';
import EmptyData from '@/components/common/EmptyData.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useMobile } from '@/composables/useMobile.js';
import Switch from '@/components/common/Forms/Switch.vue';
import api from '@/api/api.js';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import DashboardCardRequestView from '@/components/Dashboard/Card/Request/DashboardCardRequestView.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { useAuth } from '@/composables/useAuth.js';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys.js';
import UiButton from '@/components/common/UI/UiButton.vue';

const store = useStore();
const route = useRoute();

const isLoading = ref();
const { confirm } = useConfirm();
const { openChat } = useMessenger();

const isCardView = ref(false);
const isMobile = useMobile();

const editableRequest = shallowRef(null);
const disablingRequest = shallowRef(null);
const viewingRequest = shallowRef(null);

const formRequestIsVisible = ref(false);
const formDisableIsVisible = ref(false);
const requestViewIsVisible = ref(false);

const firstPagination = useTemplateRef('firstPagination');
const pagination = ref(null);
const requests = ref([]);

const currentViewComponentName = computed(() => {
    if (isMobile) return CompanyRequestTableMobile;
    return isCardView.value ? CompanyRequestTableMobile : CompanyRequestTable;
});

const formKeysOnlyArray = [
    'directions',
    'districts',
    'regions',
    'objectTypesGeneral',
    'objectTypes',
    'gateTypesGeneral',
    'gateTypes',
    'objectClasses',
    'consultant_ids'
];

async function fetchRequests() {
    isLoading.value = true;

    const payload = { ...route.query };

    singleToArrayByKeys(payload, formKeysOnlyArray);

    try {
        const response = await api.request.search(payload);

        if (response) {
            requests.value = response.data;
            pagination.value = response.pagination;
        }
    } finally {
        isLoading.value = false;
    }
}

const { currentUserId } = useAuth();
const router = useRouter();

const { next, nextWithScroll, queryIsInitialized } = useTableContent(fetchRequests, {
    scrollTo: firstPagination,
    initQuery: async () => {
        const query = { ...route.query };

        const queryIsEmpty = Object.keys(query).length === 0;

        if (queryIsEmpty) {
            await router.replace({ query: { consultant_ids: [currentUserId.value] } });
        }
    }
});

const editRequest = request => {
    editableRequest.value = request;
    formRequestIsVisible.value = true;
};

const viewRequest = request => {
    viewingRequest.value = request;
    requestViewIsVisible.value = true;
};

const toggleDisableRequest = async request => {
    if (request.status === 0) {
        const confirmed = await confirm(
            'Восстановить запрос',
            'Вы уверены, что хотите восстановить запрос?'
        );
        if (!confirmed) return;

        await api.request.undisable(request.id);
        onRequestUpdated(request);
    } else {
        disablingRequest.value = request;
        formDisableIsVisible.value = true;
    }
};

const onRequestUpdated = async request => {
    const requestResponse = await api.request.search({
        id: request.id
    });

    if (requestResponse?.data?.length) {
        Object.assign(request, requestResponse.data[0]);
    }

    formDisableIsVisible.value = false;
    formRequestIsVisible.value = false;
    editableRequest.value = null;
    disablingRequest.value = null;
};

const userCanEdit = request => {
    return (
        Number(request.consultant_id) === Number(store.getters.THIS_USER.id) ||
        store.getters.isModerator
    );
};

const openInChat = request => {
    openChat(request.company_id, request.id, 'request');
};

const toChatFromView = () => {
    openInChat(viewingRequest);
    viewingRequest.value = null;
    requestViewIsVisible.value = false;
};
</script>
