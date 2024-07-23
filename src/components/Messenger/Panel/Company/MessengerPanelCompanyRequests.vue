<template>
    <div>
        <div v-if="isLoading" class="messenger-panel-company__list">
            <MessengerDialogRequestSkeleton v-for="i in lastRenderedObjectCount()" :key="i" />
        </div>
        <EmptyData v-else-if="!requests.length" no-rounded>Запросы не найдены..</EmptyData>
        <VirtualDragList
            v-if="requests.length"
            v-show="!isLoading"
            ref="virtualList"
            disabled
            :data-source="requests"
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
<script>
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogRequestSkeleton from '@/components/Messenger/Dialog/MessengerDialogRequestSkeleton.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import { mapActions, mapState, useStore } from 'vuex';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import Spinner from '@/components/common/Spinner.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

export default {
    name: 'MessengerPanelCompanyRequests',
    components: {
        Spinner,
        VirtualDragList,
        InfiniteLoading,
        MessengerDialogRequest,
        MessengerDialogRequestSkeleton,
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
        const getCompanyRequests = (page = 1) =>
            store.dispatch('Messenger/getCompanyChats', {
                companyID: props.companyID,
                modelType: 'request',
                page
            });

        const {
            items: requests,
            pagination,
            load: loadRequests
        } = useInfiniteLoading(getCompanyRequests);

        const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');

        return {
            requests,
            pagination,
            isLoading,
            loadRequests,
            getCompanyRequests,
            showLastCallPopup
        };
    },
    computed: {
        ...mapState({ currentDialogID: state => state.Messenger.currentPanelDialogID })
    },
    watch: {
        isLoading(value) {
            if (!value) this.setLastRendererObjectCount(Math.min(this.requests.length, 3) || 1);
        }
    },
    methods: {
        ...mapActions({
            selectChat: 'Messenger/selectChat'
        }),
        async fetchRequests() {
            this.isLoading = true;

            const data = await this.getCompanyRequests();

            this.requests = data.data;
            this.pagination = data.pagination;

            this.isLoading = false;
        },
        async updateCall(payload, record) {
            const response = await this.showLastCallPopup(payload);
            if (response) record.last_call = response.lastCall;
        }
    },
    created() {
        this.fetchRequests();
    }
};
</script>
