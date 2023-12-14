<template>
    <div class="step-actions">
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row px-2" v-if="step.timelineStepObjects.length">
                    <div class="col-12">
                        <div class="timeline-actions row"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepDeal
                                :step="step"
                                :disabled="disabled"
                                :request_id="+requestId"
                                :loaderForStep="loaderForStep"
                                :buttons="buttons"
                                @done="done"
                                @negative="negative"
                                @updateItem="clickUpdateStep"
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
                                @select="selectOnlyOne"
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
import {mapActions, mapGetters} from "vuex";
import {MixinStepActions} from "@/components/Timeline/mixins.js";
import {MixinObject} from "@/components/Company/Object/mixins.js";
import {DealDoneComment, DealOffersNotFound} from "@/components/Timeline/comments.js";
import CompanyObjectsList from "@/components/Company/Object/CompanyObjectList.vue";
import TimelineStepDeal from "@/components/Timeline/Step/TimelineStepDeal.vue";

export default {
    name: "TimelineStepDealActions",
    mixins: [MixinStepActions, MixinObject],
    components: {
        TimelineStepDeal,
        CompanyObjectsList
    },
    props: {
        loaderForStep: {
            type: [Number, Boolean],
        },
    },
    computed: {
        ...mapGetters(["CURRENT_STEP_OBJECTS"]),
        requestId() {
            return this.$route.query.request_id;
        },
        buttons() {
            return [
                {
                    btnClass: "primary",
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: "Сохранить",
                    text: "Победа!",
                    emited_event: "done",
                    withWayOfSending: false,
                    classes: "col-2",
                },
                {
                    btnClass: "danger",
                    btnVisible: false,
                    defaultBtn: true,
                    btnActive: this.step.negative,
                    disabled: this.disabled,
                    title: "",
                    text: "Сделка провалилась",
                    emited_event: "negative",
                    withWayOfSending: false,
                    classes: "col-2 ml-1",
                },
            ];
        },
    },
    methods: {
        ...mapActions(["FETCH_COMPANY_REQUESTS"]),
        updatedObjects(data, fn) {
            const fetchRequest = () => {
                this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
                if (fn) {
                    fn();
                }
            };
            this.$emit("updatedObjects", data, true, fetchRequest);
        },
        beforeSend(data) {
            data.negative = 0;
            data.additional = 0;
            data.timelineStepObjects = [];
        },
        getNegativeComment(step) {
            return [new DealOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new DealDoneComment(step)];
        },
    },
};
</script>

<style>
</style>