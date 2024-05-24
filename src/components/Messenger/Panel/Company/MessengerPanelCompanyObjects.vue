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
                        dialogID: object.id,
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
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';

export default {
    name: 'MessengerPanelCompanyObjects',
    components: {
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
        }
    },
    created() {
        this.fetchObjects();
    }
};
</script>
