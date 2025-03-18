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
                    title="8. Оформление сделки"
                    :success="currentRequest.deal"
                    :disabled="!data.timelineStepObjects.length"
                    without-next
                >
                    <p>8.2. Заполните данные по сделке.</p>
                    <template #footer>
                        <TimelineButton
                            @click="dealFormIsVisible = true"
                            success
                            :disabled="disabled || !data.timelineStepObjects.length"
                        >
                            Создать сделку
                        </TimelineButton>
                    </template>
                </TimelineInfo>
            </div>
            <div class="offset-2 col-8 pb-4">
                <TimelineDeal v-if="currentRequest.deal" :deal="currentRequest.deal" />
            </div>
        </div>
    </div>
</template>

<script setup>
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import { useStore } from 'vuex';
import { useTimelineStep } from '@/composables/useTimelineStep.js';
import { shallowRef, toRef } from 'vue';
import { useRoute } from 'vue-router';
import TimelineDeal from '@/components/Timeline/TimelineDeal.vue';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';

const store = useStore();
const route = useRoute();

const emit = defineEmits(['update-step', 'updated-objects', 'next-step']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const dealFormIsVisible = shallowRef(false);
const { currentRequest, data } = useTimelineStep(toRef(props, 'step'));

const updateStep = form => {
    data.value.deal = form;
    data.value.status = 1;

    emit('update-step', data.value, false, () => {
        store.dispatch('FETCH_COMPANY_REQUESTS', route.params.id);
    });
};
</script>
