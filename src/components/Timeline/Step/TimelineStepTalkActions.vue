<template>
    <div class="step-actions">
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepTalk
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
import { MixinObject } from '@/components/Company/Object/mixins.js';
import { MixinStepActions } from '@/components/Timeline/mixins.js';
import { TalkDoneComment, TalkOffersNotFound } from '@/components/Timeline/comments.js';
import CompanyObjectsList from '@/components/Company/Object/CompanyObjectList.vue';
import TimelineStepTalk from '@/components/Timeline/Step/TimelineStepTalk.vue';

export default {
    name: 'TimelineStepTalkActions',
    components: {
        TimelineStepTalk,
        CompanyObjectsList
    },
    mixins: [MixinStepActions, MixinObject],
    methods: {
        updatedObjects(data) {
            this.$emit('updatedObjects', data, true);
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
