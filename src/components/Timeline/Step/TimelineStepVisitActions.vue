<template>
    <div class="step-actions">
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepVisit
                                @done="done"
                                @negative="negative"
                                :step="step"
                                :buttons="buttons"
                                :disabled="disabled"
                            />
                            <CompanyObjectsList
                                v-if="submittedObjects?.length"
                                :objects="submittedObjects"
                                :disabled="true"
                                :loader="loader"
                                :view-mode="viewMode"
                                :current-step-id="step.id"
                                :label="
                                    'Выбранные предложения' +
                                    (submittedObjects.length ? ` (${submittedObjects.length})` : '')
                                "
                                class="success"
                            />
                            <CompanyObjectsList
                                v-if="
                                    notSubmittedObjects.length ||
                                    (!submittedObjects.length && !notSubmittedObjects.length)
                                "
                                @select="select"
                                @unSelect="unSelect"
                                @addComment="addComment"
                                :objects="notSubmittedObjects"
                                :current-objects="step.timelineStepObjects"
                                :selected-objects="selectedObjects"
                                :disabled="disabled"
                                :with-separator="true"
                                :loader="loader"
                                :view-mode="viewMode"
                                :current-step-id="step.id"
                                :label="
                                    submittedObjects?.length
                                        ? `Оставшиеся предложения (${notSubmittedObjects.length})`
                                        : ''
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MixinStepActions } from '@/components/Timeline/mixins.js';
import { MixinObject } from '@/components/Company/Object/mixins.js';
import { VisitDoneComment, VisitOffersNotFound } from '@/components/Timeline/comments.js';
import TimelineStepVisit from '@/components/Timeline/Step/TimelineStepVisit.vue';

export default {
    name: 'TimelineStepVisitActions',
    components: {
        TimelineStepVisit
    },
    mixins: [MixinStepActions, MixinObject],
    methods: {
        updatedObjects(data) {
            this.$emit('updatedObjects', data, true);
        },
        getNegativeComment(step) {
            return [new VisitOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new VisitDoneComment(step, this.selectedObjects)];
        }
    }
};
</script>

<style></style>
