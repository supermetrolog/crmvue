<template>
    <section class="calls-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <div class="white-block mb-3">
                        <div class="row">
                            <UiCol :cols="12">
                                <FormCallsSearch @search="debouncedFetchCalls" />
                            </UiCol>
                            <PaginationClassic
                                v-if="calls.length"
                                ref="firstPagination"
                                @next="setNextPage"
                                :pagination="pagination"
                                class="col-xxl-6 col-lg-8 col-2"
                            />
                            <UiCol :cols="calls.length ? 4 : 12" :xxl="calls.length ? 6 : 12">
                                <div class="d-flex gap-2 flex-wrap justify-content-end">
                                    <UiButton
                                        @click="createCall"
                                        color="light"
                                        icon="fa-solid fa-plus"
                                        :disabled="isLoading"
                                        small
                                    >
                                        Зафиксировать звонок
                                    </UiButton>
                                </div>
                            </UiCol>
                        </div>
                    </div>
                    <Spinner v-if="isLoading && !calls.length" />
                    <EmptyData v-else-if="!calls.length">Список звонков пуст</EmptyData>
                    <CallTable
                        v-if="calls.length"
                        @open-phone="openInSurvey"
                        @edit="editCall"
                        :loading="isLoading"
                        :calls
                    />
                    <div v-if="calls.length" v-show="!isLoading" class="white-block mt-3">
                        <PaginationClassic @next="setNextPage" :pagination="pagination" />
                    </div>
                </UiCol>
            </div>
        </div>
        <teleport to="body">
            <FormCall
                v-if="modalIsVisible"
                @close="modalIsVisible = false"
                @created="onCallCreated"
                @updated="onCallUpdated"
                :form-data="editingCall"
            />
        </teleport>
    </section>
</template>

<script setup>
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { ref, watch } from 'vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useRoute, useRouter } from 'vue-router';
import FormCallsSearch from '@/components/Forms/Calls/FormCallsSearch.vue';
import CallTable from '@/components/CallTable/CallTable.vue';
import { useDebounceFn } from '@vueuse/core';
import UiButton from '@/components/common/UI/UiButton.vue';
import FormCall from '@/components/Forms/Calls/FormCall.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);

const calls = ref([]);
const pagination = ref(null);

async function fetchCalls() {
    isLoading.value = true;

    const response = await api.call.list(createQuery());
    if (response) {
        calls.value = response.data;
        pagination.value = response.pagination;
    }

    isLoading.value = false;
}

fetchCalls();

const debouncedFetchCalls = useDebounceFn(fetchCalls, 200);

watch(() => route.query?.sort, debouncedFetchCalls);

function createQuery() {
    return route.query;
}

function setNextPage(page) {
    router.replace({ query: { ...route.query, page } });
}

// form

const modalIsVisible = ref(false);

function createCall() {
    modalIsVisible.value = true;
}

const editingCall = ref(null);

function editCall(call) {
    editingCall.value = { ...call };
    modalIsVisible.value = true;
}

function onCallCreated(call) {
    calls.value.unshift(call);
}

function onCallUpdated(call) {
    const idx = calls.value.findIndex(c => c.id === call.id);
    if (idx !== -1) Object.assign(calls.value[idx], call);
}

const { openSurvey } = useMessenger();

function openInSurvey(contact) {
    openSurvey(messenger.dialogTypes.COMPANY, contact.company_id, contact.company_id);
}
</script>
