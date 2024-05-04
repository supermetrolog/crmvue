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
                        companyID: request.model.object.companyID,
                        dialogID: request.model.id,
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

export default {
    name: 'MessengerPanelCompanyRequests',
    components: {
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
    data() {
        return {
            requests: [],
            isLoading: false
        };
    },
    computed: {
        ...mapState({ currentDialogID: state => state.Messenger.currentPanelDialogID })
    },
    watch: {
        isLoading: {
            handler(value) {
                if (!value) this.setLastRendererObjectCount(Math.min(this.requests.length, 3) || 1);
            },
            deep: true
        }
    },
    methods: {
        ...mapActions({
            selectChat: 'Messenger/selectChat',
            getCompanyRequests: 'Messenger/getCompanyRequests'
        }),
        async loadRequests() {
            this.isLoading = true;

            let loadingCompleted = false;
            let timeout = setTimeout(() => {
                if (loadingCompleted) this.isLoading = false;

                clearTimeout(timeout);
                timeout = null;
            }, 500);

            this.requests = await this.getCompanyRequests(this.companyID);
            loadingCompleted = true;

            if (!timeout) this.isLoading = false;
        },
        scrollToElement(element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    },
    created() {
        this.loadRequests();
    }
};
</script>
