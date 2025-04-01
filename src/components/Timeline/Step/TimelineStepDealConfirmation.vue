<template>
    <div class="timeline-step">
        <teleport to="body">
            <FormCompanyDeal
                v-if="dealFormIsVisible"
                @close="dealFormIsVisible = false"
                @created="updateStep"
                @updated="updateStep"
                :formdata="request.deal"
                :company_id="request.company_id"
                :request_id="request.id"
                :deal-type="request.dealType"
                :object_id="step.objects[0].offer.object_id"
                :complex_id="step.objects[0].offer.complex_id"
                :type_id="step.objects[0].offer.type_id"
                :original_id="step.objects[0].offer.original_id"
                :visual_id="step.objects[0].offer.visual_id"
                is-our-deal
            />
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="8. Оформление сделки"
                    :success="step.status === 1"
                    :disabled="!step.objects.length"
                    without-next
                    :step
                    :timeline
                >
                    <p>8.2. Заполните данные по сделке.</p>
                    <template #footer>
                        <TimelineButton
                            @click="dealFormIsVisible = true"
                            :disabled="disabled || !step.objects.length"
                            color="success"
                            icon="fa-solid fa-check"
                        >
                            Оформить сделку
                        </TimelineButton>
                    </template>
                </TimelineInfo>
            </div>
            <div class="offset-2 col-8 pb-4">
                <TimelineDeal v-if="request.deal" :deal="request.deal" />
            </div>
        </div>
    </div>
</template>

<script setup>
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import { useStore } from 'vuex';
import { shallowRef, toRef } from 'vue';
import { useRoute } from 'vue-router';
import TimelineDeal from '@/components/Timeline/TimelineDeal.vue';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';
import { useTimelineContext } from '@/components/Timeline/useTimelineContext.js';

const store = useStore();
const route = useRoute();

const emit = defineEmits(['update-step', 'updated-objects', 'next-step']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    disabled: Boolean
});

const dealFormIsVisible = shallowRef(false);
const { request, generatePayload, timeline } = useTimelineContext(toRef(props, 'step'));

const updateStep = () => {
    emit('update-step', generatePayload({ status: 1 }), false, () => {
        store.dispatch('FETCH_COMPANY_REQUESTS', route.params.id);
    });
};
</script>
