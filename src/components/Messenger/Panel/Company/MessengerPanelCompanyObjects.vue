<template>
    <div class="messenger-panel-company__list">
        <template v-if="isLoading">
            <MessengerDialogObjectSkeleton v-for="i in lastRenderedObjectCount()" :key="i" />
        </template>
        <template v-else-if="objects.length">
            <MessengerDialogObject
                v-for="object in objects"
                :key="object.id"
                @click="
                    selectChat({
                        companyID: object.model.object.companyID,
                        dialogID: object.model.id,
                        dialogType: object.model_type
                    })
                "
                :current="object.id === currentDialogID"
                :model="object.model"
            />
        </template>
        <EmptyData v-else no-rounded>Предложения не найдены..</EmptyData>
    </div>
</template>
<script>
import MessengerDialogObject from '@/components/Messenger/Dialog/MessengerDialogObject.vue';
import MessengerDialogObjectSkeleton from '@/components/Messenger/Dialog/MessengerDialogObjectSkeleton.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'MessengerPanelCompanyObjects',
    components: {
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
    data() {
        return {
            objects: [],
            isLoading: false
        };
    },
    computed: {
        ...mapState({ currentDialogID: state => state.Messenger.currentPanelDialogID })
    },
    watch: {
        isLoading: {
            handler(value) {
                if (!value) this.setLastRendererObjectCount(Math.min(this.objects.length, 3) || 1);
            },
            deep: true
        }
    },
    methods: {
        ...mapActions({
            selectChat: 'Messenger/selectChat',
            getCompanyObjects: 'Messenger/getCompanyObjects'
        }),
        async loadObjects() {
            this.isLoading = true;

            let loadingCompleted = false;
            let timeout = setTimeout(() => {
                if (loadingCompleted) this.isLoading = false;

                clearTimeout(timeout);
                timeout = null;
            }, 500);

            this.objects = await this.getCompanyObjects({ company_id: this.companyID });
            loadingCompleted = true;

            if (!timeout) this.isLoading = false;
        }
    },
    created() {
        this.loadObjects();
    }
};
</script>
