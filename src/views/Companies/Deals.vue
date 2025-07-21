<template>
    <section class="deals-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row">
                            <UiCol :cols="12">
                                <div class="d-flex gap-2 flex-wrap justify-content-end">
                                    <UiButton
                                        @click="createDeal"
                                        color="light"
                                        icon="fa-solid fa-plus"
                                        :disabled="isLoading"
                                        small
                                    >
                                        Создать сделку
                                    </UiButton>
                                </div>
                            </UiCol>
                        </div>
                    </div>
                    <Spinner v-if="isLoading && !deals.length" />
                    <EmptyData v-else-if="!deals.length">Список сделок пуст</EmptyData>
                    <DealTable
                        v-if="deals.length"
                        @edit="editDeal"
                        @delete="deleteDeal"
                        :loading="isLoading"
                        :deals
                    />
                </UiCol>
            </div>
        </div>
        <teleport to="body">
            <FormCompanyDeal
                v-if="modalIsVisible"
                @close="modalIsVisible = false"
                @created="onDealCreated"
                @updated="onDealUpdated"
                :form-data="editingDeal"
            />
        </teleport>
    </section>
</template>

<script setup>
import EmptyData from '@/components/common/EmptyData.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import Spinner from '@/components/common/Spinner.vue';
import { onBeforeMount, ref } from 'vue';
import api from '@/api/api.js';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import DealTable from '@/components/Deal/Table/DealTable.vue';
import { captureException } from '@sentry/vue';
import { useAsync } from '@/composables/useAsync.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useTimeoutFn } from '@vueuse/core';

const isLoading = ref(false);

const deals = ref([]);

async function fetchDeals() {
    isLoading.value = true;

    try {
        deals.value = await api.deal.list();
    } catch (error) {
        captureException(error);
    } finally {
        isLoading.value = false;
    }
}

onBeforeMount(fetchDeals);

// form

const modalIsVisible = ref(false);

function createDeal() {
    modalIsVisible.value = true;
}

const editingDeal = ref(null);

function editDeal(deal) {
    editingDeal.value = deal;
    modalIsVisible.value = true;
}

function onDealCreated() {
    fetchDeals();
}

function onDealUpdated(payload) {
    Object.assign(editingDeal.value, payload);
}

// delete

function deleteDeal(deal) {
    executeDeleteDeal(deal.id);
}

const notify = useNotify();

const { execute: executeDeleteDeal } = useAsync(api.deal.delete, {
    onFetchResponse: ({ args }) => {
        notify.success('Сделка успешно удалена.');

        deleteDealFromTable(args[0]);
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить сделку',
        message: 'Вы уверены, что хотите удалить сделку? Удаленную сделку нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

function deleteDealFromTable(dealId) {
    const index = deals.value.findIndex(deal => deal.id === dealId);
    if (index === -1) return;

    deals.value[index].isDeleting = true;

    useTimeoutFn(() => {
        deals.value.splice(index, 1);
    }, 500);
}
</script>
