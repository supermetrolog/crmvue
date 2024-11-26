<template>
    <Modal
        @close="$emit('close')"
        show
        :close-on-press-esc="false"
        class="fullscreen modal-timeline"
    >
        <template #header>
            <TimelineHeader
                v-if="!isGeneralLoading && timeline"
                @change-tab="changeTab"
                @close="$emit('close')"
                :disabled="disabled"
                :request="currentRequest"
                :current-tab="currentTab"
                :title="title"
            />
            <h2 v-else>{{ companyName }}</h2>
        </template>
        <Spinner v-if="isGeneralLoading" class="mt-5 absolute-center" />
        <template v-else-if="timeline">
            <div class="timeline-page">
                <div v-if="currentTab === 'main'" class="timeline-page__wrapper row">
                    <div class="col-2">
                        <TimelineTree
                            @select="changeStep"
                            :selected="selectedStep?.number"
                            :current="timeline.timelineSteps"
                        />
                    </div>
                    <div class="col-10">
                        <div class="timeline-page__content" :class="{ disabled: disabled }">
                            <Loader v-if="isStepLoading || stepIsChanging" />
                            <div v-else class="timeline-page__current">
                                <AnimationTransition :speed="0.5">
                                    <component
                                        :is="componentStepName"
                                        @updated-objects="onObjectsUpdated"
                                        @update-step="updateStep"
                                        @next-step="nextStep"
                                        :step="selectedStep"
                                        :loader-for-step="loaderForStep"
                                        :disabled="disabled"
                                    >
                                    </component>
                                </AnimationTransition>
                            </div>
                            <TimelineBackdrop
                                v-if="disabled && backdropIsVisible"
                                @close="backdropIsVisible = false"
                            />
                        </div>
                    </div>
                </div>
                <TimelineExtraBlock
                    v-else-if="currentTab === 'log'"
                    @commentAdded="updateTimeline"
                    :step="selectedStep"
                    :disabled="disabled"
                />
            </div>
        </template>
        <EmptyData v-else>Информация о таймлайне не была найдена..</EmptyData>
    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import TimelineStepMeetingActivity from '@/components/Timeline/Step/TimelineStepMeetingActivity.vue';
import TimelineStepMeetingConfirmation from '@/components/Timeline/Step/TimelineStepMeetingConfirmation.vue';
import TimelineStepFeedbackInterest from '@/components/Timeline/Step/TimelineStepFeedbackInterest.vue';
import TimelineHeader from './TimelineHeader.vue';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import TimelineTree from '@/components/Timeline/TimelineTree.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { entityOptions } from '@/const/options/options.js';
import TimelineBackdrop from '@/components/Timeline/TimelineBackdrop.vue';
import TimelineStepOffers from '@/components/Timeline/Step/TimelineStepOffers.vue';
import TimelineStepFeedbackCommunication from '@/components/Timeline/Step/TimelineStepFeedbackCommunication.vue';
import TimelineStepInspectionObjects from '@/components/Timeline/Step/TimelineStepInspectionObjects.vue';
import TimelineStepInspectionSending from '@/components/Timeline/Step/TimelineStepInspectionSending.vue';
import TimelineStepVisit from '@/components/Timeline/Step/TimelineStepVisit.vue';
import TimelineStepInterest from '@/components/Timeline/Step/TimelineStepInterest.vue';
import TimelineStepTalk from '@/components/Timeline/Step/TimelineStepTalk.vue';
import TimelineExtraBlock from '@/components/Timeline/TimelineExtraBlock.vue';
import TimelineStepDealDecision from '@/components/Timeline/Step/TimelineStepDealDecision.vue';
import TimelineStepDealConfirmation from '@/components/Timeline/Step/TimelineStepDealConfirmation.vue';
import { Timeline } from '@/const/const.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';

