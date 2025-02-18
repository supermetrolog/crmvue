<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="3. Обратная связь от клиента"
                    :success="data.timelineStepFeedbackways.length"
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
                                success
                                :disabled="disabled || !actionsIsVisible"
                            >
                                Подтвердить выбор
                            </TimelineButton>
                            <TimelineButton
                                @click="cancel"
                                danger
                                :disabled="disabled || !actionsIsVisible"
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

<script>
import { TimelineStepMixin } from '@/components/Timeline/mixins.js';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { FeedbackWaysConfirmedComment } from '@/components/Timeline/comments.js';
import TimelineFeedbackPicker from '@/components/Timeline/TimelineFeedbackPicker.vue';
import { waitHash } from '@/utils/helpers/common/waitHash.js';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';

export default {
    name: 'TimelineStepFeedbackCommunication',
    components: {
        TimelineButton,
        TimelineFeedbackPicker,
        TimelineInfo
    },
    mixins: [TimelineStepMixin],
    data() {
        return {
            ways: [],
            actionsIsVisible: false,
            previousHash: null
        };
    },
    computed: {
        isDisabled() {
            return this.step.timelineStepObjects.length === 0;
        }
    },
    watch: {
        'ways.length': {
            handler() {
                if (this.ways.length === 0) this.actionsIsVisible = false;
                else if (this.ways.length === this.data.timelineStepFeedbackways.length) {
                    const hash = waitHash(this.ways.sort());
                    this.actionsIsVisible = hash !== this.previousHash;
                } else this.actionsIsVisible = true;
            }
        }
    },
    methods: {
        cancel() {
            this.ways = this.data.timelineStepFeedbackways.map(element => element.way);
        },
        confirm() {
            this.data.timelineStepFeedbackways = this.ways.map(element => ({
                timeline_step_id: this.data.id,
                way: element
            }));

            this.data.newActionComments = [new FeedbackWaysConfirmedComment(this.data)];
            this.data.status = 1;

            this.$emit('update-step', this.data, true);
            this.actionsIsVisible = false;
        }
    },
    created() {
        this.ways = this.data.timelineStepFeedbackways.map(element => element.way);
        this.previousHash = waitHash(this.ways.sort());
    }
};
</script>
