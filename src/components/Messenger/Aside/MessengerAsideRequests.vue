<template>
    <MessengerAsideSection
        ref="list"
        class="messenger-aside-requests"
        :loading="isLoading"
        :title="`Запросы (${requests.length}/${pagination?.totalCount || 0})`"
    >
        <template v-if="isLoading">
            <MessengerDialogRequestSkeleton v-for="i in lastDialogsCount" :key="i" />
        </template>
        <EmptyData v-else-if="!requests.length" no-rounded>Запросы не найдены..</EmptyData>
        <VirtualDragList
            v-if="requests.length"
            v-show="!isLoading"
            ref="virtualList"
            disabled
            :data-source="requests"
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
                    :current="record.id === currentDialogID"
                    :model="record.model"
                    :class="{ skeleton: isLoading }"
                />
            </template>
            <template v-if="requests.length >= 20" #footer>
                <InfiniteLoading @infinite="loadRequests">
                    <template #complete><span></span></template>
                    <template #spinner>
                        <MessengerDialogRequestSkeleton />
                    </template>
                </InfiniteLoading>
            </template>
        </VirtualDragList>
        <!--        <MessengerAsideArchive :title="`Показать архивные запросы (${requests.length})`">-->
        <!--            <div v-if="requests.length" class="messenger-aside__list">-->
        <!--                <template v-if="isLoading">-->
        <!--                    <MessengerDialogRequestSkeleton v-for="i in lastDialogsCount" :key="i" />-->
        <!--                </template>-->
        <!--                <template v-else>-->
        <!--                    <MessengerDialogRequest-->
        <!--                        v-for="request in requests"-->
        <!--                        :key="request.id"-->
        <!--                        @click="-->
        <!--                            selectPanel({-->
        <!--                                dialogID: request.id,-->
        <!--                                companyID: request.model.company_id,-->
        <!--                                dialogType: 'request'-->
        <!--                            })-->
        <!--                        "-->
        <!--                        :current="request.id === currentDialogID"-->
        <!--                        :model="request.model"-->
        <!--                        class="archived"-->
        <!--                    />-->
        <!--                </template>-->
        <!--            </div>-->
        <!--            <EmptyData v-else no-rounded>Запросы не найдены..</EmptyData>-->
        <!--        </MessengerAsideArchive>-->
    </MessengerAsideSection>
</template>
<script>
import MessengerAsideSection from '@/components/Messenger/Aside/MessengerAsideSection.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogRequestSkeleton from '@/components/Messenger/Dialog/MessengerDialogRequestSkeleton.vue';
import { mapState } from 'vuex';
import VirtualDragList from 'vue-virtual-draglist';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import InfiniteLoading from 'v3-infinite-loading';

export default {
    name: 'MessengerAsideRequests',
    components: {
        InfiniteLoading,
        VirtualDragList,
        MessengerDialogRequestSkeleton,
        EmptyData,
        MessengerDialogRequest,
        MessengerAsideSection
    },
    mixins: [LoaderMixin],
    props: {
        requests: {
            type: Array,
            default: () => []
        },
        pagination: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            lastDialogsCount: 5
        };
    },
    computed: {
        ...mapState({
            originalLoader: state => state.Messenger.loadingAside,
            currentDialogID: state => state.Messenger.currentAsideDialogID
        })
    },
    watch: {
        requests(value) {
            this.lastDialogsCount = Math.min(value.length, 5) || 1;
        },
        async isLoading(value) {
            if (this.requests.length && value) this.$refs.virtualList.scrollToTop();
        }
    },
    methods: {
        selectPanel(options) {
            this.$store.dispatch('Messenger/selectPanel', options);
            this.$store.dispatch('Messenger/selectChat', options);
        },
        async loadRequests($state) {
            const isLastPage = await this.$store.dispatch('Messenger/loadDialogs', 'request');
            if (isLastPage) $state.complete();
            else $state.loaded();
        }
    }
};
</script>
