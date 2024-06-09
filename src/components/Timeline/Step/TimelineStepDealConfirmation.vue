<template>
    <div class="timeline-step">
        <teleport to="body">
            <FormCompanyDeal
                v-if="dealFormIsVisible"
                @close="dealFormIsVisible = false"
                @created="updateStep"
                @updated="updateStep"
                :formdata="currentRequest.deal"
                :company_id="currentRequest.company_id"
                :request_id="currentRequest.id"
                :deal-type="currentRequest.dealType"
                :object_id="data.timelineStepObjects[0].offer.object_id"
                :complex_id="data.timelineStepObjects[0].offer.complex_id"
                :type_id="data.timelineStepObjects[0].offer.type_id"
                :original_id="data.timelineStepObjects[0].offer.original_id"
                :visual_id="data.timelineStepObjects[0].offer.visual_id"
                is-our-deal
            />
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="Оформление сделки"
                    :success="currentRequest.deal"
                    :disabled="!data.timelineStepObjects.length"
                    without-next
                >
                    <p>Шаг 2. Заполните данные по сделке.</p>
                    <template #footer>
                        <Button
                            @click="dealFormIsVisible = true"
                            succes
                            :disabled="disabled || !data.timelineStepObjects.length"
                        >
                            Создать сделку
                        </Button>
                    </template>
                </TimelineInfo>
            </div>
            <div class="offset-3 col-6">
                <DealListItem v-if="currentRequest.deal" :deal="currentRequest.deal" read-only />
            </div>
        </div>
    </div>
</template>

<script>
import { TimelineStepMixin } from '@/components/Timeline/mixins.js';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { TalkDoneComment, TalkOffersNotFound } from '@/components/Timeline/comments.js';
import Button from '@/components/common/Button.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import DealListItem from '@/components/Deal/DealListItem.vue';
import { mapActions } from 'vuex';

export default {
    name: 'TimelineStepDealConfirmation',
    components: { DealListItem, FormCompanyDeal, Button, TimelineInfo },
    mixins: [TimelineStepMixin],
    data() {
        return {
            dealFormIsVisible: false
        };
    },
    computed: {},
    methods: {
        ...mapActions(['FETCH_COMPANY_REQUESTS']),
        getNegativeComment(step) {
            return [new TalkOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new TalkDoneComment(step, this.selectedObjects)];
        },
        updateStep(form) {
            this.data.deal = form;
            this.data.status = 1;

            this.$emit('update-step', this.data, false, () => {
                this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
            });
        }
    }
};
</script>

<style></style>
