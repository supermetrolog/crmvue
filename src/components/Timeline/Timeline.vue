<template>
    <Modal @close="$emit('close')" class="fullscreen" :title="timelineTitle">
        <template #header>
            <TimelineHeader
                @close="$emit('close')"
                :disabled="disabled"
                :currentRequest="currentRequest"
                :timelineExist="timelineNotFoundFlag"
            />
        </template>
        <div class="container-timeline">
            <Loader v-if="(!selectedStep && $route.query.step && !timelineNotFoundFlag) || loader" class="center" />
            <div class="row no-gutters">
                <div class="col-12">
                    <div ref="timeline" class="row no-gutters inner">
                        <div v-if="timelineNotFoundFlag" class="col-12">
                            <h4 class="text-danger text-center">Такого таймлайна не существует</h4>
                        </div>
                        <div v-if="!loader && !timelineNotFoundFlag" class="timeline col-12">
                            <TimelineMini
                                @clickItem="clickStep"
                                :currentSteps="this.TIMELINE.timelineSteps"
                                :selectedStep="selectedStep"
                            />
                        </div>
                    </div>
                </div>
                <div v-if="selectedStep && !loader && !timelineNotFoundFlag" class="col-9 box step-actions px-0">
                    <transition
                        mode="out-in"
                        enter-active-class="animate__animated animate__fadeInRightBig for__modal__fullscreen"
                        leave-active-class="animate__animated animate__fadeOutLeft for__modal__fullscreen "
                    >
                        <component
                            :is="stepActionsName"
                            @updatedObjects="updatedObjects"
                            @updateStep="clickUpdateStep"
                            :step="selectedStep"
                            :loaderForStep="loaderForStep"
                            :disabled="disabled"
                        >
                        </component>
                    </transition>
                </div>
                <div v-if="selectedStep && !loader && !timelineNotFoundFlag" class="col-3 box timeline-extra-block">
                    <TimelineExtraBlock @commentAdded="getTimeline" :step="selectedStep" :disabled="disabled" />
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import TimelineStepMeetingActions from '@/components/Timeline/Step/TimelineStepMeetingActions.vue';
import TimelineStepOffersActions from '@/components/Timeline/Step/TimelineStepOffersActions.vue';
import TimelineStepFeedbackActions from '@/components/Timeline/Step/TimelineStepFeedbackActions.vue';
import TimelineStepInspectionActions from '@/components/Timeline/Step/TimelineStepInspectionActions.vue';
import TimelineStepVisitActions from '@/components/Timeline/Step/TimelineStepVisitActions.vue';
import TimelineStepInterestActions from '@/components/Timeline/Step/TimelineStepInterestActions.vue';
import TimelineStepTalkActions from '@/components/Timeline/Step/TimelineStepTalkActions.vue';
import TimelineStepDealActions from '@/components/Timeline/Step/TimelineStepDealActions.vue';
import { Timeline } from '@/const/const';
import Utils from '@/utils';
import TimelineHeader from './TimelineHeader.vue';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import TimelineMini from '@/components/Timeline/TimelineMini.vue';
import TimelineExtraBlock from '@/components/Timeline/TimelineExtraBlock.vue';

export default {
    name: 'Timeline',
    components: {
        TimelineExtraBlock,
        TimelineMini,
        Loader,
        Modal,
        TimelineStepMeetingActions,
        TimelineStepInspectionActions,
        TimelineStepVisitActions,
        TimelineStepInterestActions,
        TimelineStepTalkActions,
        TimelineStepOffersActions,
        TimelineStepFeedbackActions,
        TimelineStepDealActions,
        TimelineHeader
    },
    data() {
        return {
            stepParam: Timeline.get('param'),
            loader: true,
            loaderForStep: false,
            objects: [],
            timelineNotFoundFlag: false,
            completeStep: false
        };
    },
    computed: {
        ...mapGetters(['TIMELINE', 'COMPANY', 'COMPANY_CONTACTS', 'THIS_USER', 'TIMELINE_LIST', 'COMPANY_REQUESTS']),
        selectedStep() {
            if (this.TIMELINE) {
                return this.TIMELINE.timelineSteps[this.$route.query.step];
            }
            return false;
        },
        stepActionsName() {
            return this.stepParam[this.$route.query.step][1].stepName + 'Actions';
        },
        currentRequest() {
            if (Array.isArray(this.COMPANY_REQUESTS)) {
                return this.COMPANY_REQUESTS.find(item => item.id == this.$route.query.request_id);
            }
            return false;
        },
        disabled() {
            return (
                !this.TIMELINE ||
                !this.currentRequest ||
                this.$route.query.consultant_id != this.THIS_USER.id ||
                this.currentRequest.status == 2 ||
                this.currentRequest.status == 0 ||
                this.TIMELINE.status == 0
            );
        },
        companyContacts() {
            return Utils.normalizeContactsForMultiselect(this.COMPANY_CONTACTS);
        },
        timelineTitle() {
            let title = 'Бизнес процесс: ' + this.COMPANY.full_name;
            const currentTimeline = this.TIMELINE_LIST.find(
                timeline => timeline.consultant.id == this.$route.query.consultant_id
            );
            if (currentTimeline) {
                title += ' - ' + currentTimeline.consultant.userProfile.short_name;
            }
            return title;
        }
    },
    methods: {
        ...mapActions(['FETCH_TIMELINE', 'UPDATE_STEP', 'FETCH_COMPANY_REQUESTS']),
        async updatedObjects(data, goToNext = false, fn = null) {
            this.loaderForStep = data.id;
            await this.getTimeline();
            if (goToNext && data.number != 7) {
                await this.nextStep();
            }
            if (fn) {
                fn();
            }
            this.loaderForStep = false;
        },
        async clickUpdateStep(data, goToNext = false, fn = null) {
            this.loaderForStep = data.id;
            if (await this.UPDATE_STEP(data)) {
                await this.getTimeline();
                if (goToNext) {
                    this.nextStep();
                }
            }
            if (fn) {
                fn();
            }
            this.loaderForStep = false;
        },
        async nextStep() {
            let query = {
                ...this.$route.query
            };
            query.step++;
            this.completeStep = true;
            await this.$router.push({ query: query });
        },

        async clickStep(step) {
            let query = {
                ...this.$route.query
            };
            if (step.number != this.$route.query.step) {
                query.step = step.number;
            }
            await this.$router.push({ query: query });
        },
        async getTimeline() {
            await this.FETCH_TIMELINE(this.$route.query);
            if (!this.TIMELINE) {
                this.timelineNotFoundFlag = true;
                return false;
            }
            this.timelineNotFoundFlag = false;
            return true;
        },

        getPriorityStep() {
            let highPriorityTimelineStep = 0;
            this.TIMELINE.timelineSteps.forEach(step => {
                if (step.status == 0 && !highPriorityTimelineStep) {
                    highPriorityTimelineStep = step.number;
                }
            });
            return highPriorityTimelineStep;
        },
        async moveToPriorityStep() {
            let highPriorityTimelineStep = this.getPriorityStep();
            let query = {
                ...this.$route.query
            };
            query.step = highPriorityTimelineStep;
            await this.$router.push({ query: query });
        }
    },
    async created() {
        this.loader = true;
        const result = await this.getTimeline();
        this.loader = false;
        if (result) {
            this.moveToPriorityStep();
        }
    },
    watch: {
        async $route(after, before) {
            if (before.query.consultant_id != after.query.consultant_id) {
                this.loader = true;
                await this.getTimeline();
                this.loader = false;
            }
        }
    }
};
</script>

<style></style>