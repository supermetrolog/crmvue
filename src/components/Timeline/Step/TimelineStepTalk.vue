<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="7. Подготовка к переговорам"
                    :success="data.timelineStepObjects.length"
                >
                    <p>Отметьте объекты, по которым клиент готов провести переговоры.</p>
                    <p v-if="data.timelineStepObjects.length">
                        На данный момент
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
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import TimelineStepDefaultButtons from '@/components/Timeline/TimelineStepDefaultButtons.vue';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { plural } from '@/utils/plural.js';
import { TalkDoneComment, TalkOffersNotFound } from '@/components/Timeline/comments.js';

export default {
    name: 'TimelineStepTalk',
    components: { TimelineInfo, TimelineStepDefaultButtons, CompanyObjectsList },
    mixins: [TimelineStepWithObjectsMixin],
    computed: {
        infoText() {
            return plural(
                this.data.timelineStepObjects.length,
                'выбран %d объект',
                'выбрано %d объекта',
                'выбрано %d объектов'
            );
        }
    },
    methods: {
        async submit() {
            await this.done();
            this.$emit('next-step');
        },
        getNegativeComment(step) {
            return [new TalkOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new TalkDoneComment(step, this.selectedObjects)];
        }
    }
};
</script>

<style></style>
