<template>
    <div class="step-action">
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepFeedback
                                @updateItem="clickUpdateStep"
                                @done="done"
                                @negative="negative"
                                :step="step"
                                :disabled="disabled"
                                :buttons="buttons"
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
import {
    FeedbackDoneComment,
    FeedbackOffersNotFoundComment
} from '@/components/Timeline/comments.js';
import TimelineStepFeedback from '@/components/Timeline/Step/TimelineStepFeedback.vue';

export default {
    name: 'FeedbackActions',
    components: {
        TimelineStepFeedback
    },
    mixins: [MixinStepActions, MixinObject],
    methods: {
        updatedObjects(data, fn) {
            this.$emit('updatedObjects', data, false, fn);
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
