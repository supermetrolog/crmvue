<template>
    <div class="timeline-step">
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="Оформление сделки"
                    :success="data.timelineStepObjects.length"
                >
                    <p>Шаг 1. Выберите объект, по которому произошла сделка.</p>
                    <template #footer>
                        <div class="d-flex gap-2 flex-wrap">
                            <Button
                                v-tippy="'Нажмите, чтобы сохранить информацию об объектах'"
                                @click="submit"
                                success
                                :disabled="disabled || !selectedObjects.length"
                                solid
                                icon
                            >
                                <span>Сделка подписана!</span>
                                <i class="fa-solid fa-champagne-glasses icon"></i>
                            </Button>
                            <Button
                                v-tippy="'Нажмите, чтобы сохранить информацию об объектах'"
                                @click="selectNegative"
                                :disabled="disabled"
                                :active="step.negative"
                                danger
                                solid
                                icon
                            >
                                <span>Сделка провалилась</span>
                                <i class="fa-regular fa-face-rolling-eyes icon"></i>
                            </Button>
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
                    :current-objects="step.timelineStepObjects"
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
import Button from '@/components/common/Button.vue';

export default {
    name: 'TimelineStepDealDecision',
    components: { Button, TimelineInfo, CompanyObjectsList },
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