export default {
    name: 'Timeline',
    components: {
        TimelineExtraBlock,
        TimelineBackdrop,
        AnimationTransition,
        Tab,
        Tabs,
        TimelineTree,
        EmptyData,
        Spinner,
        Loader,
        Modal,
        TimelineHeader,
        TimelineStepMeetingActivity,
        TimelineStepMeetingConfirmation,
        TimelineStepOffers,
        TimelineStepFeedbackInterest,
        TimelineStepFeedbackCommunication,
        TimelineStepInspectionObjects,
        TimelineStepInspectionSending,
        TimelineStepVisit,
        TimelineStepInterest,
        TimelineStepTalk,
        TimelineStepDealDecision,
        TimelineStepDealConfirmation
    },
    emits: ['close'],
    setup() {
        const { isLoading: isGeneralLoading } = useDelayedLoader();
        const { isLoading: isStepLoading } = useDelayedLoader();
        const { isLoading: stepIsChanging } = useDelayedLoader();

        return { isGeneralLoading, isStepLoading, stepIsChanging };
    },
    data() {
        return {
            loaderForStep: false,
            objects: [],
            timelineNotFoundFlag: false,
            currentTab: 'main',
            backdropIsVisible: true
        };
    },
    computed: {
        ...mapGetters({
            timeline: 'TIMELINE',
            company: 'COMPANY',
            companyContact: 'COMPANY_CONTACTS',
            currentUser: 'THIS_USER',
            timelineList: 'TIMELINE_LIST',
            companyRequests: 'COMPANY_REQUESTS'
        }),
        steps: () => Timeline,
        selectedStep() {
            if (!this.timeline) return null;
            if (this.$route.query.step) return this.timeline.timelineSteps[this.$route.query.step];
            return null;
        },
        componentStepName() {
            const stepTemplate = this.steps[this.$route.query.step];

            const stepName = stepTemplate.steps?.length
                ? stepTemplate.steps[this.$route.query?.point ?? 0].name
                : stepTemplate.name;

            return `TimelineStep${stepName}`;
        },
        currentRequest() {
            if (Array.isArray(this.companyRequests))
                return this.companyRequests.find(
                    item => item.id === Number(this.$route.query.request_id)
                );
            return null;
        },
        disabled() {
            return (
                !this.timeline ||
                !this.currentRequest ||
                Number(this.$route.query.consultant_id) !== this.currentUser.id ||
                this.currentRequest.status === entityOptions.request.statusStatement.COMPLETED ||
                this.currentRequest.status === entityOptions.request.statusStatement.PASSIVE ||
                this.timeline.status === 0
            );
        },
        title() {
            let title = getCompanyName(this.company);

            const currentTimeline = this.timelineList.find(
                timeline => timeline.consultant.id === Number(this.$route.query.consultant_id)
            );

            if (currentTimeline) {
                title += ' - ' + currentTimeline.consultant.userProfile.short_name;
            }

            return title;
        },
        companyName() {
            return getCompanyName(this.company);
        }
    },
    watch: {
        async $route(after, before) {
            if (Number(before.query.consultant_id) !== Number(after.query.consultant_id))
                await this.fetchTimeline();
        }
    },
    methods: {
        ...mapActions(['FETCH_TIMELINE', 'UPDATE_STEP', 'FETCH_COMPANY_REQUESTS']),
        changeTab(tab) {
            this.currentTab = tab;
        },
        async onObjectsUpdated(data, goToNext = false, fn = null) {
            this.isStepLoading = true;

            await this.fetchTimeline();

            if (goToNext && data.number !== 7) await this.nextStep();
            if (fn) fn();
            this.isStepLoading = false;
        },
        async updateStep(data, goToNext = false, fn = null) {
            this.isStepLoading = true;
            const stepUpdated = await this.UPDATE_STEP(data);

            if (stepUpdated) {
                await this.fetchTimeline();
                if (goToNext) await this.nextStep();
            }

            if (fn) fn();

            this.isStepLoading = false;
        },
        async nextStep() {
            const currentStepTemplate = this.steps[this.selectedStep.number];
            const currentStep = Number(this.$route.query.step);

            if (currentStepTemplate.steps?.length) {
                const currentPoint = this.$route.query.point ? Number(this.$route.query.point) : 0;
                if (currentPoint < currentStepTemplate.steps.length - 1)
                    await this.changeStep({ step: currentStep, point: currentPoint + 1 });
                else await this.changeStep({ step: currentStep + 1 });
            } else {
                await this.changeStep({ step: currentStep + 1 });
            }
        },
        async changeStep(payload) {
            this.stepIsChanging = true;

            const query = {
                ...this.$route.query,
                step: payload.step
            };

            if (payload.point !== undefined) query.point = payload.point;
            else delete query.point;

            await this.$router.push({ query });

            this.stepIsChanging = false;
        },
        async fetchTimeline(withLoader = false) {
            if (withLoader) this.isGeneralLoading = true;

            await this.FETCH_TIMELINE(this.$route.query);

            if (withLoader) this.isGeneralLoading = false;
            return Boolean(this.timeline);
        },
        async updateTimeline() {
            await this.FETCH_TIMELINE(this.$route.query);
        },
        getPriorityStep() {
            let highPriorityTimelineStep = null;

            this.timeline.timelineSteps.forEach(step => {
                if (step.status === 0 && highPriorityTimelineStep === null)
                    highPriorityTimelineStep = step.number;
            });

            return highPriorityTimelineStep || 0;
        },
        async moveToPriorityStep() {
            const highPriorityTimelineStep = this.getPriorityStep();

            const query = {
                ...this.$route.query,
                step: highPriorityTimelineStep
            };

            await this.$router.push({ query });
        }
    },
    async created() {
        const timelineExist = await this.fetchTimeline(true);
        if (timelineExist) this.moveToPriorityStep();
    }
};
</script>
