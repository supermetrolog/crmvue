<template>
    <div class="messenger-panel-company__list">
        <template v-if="isLoading">
            <MessengerDialogRequestSkeleton v-for="i in lastRenderedObjectCount()" :key="i" />
        </template>
        <template v-else-if="requests.length">
            <MessengerDialogRequest
                v-for="request in requests"
                :key="request.id"
                @click="
                    selectChat({
                        dialogID: request.id,
                        dialogType: request.model_type
                    })
                "
                :current="request.id === currentDialogID"
                :model="request"
            />
        </template>
        <EmptyData v-else no-rounded>Запросы не найдены..</EmptyData>
    </div>
</template>
<script>
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogRequestSkeleton from '@/components/Messenger/Dialog/MessengerDialogRequestSkeleton.vue';
import MessengerDialogRequest from '@/components/Messenger/Dialog/MessengerDialogRequest.vue';
import { mapActions, mapState } from 'vuex';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';

export default {
    name: 'MessengerPanelCompanyRequests',
    components: {
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
            pagination: null,
            loadingState: false
        };
    },
    computed: {
        ...mapState({ currentDialogID: state => state.Messenger.currentPanelDialogID }),
        originalLoader() {
            return this.loadingState;
        }
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
        }
    },
    created() {
        this.fetchRequests();
    }
};
</script>
