<template>
    <MessengerAsideSection
        v-model:filters="filters"
        @reset="resetFilters"
        class="messenger-aside-companies"
        :class="{ loading: isLoading }"
        :loading="isLoading"
        :title="`Компании (${companies.length}/${pagination?.totalCount || 0})`"
    >
        <div v-if="isLoading" class="messenger-aside__list">
            <MessengerDialogObjectSkeleton v-for="i in lastElementsCount" :key="i" />
        </div>
        <EmptyData v-else-if="!companies.length" no-rounded>Компании не найдены..</EmptyData>
        <VirtualDragList
            v-if="companies.length"
            v-show="!isLoading"
            ref="virtualList"
            v-model="currentCompanies"
            disabled
            data-key="id"
            class="messenger-aside__list"
            :keeps="20"
        >
            <template v-slot:item="{ record }">
                <MessengerDialogCompany
                    @click="
                        selectPanel({
                            dialogID: record.id,
                            companyID: record.model.id,
                            dialogType: record.model_type
                        })
                    "
                    @update-call="
                        updateCall(
                            {
                                companyID: record.model.id,
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
            <template v-if="companies.length >= 20" #footer>
                <InfiniteLoading @infinite="$emit('load', $event)" class="pt-2">
                    <template #complete><span></span></template>
                    <template #spinner>
                        <MessengerDialogObjectSkeleton />
                    </template>
                </InfiniteLoading>
            </template>
        </VirtualDragList>
    </MessengerAsideSection>
</template>
<script setup>
import MessengerAsideSection from '@/components/Messenger/Aside/MessengerAsideSection.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogObjectSkeleton from '@/components/Messenger/Dialog/Object/MessengerDialogObjectSkeleton.vue';
import { useStore } from 'vuex';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, toRef, useTemplateRef, watch } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useSkeleton } from '@/composables/useSkeleton.js';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';

const filters = defineModel('filters');
defineEmits(['load']);
const props = defineProps({
    companies: {
        type: Array,
        default: () => []
    },
    pagination: {
        type: Object,
        default: null
    }
});

const store = useStore();

const { lastElementsCount } = useSkeleton(toRef(() => props.companies));
const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');
const { isLoading } = useDelayedLoader();

const virtualList = useTemplateRef('virtualList');
const currentCompanies = computed({
    get() {
        return props.companies;
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
    if (props.companies.length && value) virtualList.value.scrollToTop();
});

const selectPanel = options => {
    store.dispatch('Messenger/selectPanel', options);
    store.dispatch('Messenger/selectChat', options);
};

const updateCall = async (payload, record) => {
    const response = await showLastCallPopup(payload);
    if (response) record.last_call = response.lastCall;
};

function resetFilters() {
    filters.value = {};
}
</script>
