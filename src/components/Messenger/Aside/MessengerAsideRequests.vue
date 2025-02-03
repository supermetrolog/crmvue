<template>
    <MessengerAsideSection
        ref="list"
        class="messenger-aside-requests"
        :class="{ loading: isLoading }"
        :loading="isLoading"
        :title="`Запросы (${requests.length}/${pagination?.totalCount || 0})`"
    >
        <template v-if="isLoading">
            <MessengerDialogRequestSkeleton v-for="i in lastElementsCount" :key="i" />
        </template>
        <EmptyData v-else-if="!requests.length" no-rounded>Запросы не найдены..</EmptyData>
        <VirtualDragList
            v-if="requests.length"
            v-show="!isLoading"
            ref="virtualList"
            v-model="currentRequests"
            disabled
            data-key="id"
            class="messenger-aside__list"
            :keeps="20"
        >
            <template #item="{ record }">
                <MessengerDialogRequest
                    @click="
                        selectPanel({
                            dialogID: record.id,
                            companyID: record.model.company_id,
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
                    :class="{ skeleton: isLoading }"
                    :last-call="record.last_call"
                />
            </template>
            <template v-if="requests.length >= 20" #footer>
                <InfiniteLoading @infinite="$emit('load', $event)">
                    <template #complete><span></span></template>
                    <template #spinner>
                        <MessengerDialogRequestSkeleton />
                    </template>
                </InfiniteLoading>
            </template>
        </VirtualDragList>
    </MessengerAsideSection>
</template>
<script setup>
import MessengerAsideSection from '@/components/Messenger/Aside/MessengerAsideSection.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogRequestSkeleton from '@/components/Messenger/Dialog/MessengerDialogRequestSkeleton.vue';
import VirtualDragList from 'vue-virtual-draglist';
import InfiniteLoading from 'v3-infinite-loading';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, toRef, useTemplateRef, watch } from 'vue';
import { useSkeleton } from '@/composables/useSkeleton.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useStore } from 'vuex';
import { messenger } from '@/const/messenger.js';
import { useMessengerContext } from '@/components/Messenger/useMessengerContext.js';

defineEmits(['load']);
const props = defineProps({
    requests: {
        type: Array,
        default: () => []
    },
    pagination: {
        type: Object,
        default: null
    }
});

const store = useStore();

const { lastElementsCount } = useSkeleton(
    toRef(() => props.requests),
    { defaultCounts: 10 }
);
const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');
const { isLoading } = useDelayedLoader();

const virtualList = useTemplateRef('virtualList');
const currentRequests = computed({
    get() {
        return props.requests;
    },
    set() {}
});

const currentDialogID = computed(() => store.state.Messenger.currentAsideDialogID);

watch(
    () => store.state.Messenger.loadingAside,
    value => {
        isLoading.value = value;
    },
    { immediate: true }
);

watch(isLoading, value => {
    if (props.requests.length && value) virtualList.value.scrollToTop();
});

const { currentContentTab } = useMessengerContext();

const selectPanel = options => {
    store.dispatch('Messenger/selectPanel', options);
    store.dispatch('Messenger/selectChat', options);

    currentContentTab.value = messenger.dialogTypes.REQUEST;
};

const updateCall = async (payload, record) => {
    const response = await showLastCallPopup(payload);
    if (response) record.last_call = response.lastCall;
};
</script>
