<template>
    <div class="step-actions">
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepInterest
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
import { InterestDoneComment, InterestOffersNotFound } from '@/components/Timeline/comments.js';
import TimelineStepInterest from '@/components/Timeline/Step/TimelineStepInterest.vue';

export default {
    name: 'InterestActions',
    components: {
        TimelineStepInterest
    },
    mixins: [MixinStepActions, MixinObject],
    methods: {
        updatedObjects(data, fn = null) {
            this.$emit('updatedObjects', data, true, fn);
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
