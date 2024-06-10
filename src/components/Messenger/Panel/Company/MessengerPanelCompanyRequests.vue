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
                    :current="record.id === currentDialogID"
                    :model="record"
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
import { mapActions, mapState } from 'vuex';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import Spinner from '@/components/common/Spinner.vue';

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
    mixins: [LoaderMixin],
    inject: ['lastRenderedObjectCount', 'setLastRendererObjectCount'],
    props: {
        companyID: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            requests: [],
            pagination: null
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
            selectChat: 'Messenger/selectChat',
            getCompanyRequests: 'Messenger/getCompanyChats'
        }),
        async fetchRequests() {
            this.loadingState = true;

            const data = await this.getCompanyRequests({
                companyID: this.companyID,
                modelType: 'request'
            });

            this.requests = data.data;
            this.pagination = data.pagination;

            this.loadingState = false;
        },
        async loadRequests($state) {
            if (this.pagination.currentPage === this.pagination.pageCount) {
                $state.complete();
                return;
            }

            const data = await this.getCompanyRequests({
                companyID: this.companyID,
                modelType: 'request',
                page: this.pagination.currentPage + 1
            });

            if (data.data?.length) this.requests.push(...data.data);
            if (data.pagination) this.pagination = data.pagination;

            if (this.pagination.currentPage === this.pagination.pageCount) $state.complete();
            $state.loaded();
        }
    },
    created() {
        this.fetchRequests();
    }
};
</script>
