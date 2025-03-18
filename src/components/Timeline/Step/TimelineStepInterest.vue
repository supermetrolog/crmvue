<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="6. Анализ показа объектов"
                    :success="data.timelineStepObjects.length"
                >
                    <p>Отметьте объекты, которые заинтересовали клиента во время показа.</p>
                    <p v-if="data.timelineStepObjects.length">
                        На данный момент клиент заинтетересован в
                        {{ infoText }}.
                    </p>
                    <template #footer>
                        <TimelineStepDefaultButtons
                            @negative="selectNegative"
                            @done="submit"
                            :objects-length="selectedObjects?.length"
                            :disabled="disabled"
                            :is-negative="step.negative === 1"
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
import TimelineStepDefaultButtons from '@/components/Timeline/TimelineStepDefaultButtons.vue';
import { plural } from '@/utils/plural.js';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import { InterestDoneComment, InterestOffersNotFound } from '@/components/Timeline/comments.js';

export default {
    name: 'TimelineStepInterest',
    components: { CompanyObjectsList, TimelineStepDefaultButtons, TimelineInfo },
    mixins: [TimelineStepWithObjectsMixin],
    computed: {
        infoText() {
            return plural(
                this.data.timelineStepObjects.length,
                '%d объекте',
                '%d объектах',
                '%d объектах'
            );
        }
    },
    methods: {
        async submit() {
            await this.done();
            this.$emit('next-step');
        },
        getNegativeComment(step) {
            return [new InterestOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new InterestDoneComment(step, this.selectedObjects)];
        }
    }
};
</script>

<style></style>
