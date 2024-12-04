<template>
    <div class="messenger-aside__page">
        <MessengerAsideConsultantsHeader @load="updateDialogs" />
        <div class="messenger-aside__body">
            <MessengerAsideSection
                v-model:filters="filters.user"
                v-model:sort="sorts"
                @reset="resetFilters"
                class="messenger-aside-users"
                :loading="isLoading"
                :title="`Сотрудники (${consultants.length}/${pagination?.totalCount || 0})`"
            >
                <div v-if="isLoading" class="messenger-aside__list">
                    <MessengerDialogUserSkeleton v-for="i in lastElementsCount" :key="i" />
                </div>
                <EmptyData v-else-if="!consultants.length" no-rounded>
                    Сотрудники не найдены..
                </EmptyData>
                <VirtualDragList
                    v-if="consultants.length"
                    v-show="!isLoading"
                    ref="virtualList"
                    disabled
                    :data-source="consultants"
                    data-key="id"
                    class="messenger-aside__list"
                    :keeps="30"
                >
                    <template v-slot:item="{ record }">
                        <MessengerDialogUser
                            @click="
                                selectPanel({
                                    dialogID: record.id,
                                    userID: record.model.id,
                                    dialogType: record.model_type
                                })
                            "
                            :current="record.id === currentDialogID"
                            :model="record.model"
                            :statistic="record.statistic"
                            :class="{ skeleton: isLoading }"
                        />
                    </template>
                    <template v-if="consultants.length >= 20" #footer>
                        <InfiniteLoading @infinite="load">
                            <template #complete><span></span></template>
                            <template #spinner>Skeleton</template>
                        </InfiniteLoading>
                    </template>
                </VirtualDragList>
            </MessengerAsideSection>
        </div>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, onBeforeMount, ref, shallowRef, watch } from 'vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerAsideSection from '@/components/Messenger/Aside/MessengerAsideSection.vue';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import MessengerDialogUser from '@/components/Messenger/Dialog/MessengerDialogUser.vue';
import MessengerAsideConsultantsHeader from '@/components/Messenger/Aside/MessengerAsideConsultantsHeader.vue';
import { useSkeleton } from '@/composables/useSkeleton.js';
import MessengerDialogUserSkeleton from '@/components/Messenger/Dialog/MessengerDialogUserSkeleton.vue';
import { useDebounceFn } from '@vueuse/core';
import { useMessengerContext } from '@/components/Messenger/useMessengerContext.js';

const props = defineProps({
    currentTab: {
        type: Object,
        default: null
    }
});

const store = useStore();
const { isLoading } = useDelayedLoader();

const virtualList = shallowRef(null);

const { filters } = useMessengerContext();
const sorts = ref(null);

const consultants = computed(() => store.state.Messenger.chatMembersUser.data);
const pagination = computed(() => store.state.Messenger.chatMembersUser.pagination);

const hasQuery = computed(() => store.getters['Messenger/hasConsultantsQuery']);
const hasDialogs = computed(() => consultants.value.length);

const { lastElementsCount } = useSkeleton(consultants, { defaultCounts: 10 });

const createPayload = () => {
    return {
        sort: props.currentTab.sort ? `${props.currentTab.sort},-default` : '-default',
        ...filters.user
    };
};

const updateDialogs = () => {
    store.dispatch('Messenger/updateConsultantsDialogs', createPayload());
};
const debouncedUpdateDialogs = useDebounceFn(updateDialogs, 500);

onBeforeMount(() => {
    if (!hasQuery.value && !hasDialogs.value) updateDialogs();
});

const currentDialogID = computed(() => store.state.Messenger.currentAsideDialogID);

watch(
    () => store.state.Messenger.loadingAside,
    value => {
        isLoading.value = value;
    }
);

watch(
    () => isLoading.value,
    value => {
        if (consultants.value.length && value) virtualList.value.scrollToTop();
    }
);

watch(filters, debouncedUpdateDialogs, { deep: true });
watch(() => props.currentTab.sort, debouncedUpdateDialogs);

const load = async $state => {
    const isLastPage = await store.dispatch('Messenger/loadDialogs', {
        modelType: 'user',
        payload: createPayload()
    });
    if (isLastPage) $state.complete();
    else $state.loaded();
};
const selectPanel = options => {
    store.dispatch('Messenger/selectPanel', options);
    store.dispatch('Messenger/selectChat', options);
};

function resetFilters() {
    filters.user = {};
}
</script>
