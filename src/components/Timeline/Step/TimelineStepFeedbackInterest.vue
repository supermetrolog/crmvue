<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="3. Обратная связь от клиента"
                    :success="data.timelineStepObjects.length"
                >
                    <p>3.1. Выберите объекты, которые заинтересовали клиента</p>
                    <p v-if="data.timelineStepObjects.length">
                        На данный момент клиента
                        {{ infoText }}.
                    </p>
                    <template #footer>
                        <TimelineStepDefaultButtons
                            @done="submit"
                            @negative="selectNegative"
                            :objects-length="selectedObjects.length"
                            :is-negative="step.negative === 1"
                            :disabled="disabled"
                        />
                    </template>
                </TimelineInfo>
            </div>
            <div class="col-12">
                <CompanyObjectsList
                    v-if="submittedObjects?.length"
                    :objects="submittedObjects"
                    disabled
                    :loader="isGeneralLoading"
                    :view-mode="viewMode"
                    :current-step-id="step.id"
                    :label="submittedObjectsLabel"
                    class="alt"
                />
                <CompanyObjectsList
                    v-if="
                        notSubmittedObjects?.length ||
                        (!submittedObjects?.length && !notSubmittedObjects?.length)
                    "
                    @select="select"
                    @unselect="unselect"
                    @addComment="addComment"
                    :objects="notSubmittedObjects"
                    :current-objects="step.timelineStepObjects"
                    :selected-objects="selectedObjects"
                    :disabled="disabled"
                    with-separator
                    :loader="isGeneralLoading"
                    :view-mode="viewMode"
                    :current-step-id="step.id"
                    :label="notSubmittedObjectsLabel"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { TimelineStepWithObjectsMixin } from '@/components/Timeline/mixins.js';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import plural from 'plural-ru';
import TimelineStepDefaultButtons from '@/components/Timeline/TimelineStepDefaultButtons.vue';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import {
    FeedbackDoneComment,
    FeedbackOffersNotFoundComment
} from '@/components/Timeline/comments.js';

export default {
    name: 'TimelineStepFeedbackInterest',
    components: {
        CompanyObjectsList,
        TimelineStepDefaultButtons,
        TimelineInfo
    },
    mixins: [TimelineStepWithObjectsMixin],
    data() {
        return {
            isAlreadySent: false,
            currentRecommendedFilter: null,
            queryParams: null
        };
    },
    computed: {
        infoText() {
            return plural(
                this.data.timelineStepObjects.length,
                'заинтересовал %d объект',
                'заинтересовало %d объекта',
                'заинтересовало %d объектов'
            );
        },
        submittedObjectsLabel() {
            return (
                'Выбранные предложения' +
                (this.submittedObjects?.length ? ` (${this.submittedObjects.length})` : '')
            );
        },
        notSubmittedObjectsLabel() {
            return this.submittedObjects?.length
                ? `Оставшиеся предложения (${this.notSubmittedObjects.length})`
                : '';
        }
    },
    methods: {
        async submit() {
            await this.done();
            this.$emit('next-step');
        },
        getNegativeComment(step) {
            return [new FeedbackOffersNotFoundComment(step)];
        },
        getDoneComment(step) {
            return [new FeedbackDoneComment(step)];
        }
    }
};
</script>

<style></style>
