<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="5. Заполнение информации о показах"
                    :success="data.timelineStepObjects.length"
                >
                    <p>Отметьте объекты, которые осмотрели вместе с клиентом.</p>
                    <p v-if="data.timelineStepObjects.length">
                        На данный момент
                        {{ infoText }}.
                    </p>
                    <template #footer>
                        <TimelineStepDefaultButtons
                            @done="selectDone"
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
import { VisitDoneComment, VisitOffersNotFound } from '@/components/Timeline/comments.js';

export default {
    name: 'TimelineStepVisit',
    components: { CompanyObjectsList, TimelineStepDefaultButtons, TimelineInfo },
    mixins: [TimelineStepWithObjectsMixin],
    computed: {
        infoText() {
            return plural(
                this.data.timelineStepObjects.length,
                'осмотрен %d объект',
                'осметрено %d объекта',
                'осмотрено %d объектов'
            );
        }
    },
    methods: {
        getNegativeComment(step) {
            return [new VisitOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new VisitDoneComment(step, this.selectedObjects)];
        },
        async selectDone() {
            await this.done();
            this.$emit('next-step');
        }
    }
};
</script>

<style></style>
