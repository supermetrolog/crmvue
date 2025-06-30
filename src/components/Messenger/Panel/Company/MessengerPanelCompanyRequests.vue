<template>
    <div>
        <div v-if="isLoading" class="messenger-panel-company__list">
            <MessengerDialogRequestSkeleton v-for="i in lastRenderedObjectCount()" :key="i" />
        </div>
        <EmptyData v-else-if="!requests.length" no-rounded>Активные запросы не найдены..</EmptyData>
        <VirtualDragList
            v-if="requests.length"
            v-show="!isLoading"
            ref="virtualList"
            v-model="requests"
            disabled
            data-key="id"
            class="messenger-panel-company__list"
            :keeps="20"
        >
            <template #item="{ record }">
                <MessengerDialogRequest
                    @click="
                        selectChat({
                            dialogID: record.id,
                            dialogType: record.model_type
                        })
                    "
                    @update-call="
                        updateCall(
                            {
                                companyID: record.model.company_id,
                                chatMemberID: record.id
                            },
                            record
                        )
                    "
                    :current="record.id === currentDialogID"
                    :model="record.model"
                    :statistic="record.statistic"
                    :last-call="record.last_call"
                />
            </template>
            <template v-if="requests.length >= 20" #footer>
                <InfiniteLoading @infinite="loadRequests">
                    <template #complete><span></span></template>
                    <template #spinner>
                        <Spinner />
                    </template>
                </InfiniteLoading>
            </template>
        </VirtualDragList>
    </div>
</template>
<script setup>
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogRequestSkeleton from '@/components/Messenger/Dialog/MessengerDialogRequestSkeleton.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import { useStore } from 'vuex';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import Spinner from '@/components/common/Spinner.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, inject, useTemplateRef, watch } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { useTimeoutFn } from '@vueuse/core';

const lastRenderedObjectCount = inject('lastRenderedObjectCount');
const setLastRendererObjectCount = inject('setLastRendererObjectCount');

const props = defineProps({
    companyID: {
        type: Number,
        required: true
    }
});

const { isLoading } = useDelayedLoader();
const store = useStore();

const getCompanyRequests = (page = 1) =>
    store.dispatch('Messenger/getCompanyChats', {
        companyID: props.companyID,
        modelType: 'request',
        page,
        status: 1
    });

const { items: requests, pagination, load: loadRequests } = useInfiniteLoading(getCompanyRequests);

const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');

const currentDialogID = computed(() => store.state.Messenger.currentPanelDialogID);

const virtual = useTemplateRef('virtualList');

const { start: scrollToTarget } = useTimeoutFn(
    () => {
        if (isNotNullish(currentDialogID.value)) {
            virtual.value.scrollToKey(currentDialogID.value);
        }
    },
    100,
    { immediate: false }
);

watch(isLoading, value => {
    if (!value) {
        setLastRendererObjectCount(Math.min(requests.value.length, 3) || 1);
        scrollToTarget();
    }
});

function selectChat(options) {
    store.dispatch('Messenger/selectChat', options);
}

async function updateCall(payload, record) {
    const response = await showLastCallPopup(payload);
    if (response) record.last_call = response.lastCall;
}

async function fetchRequests() {
    isLoading.value = true;

    const data = await getCompanyRequests();

    requests.value = data.data;
    pagination.value = data.pagination;

    isLoading.value = false;
}

fetchRequests();
</script>
