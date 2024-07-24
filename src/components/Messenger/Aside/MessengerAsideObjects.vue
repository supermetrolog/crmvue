<template>
    <MessengerAsideSection
        class="messenger-aside-offers"
        :loading="isLoading"
        :title="`Предложения (${objects.length}/${pagination?.totalCount || 0})`"
    >
        <div v-if="isLoading" class="messenger-aside__list">
            <MessengerDialogObjectSkeleton v-for="i in lastDialogsCount" :key="i" />
        </div>
        <EmptyData v-else-if="!objects.length" no-rounded>Предложения не найдены..</EmptyData>
        <VirtualDragList
            v-if="objects.length"
            v-show="!isLoading"
            ref="virtualList"
            disabled
            :data-source="objects"
            data-key="id"
            class="messenger-aside__list"
            :keeps="20"
        >
            <template v-slot:item="{ record }">
                <MessengerDialogObject
                    @click="
                        selectPanel({
                            dialogID: record.id,
                            companyID: record.model.object.company?.id,
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
                    :model="record.model"
                    :statistic="record.statistic"
                    :class="{ skeleton: isLoading }"
                    :last-call="record.last_call"
                />
            </template>
            <template v-if="objects.length >= 20" #footer>
                <InfiniteLoading @infinite="loadObjects">
                    <template #complete><span></span></template>
                    <template #spinner>
                        <MessengerDialogObjectSkeleton />
                    </template>
                </InfiniteLoading>
            </template>
        </VirtualDragList>
        <!--        <MessengerAsideArchive-->
        <!--            :title="`Показать архивные предложения (${objects.length})`"-->
        <!--        >-->
        <!--            <div v-if="objects.length" class="messenger-aside__list">-->
        <!--                <template v-if="isLoading">-->
        <!--                    <MessengerDialogObjectSkeleton v-for="i in lastDialogsCount" :key="i" />-->
        <!--                </template>-->
        <!--                <template v-else>-->
        <!--                    <MessengerDialogObject-->
        <!--                        v-for="object in objects"-->
        <!--                        :key="object.id"-->
        <!--                        @click="-->
        <!--                            selectPanel({-->
        <!--                                companyID: object.model.object.company_id,-->
        <!--                                dialogID: object.model.id,-->
        <!--                                dialogType: object.model_type-->
        <!--                            })-->
        <!--                        "-->
        <!--                        :current="object.model.id === currentDialogID"-->
        <!--                        :model="object.model"-->
        <!--                        class="archived"-->
        <!--                    />-->
        <!--                </template>-->
        <!--            </div>-->
        <!--            <EmptyData v-else no-rounded>Предложения не найдены..</EmptyData>-->
        <!--        </MessengerAsideArchive>-->
    </MessengerAsideSection>
</template>
<script>
import MessengerDialogObject from '@/components/Messenger/Dialog/MessengerDialogObject.vue';
import MessengerAsideSection from '@/components/Messenger/Aside/MessengerAsideSection.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerDialogObjectSkeleton from '@/components/Messenger/Dialog/MessengerDialogObjectSkeleton.vue';
import { mapState } from 'vuex';
import { LoaderMixin } from '@/components/Messenger/loader.mixin.js';
import InfiniteLoading from 'v3-infinite-loading';
import VirtualDragList from 'vue-virtual-draglist';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

export default {
    name: 'MessengerAsideObjects',
    components: {
        MessengerDialogObjectSkeleton,
        MessengerDialogObject,
        EmptyData,
        MessengerAsideSection,
        InfiniteLoading,
        VirtualDragList
    },
    mixins: [LoaderMixin],
    props: {
        objects: {
            type: Array,
            default: () => []
        },
        pagination: {
            type: Object,
            default: null
        }
    },
    setup() {
        const { show: showLastCallPopup } = useAsyncPopup('chatMemberLastCall');
        return { showLastCallPopup };
    },
    data() {
        return {
            lastDialogsCount: 5
        };
    },
    computed: {
        ...mapState({
            currentDialogID: state => state.Messenger.currentAsideDialogID,
            originalLoader: state => state.Messenger.loadingAside
        })
    },
    watch: {
        objects(value) {
            this.lastDialogsCount = Math.min(value.length, 5) || 1;
        },
        async isLoading(value) {
            if (this.objects.length && value) this.$refs.virtualList.scrollToTop();
        }
    },
    methods: {
        async loadObjects($state) {
            const isLastPage = await this.$store.dispatch('Messenger/loadDialogs', 'object');
            if (isLastPage) $state.complete();
            else $state.loaded();
        },
        selectPanel(options) {
            this.$store.dispatch('Messenger/selectPanel', options);
            this.$store.dispatch('Messenger/selectChat', options);
        },
        async updateCall(payload, record) {
            const response = await this.showLastCallPopup(payload);
            if (response) record.last_call = response.lastCall;
        }
    }
};
</script>
