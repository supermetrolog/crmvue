<template>
    <div class="step-action">
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepFeedback
                                :step="step"
                                :disabled="disabled"
                                :buttons="buttons"
                                @updateItem="clickUpdateStep"
                                @done="done"
                                @negative="negative"
                            />
                            <CompanyObjectsList
                                :objects="submittedObjects"
                                :disabled="true"
                                :loader="loader"
                                :viewMode="viewMode"
                                :currentStepId="step.id"
                                :label="
                  'Выбранные предложения' +
                  (submittedObjects.length
                    ? ` (${submittedObjects.length})`
                    : '')
                "
                                class="success"
                                v-if="submittedObjects?.length"
                            />
                            <CompanyObjectsList
                                :objects="notSubmittedObjects"
                                :currentObjects="step.timelineStepObjects"
                                :selectedObjects="selectedObjects"
                                :disabled="disabled"
                                :withSeparator="true"
                                :loader="loader"
                                :viewMode="viewMode"
                                :currentStepId="step.id"
                                :label="
                  submittedObjects?.length
                    ? `Оставшиеся предложения (${notSubmittedObjects.length})`
                    : ''
                "
                                @select="select"
                                @unSelect="unSelect"
                                @addComment="addComment"
                                v-if="
                  notSubmittedObjects.length ||
                  (!submittedObjects.length && !notSubmittedObjects.length)
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
import {MixinStepActions} from "@/components/Timeline/mixins.js";
import {MixinObject} from "@/components/Company/Object/mixins.js";
import {FeedbackDoneComment, FeedbackOffersNotFoundComment,} from "@/components/Timeline/comments.js";
import CompanyObjectsList from "@/components/Company/Object/CompanyObjectList.vue";
import TimelineStepFeedback from "@/components/Timeline/Step/TimelineStepFeedback.vue";

export default {
    name: "FeedbackActions",
    mixins: [MixinStepActions, MixinObject],
    components: {
        TimelineStepFeedback,
        CompanyObjectsList
    },
    methods: {
        updatedObjects(data, fn) {
            this.$emit("updatedObjects", data, false, fn);
        },
        getNegativeComment(step) {
            return [new FeedbackOffersNotFoundComment(step)];
        },
        getDoneComment(step) {
            return [new FeedbackDoneComment(step)];
        },
    },
};
</script>

<style>
</style>