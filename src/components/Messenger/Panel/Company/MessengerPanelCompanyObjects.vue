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
<script>
import MessengerDialogObject from '@/components/Messenger/Dialog/MessengerDialogObject.vue';
import MessengerDialogObjectSkeleton from '@/components/Messenger/Dialog/MessengerDialogObjectSkeleton.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { mapActions, mapState, useStore } from 'vuex';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import Spinner from '@/components/common/Spinner.vue';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

export default {
    name: 'MessengerPanelCompanyObjects',
    components: {
        Spinner,
        VirtualDragList,
        InfiniteLoading,
        MessengerDialogObjectSkeleton,
        MessengerDialogObject,
        EmptyData
    },
    inject: ['lastRenderedObjectCount', 'setLastRendererObjectCount'],
    props: {
        companyID: {
            type: Number,
            required: true
        }
    },
    setup(props) {
        const { isLoading } = useDelayedLoader();
        const store = useStore();
        const getCompanyObjects = (page = 1) =>
            store.dispatch('Messenger/getCompanyChats', {
                companyID: props.companyID,
                modelType: 'object',
                page
            });

        const {
            items: objects,
            pagination,
            load: loadObjects
        } = useInfiniteLoading(getCompanyObjects);

        const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');

        return {
            objects,
            pagination,
            isLoading,
            loadObjects,
            getCompanyObjects,
            showLastCallPopup
        };
    },
    computed: {
        ...mapState({ currentDialogID: state => state.Messenger.currentPanelDialogID })
    },
    watch: {
        isLoading(value) {
            if (!value) this.setLastRendererObjectCount(Math.min(this.objects.length, 3) || 1);
        }
    },
    methods: {
        ...mapActions({
            selectChat: 'Messenger/selectChat'
        }),
        async fetchObjects() {
            this.isLoading = true;

            const data = await this.getCompanyObjects();

            this.objects = data.data;
            this.pagination = data.pagination;

            this.isLoading = false;
        },
        async updateCall(payload, record) {
            const response = await this.showLastCallPopup(payload);
            if (response) record.last_call = response.lastCall;
        }
    },
    created() {
        this.fetchObjects();
    }
};
</script>
