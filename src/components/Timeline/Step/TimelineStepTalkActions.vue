<template>
    <div class="step-actions">
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepTalk
                                :step="step"
                                :buttons="buttons"
                                :disabled="disabled"
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
import {MixinObject} from "@/components/Company/Object/mixins.js";
import {MixinStepActions} from "@/components/Timeline/mixins.js";
import {TalkDoneComment, TalkOffersNotFound} from "@/components/Timeline/comments.js";
import CompanyObjectsList from "@/components/Company/Object/CompanyObjectList.vue";
import TimelineStepTalk from "@/components/Timeline/Step/TimelineStepTalk.vue";

export default {
    name: "TimelineStepTalkActions",
    mixins: [MixinStepActions, MixinObject],
    components: {
        TimelineStepTalk,
        CompanyObjectsList
    },
    methods: {
        updatedObjects(data) {
            this.$emit("updatedObjects", data, true);
        },
        getNegativeComment(step) {
            return [new TalkOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new TalkDoneComment(step, this.selectedObjects)];
        },
    },
};
</script>

<style>
</style>