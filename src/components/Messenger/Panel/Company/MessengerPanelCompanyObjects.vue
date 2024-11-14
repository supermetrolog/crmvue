<template>
    <div class="messenger-panel-company__list">
        <div v-if="isLoading" class="messenger-panel-company__list">
            <MessengerDialogObjectSkeleton v-for="i in lastRenderedObjectCount()" :key="i" />
        </div>
        <EmptyData v-else-if="!objects.length" no-rounded>Объекты не найдены..</EmptyData>
        <VirtualDragList
            v-if="objects.length"
            v-show="!isLoading"
            ref="virtualList"
            disabled
            :data-source="objects"
            data-key="id"
            class="messenger-panel-company__list"
            :keeps="20"
        >
            <template #item="{ record }">
                <div>
                    <MessengerDialogObject
                        @click="
                            selectChat({
                                dialogID: record.id,
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
                        :statistic="record.statistic"
                        :model="record.model"
                        :last-call="record.last_call"
                    />
                    <MessengerDialogPreview
                        :opened="
                            record.id === currentDialogID &&
                            currentTab === messenger.chatTabs.SURVEY
                        "
                    >
                        <MessengerDialogObjectPreview
                            :object-chat-member-type="record.model.type"
                            :object-id="record.model.object.id"
                        />
                    </MessengerDialogPreview>
                </div>
            </template>
            <template v-if="objects.length >= 20" #footer>
                <InfiniteLoading @infinite="loadObjects">
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
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import MessengerDialogObjectSkeleton from '@/components/Messenger/Dialog/Object/MessengerDialogObjectSkeleton.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useStore } from 'vuex';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import Spinner from '@/components/common/Spinner.vue';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, inject, onMounted, watch } from 'vue';
import MessengerDialogObjectPreview from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreview.vue';
import MessengerDialogPreview from '@/components/Messenger/Dialog/Preview/MessengerDialogPreview.vue';
import { messenger } from '@/const/messenger.js';

const lastRenderedObjectCount = inject('lastRenderedObjectCount');
const setLastRendererObjectCount = inject('setLastRendererObjectCount');

const props = defineProps({
    companyID: {
        type: Number,
        required: true
    }
});

const { isLoading } = useDelayedLoader(true);
const store = useStore();
const getCompanyObjects = async (page = 1) => {
    return await store.dispatch('Messenger/getCompanyChats', {
        companyID: props.companyID,
        modelType: 'object',
        page
    });
};

const { items: objects, pagination, load: loadObjects } = useInfiniteLoading(getCompanyObjects);

const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');

const currentDialogID = computed(() => store.state.Messenger.currentPanelDialogID);
const currentTab = computed(() => store.state.Messenger.currentChatTab);

watch(isLoading, value => {
    if (!value) setLastRendererObjectCount(Math.min(objects.value.length, 3) || 1);
});

const selectChat = options => store.dispatch('Messenger/selectChat', options);

const fetchObjects = async () => {
    isLoading.value = true;

    const response = await getCompanyObjects();

    objects.value = response.data;
    pagination.value = response.pagination;

    isLoading.value = false;
};

const updateCall = async (payload, record) => {
    const response = await showLastCallPopup(payload);
    if (response) record.last_call = response.lastCall;
};

onMounted(() => {
    fetchObjects();
});
</script>
