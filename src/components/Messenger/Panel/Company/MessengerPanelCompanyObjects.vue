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
                    :current="record.id === currentDialogID"
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
import { mapActions, mapState } from 'vuex';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import Spinner from '@/components/common/Spinner.vue';

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
            objects: [],
            pagination: null
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
            selectChat: 'Messenger/selectChat',
            getCompanyObjects: 'Messenger/getCompanyChats'
        }),
        async fetchObjects() {
            this.loadingState = true;

            const data = await this.getCompanyObjects({
                companyID: this.companyID,
                modelType: 'object'
            });

            this.objects = data.data;
            this.pagination = data.pagination;

            this.loadingState = false;
        },
        async loadObjects($state) {
            if (this.pagination.currentPage === this.pagination.pageCount) {
                $state.complete();
                return;
            }

            const data = await this.getCompanyObjects({
                companyID: this.companyID,
                modelType: 'object',
                page: this.pagination.currentPage + 1
            });

            if (data.data?.length) this.objects.push(...data.data);
            if (data.pagination) this.pagination = data.pagination;

            if (this.pagination.currentPage === this.pagination.pageCount) $state.complete();
            $state.loaded();
        }
    },
    created() {
        this.fetchObjects();
    }
};
</script>
