<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="8. Оформление сделки"
                    :success="data.objects.length"
                >
                    <p>8.1. Выберите объект, по которому произошла сделка.</p>
                    <template #footer>
                        <div class="d-flex gap-2 flex-wrap">
                            <TimelineButton
                                @click="submit"
                                tooltip="Нажмите, чтобы сохранить информацию об объектах"
                                :disabled="disabled || !selectedObjects.length"
                                color="success"
                            >
                                <span>Сделка подписана!</span>
                                <i class="fa-solid fa-champagne-glasses icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                @click="selectNegative"
                                tooltip="Нажмите, чтобы сохранить информацию об объектах"
                                :disabled="disabled"
                                :active="step.negative"
                                color="danger"
                            >
                                <span>Сделка провалилась</span>
                                <i class="fa-regular fa-face-rolling-eyes icon"></i>
                            </TimelineButton>
                        </div>
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
                    @select="selectOnlyOne"
                    @unselect="unselect"
                    @addComment="addComment"
                    :objects="notSubmittedObjects"
                    :current-objects="step.objects"
                    :selected-objects="selectedObjects"
                    :disabled="disabled"
                    with-separator
                    :loader="isGeneralLoading"
                    :view-mode="viewMode"
                    :current-step-id="step.id"
                    :label="notSubmittedObjectsLabel"
                    select-only-one
                />
            </div>
        </div>
    </div>
</template>

<script>
import { TimelineStepWithObjectsMixin } from '@/components/Timeline/mixins.js';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { DealDoneComment, DealOffersNotFound } from '@/components/Timeline/comments.js';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';

export default {
    name: 'TimelineStepDealDecision',
    components: { TimelineButton, TimelineInfo, CompanyObjectsList },
    mixins: [TimelineStepWithObjectsMixin],
    computed: {},
    methods: {
        getNegativeComment(step) {
            return [new DealOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new DealDoneComment(step)];
        },
        onBeforeSending(data) {
            data.negative = 0;
            data.additional = 0;
            data.timelineStepObjects = [];
        },
        async submit() {
            await this.done();
            this.$emit('next-step');
        }
    }
};
</script>

<style></style>
