<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="3. Обратная связь от клиента"
                    :success="step.feedback_ways.length"
                    :disabled="isDisabled"
                >
                    <p>3.2. Укажите, каким способом была получена обратная связь</p>
                    <template #footer>
                        <TimelineFeedbackPicker
                            v-model="ways"
                            class="mb-2"
                            :disabled="disabled || isDisabled"
                        />
                        <div class="d-flex gap-2">
                            <TimelineButton
                                @click="confirm"
                                color="success"
                                :disabled="disabled || !actionsIsVisible"
                                icon="fa-solid fa-check"
                            >
                                Подтвердить выбор
                            </TimelineButton>
                            <TimelineButton
                                @click="cancel"
                                color="danger"
                                :disabled="disabled || !actionsIsVisible"
                                icon="fa-solid fa-ban"
                            >
                                Отменить выбор
                            </TimelineButton>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
        </div>
    </div>
</template>

<script setup>
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import TimelineFeedbackPicker from '@/components/Timeline/TimelineFeedbackPicker.vue';
import { waitHash } from '@/utils/helpers/common/waitHash.js';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';
import { useTimelineContext } from '@/components/Timeline/useTimelineContext.js';
import { computed, onBeforeMount, ref, toRef, watch } from 'vue';

const emit = defineEmits(['update-step', 'updated-objects', 'next-step']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    disabled: Boolean
});

const { generatePayload } = useTimelineContext(toRef(props, 'step'));

const ways = ref([]);
const actionsIsVisible = ref(false);

const previousHash = ref(null);

const isDisabled = computed(() => props.step.objects.length === 0);

watch(
    () => ways.value.length,
    () => {
        if (ways.value.length === props.step.feedback_ways.length) {
            const hash = waitHash(ways.value.sort());
            actionsIsVisible.value = hash !== previousHash.value;
        } else {
            actionsIsVisible.value = ways.value.length > 0;
        }
    }
);

function cancel() {
    ways.value = props.step.feedback_ways.map(element => element.way);
}

function confirm() {
    const payload = generatePayload({
        feedback_ways: ways.value.map(way => ({ way })),
        status: 1,
        done: 1
    });

    // this.data.newActionComments = [new FeedbackWaysConfirmedComment(this.data)];

    emit('update-step', payload, true);

    actionsIsVisible.value = false;
}

onBeforeMount(() => {
    ways.value = props.step.feedback_ways.map(element => element.way);
    previousHash.value = waitHash(ways.value.sort());
});
</script>
