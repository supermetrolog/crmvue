<template>
    <CompanyBoxLayout>
        <template #header>
            <div class="d-flex align-items-center gap-2">
                <span>
                    ЗАПРОСЫ ({{ requests.length }}), СДЕЛКИ ({{ dealsCount + deals.length }})
                </span>
                <UiButton
                    @click="$emit('create-request')"
                    class="ml-auto"
                    color="light"
                    small
                    icon="fa-solid fa-plus"
                >
                    Создать запрос
                </UiButton>
            </div>
        </template>
        <template #content>
            <div class="position-relative">
                <Loader v-if="isLoading" small label="Восстановление запроса" />
                <CompanyBoxRequestsList
                    v-if="requests.length"
                    @update="$emit('update-request', $event)"
                    @clone="cloneRequest"
                    @disable="toggleRequestStatus"
                    @change-consultant="changeRequestConsultant"
                    :requests
                />
                <DealList
                    v-if="deals.length"
                    @update="$emit('update-deal', $event)"
                    @deleted="$emit('deal-deleted')"
                    :deals
                />
                <div v-if="!requests.length && !deals.length" class="company-box-empty">
                    <EmptyData class="company-box-empty__data">Нет данных</EmptyData>
                </div>
            </div>
            <teleport to="body">
                <UiModal
                    v-slot="{ close }"
                    v-model:visible="disableModalIsVisible"
                    @closed="onDisableModelClosed"
                    :title="`Завершение запроса #${disabledRequestItem?.id}`"
                    :width="600"
                >
                    <FormCompanyRequestDisable
                        @disabled="onRequestDisabled"
                        @cancel="close"
                        :request_id="disabledRequestItem?.id"
                    />
                </UiModal>
                <FormModalCompanyRequestClone
                    v-if="cloneModalIsVisible"
                    @close="cloneModalIsVisible = false"
                    @cloned="onRequestCloned"
                    :request="clonedRequestItem"
                />
                <FormModalCompanyRequestChangeConsultant
                    v-if="changeModalIsVisible"
                    @close="changeModalIsVisible = false"
                    @changed="onRequestConsultantChanged"
                    :request="changedRequest"
                />
            </teleport>
        </template>
    </CompanyBoxLayout>
</template>

<script setup>
import api from '@/api/api';
import CompanyBoxRequestsList from '@/components/Company/Box/CompanyBoxRequestsList.vue';
import DealList from '@/components/Deal/DealList.vue';
import CompanyBoxLayout from '@/components/Company/Box/CompanyBoxLayout.vue';
import FormModalCompanyRequestClone from '@/components/Forms/Company/FormModalCompanyRequestClone.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed, ref, shallowRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import UiModal from '@/components/common/UI/UiModal.vue';
import FormCompanyRequestDisable from '@/components/Forms/Company/FormCompanyRequestDisable.vue';
import Loader from '@/components/common/Loader.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import FormModalCompanyRequestChangeConsultant from '@/components/Forms/Company/FormModalCompanyRequestChangeConsultant.vue';
import { useNotify } from '@/utils/use/useNotify.js';

const emit = defineEmits([
    'update-deal',
    'deal-deleted',
    'create-request',
    'update-request',
    'request-cloned',
    'request-disabled',
    'request-updated'
]);

const props = defineProps({
    requests: {
        type: Array,
        default: () => []
    },
    deals: {
        type: Array,
        default: () => []
    }
});

const dealsCount = computed(() =>
    props.requests.reduce((acc, request) => acc + Number(isNotNullish(request.deal)), 0)
);

// disable

const disableModalIsVisible = ref(false);
const disabledRequestItem = shallowRef(null);

function onDisableModelClosed() {
    disabledRequestItem.value = false;
}

function toggleRequestStatus(request) {
    if (request.status === 0) {
        undisableRequest(request);
    } else {
        disabledRequestItem.value = request;
        disableModalIsVisible.value = true;
    }
}

const { confirm } = useConfirm();

const isLoading = ref(false);

async function undisableRequest(request) {
    const confirmed = await confirm({
        title: 'Восстановление запроса',
        message: 'Вы уверены, что хотите восстановить архивный запрос?',
        okButton: 'Восстановить',
        okIcon: 'fa-solid fa-undo'
    });

    if (!confirmed) return;

    isLoading.value = true;

    try {
        const undisabled = await api.request.undisable(request.id);

        if (undisabled) {
            disabledRequestItem.value = null;
            emit('request-disabled');
        }
    } finally {
        isLoading.value = false;
    }
}

function onRequestDisabled() {
    disableModalIsVisible.value = false;
    disabledRequestItem.value = null;
    emit('request-disabled');
}

// clone

const clonedRequestItem = shallowRef(null);
const cloneModalIsVisible = ref(false);

function cloneRequest(request) {
    clonedRequestItem.value = request;
    cloneModalIsVisible.value = true;
}

function onRequestCloned() {
    cloneModalIsVisible.value = false;
    clonedRequestItem.value = null;
    emit('request-cloned');
    notify.success('Запрос успешно клонирован');
}

// change consultant

const changedRequest = shallowRef(null);
const changeModalIsVisible = ref(false);

function changeRequestConsultant(request) {
    changedRequest.value = request;
    changeModalIsVisible.value = true;
}

const notify = useNotify();

function onRequestConsultantChanged(request) {
    changeModalIsVisible.value = false;
    changedRequest.value = null;
    emit('request-updated', request);
    notify.success('Консультант компании успешно изменен');
}
</script>
