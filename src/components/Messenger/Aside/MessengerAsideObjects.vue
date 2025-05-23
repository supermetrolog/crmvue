<template>
    <MessengerAsideSection
        v-model:filters="filters"
        @reset="resetFilters"
        :loading="isLoading"
        :title="`Предложения (${pagination?.totalCount || 0})`"
        :class="{ loading: isLoading }"
        class="messenger-aside-offers"
    >
        <template #filters>
            <MessengerAsideFiltersForObjects v-model="filters" />
        </template>
        <div v-if="isLoading" class="messenger-aside__list">
            <MessengerDialogObjectSkeleton v-for="i in lastElementsCount" :key="i" />
        </div>
        <EmptyData v-else-if="!objects.length" no-rounded>Предложения не найдены..</EmptyData>
        <VirtualDragList
            v-if="objects.length"
            v-show="!isLoading"
            ref="virtualList"
            v-model="currentObjects"
            disabled
            data-key="id"
            class="messenger-aside__list"
            :keeps="20"
        >
            <template v-slot:item="{ record }">
                <MessengerDialogObject
                    @click="
                        selectPanel({
                            dialogID: record.id,
                            companyID: record.model.object.company?.id,
                            dialogType: record.model_type
                        })
                    "
                    @update-call="
                        updateCall(
                            {
                                companyID: record.model.object.company?.id,
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
                    :last-message="record.last_message"
                    show-company
                />
            </template>
            <template v-if="objects.length >= 20" #footer>
                <InfiniteLoading @infinite="$emit('load', $event)">
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
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
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
import { useMessengerContext } from '@/components/Messenger/useMessengerContext.js';
import { messenger } from '@/const/messenger.js';
import MessengerAsideFiltersForObjects from '@/components/Messenger/Aside/Filters/MessengerAsideFiltersForObjects.vue';

const filters = defineModel('filters', { type: Object });
defineEmits(['load']);
const props = defineProps({
    objects: {
        type: Array,
        default: () => []
    },
    pagination: {
        type: Object,
        default: null
    }
});

const store = useStore();

const { lastElementsCount } = useSkeleton(toRef(() => props.objects));
const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');
const { isLoading } = useDelayedLoader();

const virtualList = useTemplateRef('virtualList');
const currentObjects = computed({
    get() {
        return props.objects;
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
    if (props.objects.length && value) virtualList.value.scrollToTop();
});

const { currentContentTab } = useMessengerContext();

const selectPanel = options => {
    store.dispatch('Messenger/selectPanel', options);
    store.dispatch('Messenger/selectChat', options);

    currentContentTab.value = messenger.dialogTypes.OBJECT;
};

const updateCall = async (payload, record) => {
    const response = await showLastCallPopup(payload);
    if (response) record.last_call = response.lastCall;
};

function resetFilters() {
    filters.value = {};
}
</script>
