<template>
    <div v-if="data" class="col-12 company-form px-0">
        <TimelineStepStage
            class="mb-2"
            :title="
                'Шаг 1. отметить объекты, которые заинтересовали клиента' +
                (data.timelineStepObjects.length ? ` (${data.timelineStepObjects.length})` : '')
            "
            :is-done="!!data.timelineStepObjects.length"
            :close-slot-when-done="false"
            :is-current="!data.timelineStepObjects.length"
        >
            <ButtonList
                v-if="!disabled"
                @done="$emit('done')"
                @negative="$emit('negative')"
                :buttons="buttons"
            />
        </TimelineStepStage>
        <TimelineStepStage
            class="mb-2"
            title="Шаг 2. Отметить каким способом была получена обратная связь"
            :is-done="!!data.timelineStepFeedbackways.length"
            :close-slot-when-done="false"
            :is-current="!!data.timelineStepObjects.length"
        >
            <div v-if="!disabled" class="col-7 pp">
                <div class="row">
                    <div class="col-9 pl-2">
                        <Checkbox
                            v-model="ways"
                            @change="onChange"
                            :options="feedbackWayList"
                            mode="text"
                            :disabled="disabled"
                        />
                    </div>
                    <div class="col-3 p-0 text-left">
                        <template v-if="actionsVisible">
                            <button
                                id="btn-feedback"
                                @click="confirm"
                                :disabled="disabled"
                                class="btn-action text-primary p-0 d-inline"
                            >
                                <i class="fas fa-check"></i>
                            </button>
                            <button
                                id="btn-feedback"
                                @click="cancel"
                                :disabled="disabled"
                                class="btn-action text-danger p-0"
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </TimelineStepStage>
    </div>
</template>

<script>
import { FeedbackList, ObjectTypeList } from '@/const/const.js';
import { MixinSteps } from '@/components/Timeline/mixins.js';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import { FeedbackWaysConfirmedComment } from '@/components/Timeline/comments.js';
import TimelineStepStage from '@/components/Timeline/Step/TimelineStepStage.vue';

export default {
    name: 'TimelineStepFeedback',
    components: {
        TimelineStepStage,
        Checkbox
    },
    mixins: [MixinSteps],
    emits: ['done', 'negative'],
    data() {
        return {
            ways: [],
            actionsVisible: false
        };
    },
    computed: {
        feedbackWayList: () => FeedbackList,
        objectTypeListPlot: () => ObjectTypeList.plot
    },
    methods: {
        cancel() {
            this.ways = [];
            this.data.timelineStepFeedbackways.map(item => {
                this.ways.push(item.way);
            });
            setTimeout(() => {
                this.actionsVisible = false;
            }, 0);
        },
        confirm() {
            this.data.timelineStepFeedbackways = [];
            this.ways.map(item => {
                this.data.timelineStepFeedbackways.push({
                    timeline_step_id: this.data.id,
                    way: item
                });
            });
            this.data.newActionComments = [new FeedbackWaysConfirmedComment(this.data)];
            this.data.status = 1;
            this.$emit('updateItem', this.data, true);
            this.actionsVisible = false;
        },
        onChange() {
            this.actionsVisible = true;
        }
    },
    mounted() {
        this.data.timelineStepFeedbackways.map(item => {
            this.ways.push(item.way);
        });
    }
};
</script>

<style lang="scss">
#btn-feedback {
    padding: 3px 5px !important;
}
</style>
