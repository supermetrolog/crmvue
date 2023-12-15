<template>
    <div class="timeline-header">
        <teleport to="body">
            <FormModalCompanyRequestDisable
                v-if="disableFormVisible"
                @disabled="disabledTimeline"
                @close="clickCloseDisableForm"
                title="Завершение таймлана"
                :request_id="currentRequest.id"
            />
        </teleport>
        <teleport to="body">
            <FormCompanyDeal
                v-if="dealFormVisible"
                @close="clickCloseDealForm"
                @created="createdDeal"
                :company_id="currentRequest.company_id"
                :request_id="currentRequest.id"
            />
        </teleport>
        <div>
            <TimelineStatus v-if="currentRequest && TIMELINE" :request="currentRequest" :timeline="TIMELINE" />
        </div>
        <div>
            <div v-if="TIMELINE_LIST.length" class="timeline-list">
                <div
                    v-for="timeline in TIMELINE_LIST"
                    :key="timeline.id"
                    class="timeline-actions timeline-list-item p-1"
                >
                    <CustomButton
                        @confirm="changeTimeline(timeline.consultant.id)"
                        :options="{
                            btnActive: $route.query.consultant_id == timeline.consultant.id,
                            btnClass: 'primary',
                            defaultBtn: true,
                            disabled: false
                        }"
                    >
                        <template #btnContent>
                            {{ timeline.consultant.userProfile.short_name }}
                        </template>
                    </CustomButton>
                </div>
            </div>
        </div>
        <div>
            <div v-if="!disabled" class="timeline-list">
                <div class="timeline-actions timeline-list-item px-1">
                    <CustomButton
                        @confirm="clickOpenDisableForm"
                        :options="{
                            btnClass: 'danger',
                            defaultBtn: true,
                            disabled: disabled
                        }"
                    >
                        <template #btnContent> завершить</template>
                    </CustomButton>
                </div>
                <div class="timeline-actions timeline-list-item px-1">
                    <CustomButton
                        @confirm="clickOpenDealForm"
                        :options="{
                            btnClass: 'primary',
                            defaultBtn: true,
                            disabled: disabled
                        }"
                    >
                        <template #btnContent> создать сделку</template>
                    </CustomButton>
                </div>
                <div class="timeline-actions timeline-list-item px-1">
                    <CustomButton
                        @confirm="clickOpenDisableForm"
                        :options="{
                            btnClass: 'warning',
                            defaultBtn: true,
                            disabled: true
                        }"
                    >
                        <template #btnContent> передать</template>
                    </CustomButton>
                </div>
                <div class="timeline-actions timeline-list-item px-1">
                    <CustomButton
                        @confirm="clickOpenDisableForm"
                        :options="{
                            btnClass: 'warning',
                            defaultBtn: true,
                            disabled: true
                        }"
                    >
                        <template #btnContent> отказаться</template>
                    </CustomButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TimelineStatus from './TimelineStatus.vue';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import CustomButton from '@/components/common/CustomButton.vue';

export default {
    name: 'TimelineHeader',
    components: {
        CustomButton,
        FormCompanyDeal,
        FormModalCompanyRequestDisable,
        TimelineStatus
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        currentRequest: {
            type: Object,
            required: true
        },
        timelineExist: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            disableFormVisible: false,
            dealFormVisible: false
        };
    },
    computed: {
        ...mapGetters(['TIMELINE_LIST', 'TIMELINE'])
    },
    methods: {
        ...mapActions(['FETCH_COMPANY_REQUESTS']),
        clickOpenDisableForm() {
            this.disableFormVisible = true;
        },
        clickCloseDisableForm() {
            this.disableFormVisible = false;
        },
        clickOpenDealForm() {
            this.dealFormVisible = true;
        },
        clickCloseDealForm() {
            this.dealFormVisible = false;
        },
        async createdDeal() {
            if (await this.FETCH_COMPANY_REQUESTS(this.$route.params.id)) {
                this.$emit('close');
            }
        },
        async disabledTimeline() {
            if (await this.FETCH_COMPANY_REQUESTS(this.$route.params.id)) {
                this.clickCloseDisableForm();
                this.$emit('close');
            }
        },
        async changeTimeline(consultant_id) {
            let query = {
                ...this.$route.query
            };
            query.consultant_id = consultant_id;
            query.step = 0;
            await this.$router.push({ query: query });
        }
    }
};
</script>

<style></style>
