<template>
    <Modal
        @close="$emit('close')"
        :close-on-press-esc="false"
        show
        class="fullscreen modal-timeline"
    >
        <template #header>
            <TimelineHeaderSkeleton v-if="isGeneralLoading" />
            <TimelineHeader
                v-else
                @change-tab="changeTab"
                @close="$emit('close')"
                @edit="requestFormIsVisible = true"
                :disabled="isDisabled"
                :request="currentRequest"
                :current-tab="currentTab"
            />
        </template>
        <Spinner v-if="isGeneralLoading" class="mt-5 absolute-center" />
        <template v-else-if="timeline">
            <div class="timeline-page">
                <div v-if="currentTab === 'main'" class="timeline-page__wrapper row">
                    <div class="col-2">
                        <TimelineTree
                            @select="changeStep"
                            :selected="selectedStep?.number"
                            :current="timeline.steps"
                        />
                    </div>
                    <div class="col-10">
                        <div class="timeline-page__content" :class="{ disabled: isDisabled }">
                            <Loader v-if="stepIsLoading || stepIsChanging" />
                            <div v-if="!stepIsChanging" class="timeline-page__current">
                                <AnimationTransition :speed="0.5">
                                    <component
                                        :is="currentStepComponent"
                                        @updated-objects="onObjectsUpdated"
                                        @update-step="updateStep"
                                        @next-step="nextStep"
                                        @edit-request="requestFormIsVisible = true"
                                        :step="selectedStep"
                                        :disabled="isDisabled"
                                    >
                                    </component>
                                </AnimationTransition>
                            </div>
                            <TimelineBackdrop
                                v-if="isDisabled && backdropIsVisible"
                                @close="backdropIsVisible = false"
                            />
                        </div>
                    </div>
                </div>
                <TimelineExtraBlock
                    v-else-if="currentTab === 'log'"
                    @commentAdded="updateTimeline"
                    :step="selectedStep"
                    :disabled="isDisabled"
                />
            </div>
        </template>
        <EmptyData v-else>Информация о таймлайне не была найдена..</EmptyData>
        <teleport to="body">
            <FormCompanyRequest
                v-if="requestFormIsVisible"
                @close="requestFormIsVisible = false"
                @updated="fetchRequests"
                :company-id="company.id"
                :form-data="currentRequest"
            />
        </teleport>
    </Modal>
</template>

<script setup>
import { useStore } from 'vuex';
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
import AnimationTransition from '@/components/common/AnimationTransition.vue';
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
import { Timeline as steps } from '@/const/const.js';
import { computed, onMounted, ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { useRoute, useRouter } from 'vue-router';
import { requestOptions } from '@/const/options/request.options.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import TimelineHeaderSkeleton from '@/components/Timeline/TimelineHeaderSkeleton.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';

defineEmits(['close']);

const { isLoading: stepIsLoading } = useDelayedLoader();
const { isLoading: stepIsChanging } = useDelayedLoader();

const currentTab = ref('main');
const backdropIsVisible = ref(true);

const store = useStore();
const { currentUserId } = useAuth();

const company = computed(() => store.state.Companies.company);
const requests = computed(() => store.state.CompanyRequest.companyRequests);

const route = useRoute();

const selectedStep = computed(() => {
    if (!timeline.value) return null;

    if (route.query.step) return timeline.value.steps[route.query.step];
    return timeline.value.steps[0];
});

const COMPONENTS = {
    MeetingActivity: TimelineStepMeetingActivity,
    MeetingConfirmation: TimelineStepMeetingConfirmation,
    FeedbackInterest: TimelineStepFeedbackInterest,
    FeedbackCommunication: TimelineStepFeedbackCommunication,
    Offers: TimelineStepOffers,
    InspectionObjects: TimelineStepInspectionObjects,
    InspectionSending: TimelineStepInspectionSending,
    Visit: TimelineStepVisit,
    Interest: TimelineStepInterest,
    Talk: TimelineStepTalk,
    DealDecision: TimelineStepDealDecision,
    DealConfirmation: TimelineStepDealConfirmation
};

const currentStepComponent = computed(() => {
    const template = steps[route.query.step];

    if (template.steps?.length) return COMPONENTS[template.steps[route.query?.point ?? 0].name];
    return COMPONENTS[template.name];
});

const currentRequest = computed(() => {
    return requests.value.find(item => item.id === Number(route.query.request_id));
});

const isDisabled = computed(() => {
    return (
        !timeline.value ||
        !currentRequest.value ||
        Number(route.query.consultant_id) !== currentUserId.value ||
        currentRequest.value.status === requestOptions.statusStatement.COMPLETED ||
        currentRequest.value.status === requestOptions.statusStatement.PASSIVE ||
        timeline.value.status === 0
    );
});

function changeTab(tab) {
    currentTab.value = tab;
}

async function onObjectsUpdated(data, goToNext = false, callback = null) {
    stepIsChanging.value = true;

    await fetchTimeline();

    if (goToNext && data.number !== 7) await nextStep();
    if (isNotNullish(callback)) callback();

    stepIsChanging.value = false;
}

async function updateStep(data, goToNext = false, callback = null) {
    stepIsLoading.value = true;

    try {
        const stepUpdated = await store.dispatch('UPDATE_STEP', data);

        if (stepUpdated) {
            await fetchTimeline();

            stepIsChanging.value = true;

            if (goToNext) await nextStep();

            stepIsChanging.value = false;
        }

        if (isNotNullish(callback)) {
            callback();
        }
    } finally {
        stepIsLoading.value = false;
    }
}

async function nextStep() {
    const currentStepTemplate = steps[selectedStep.value.number];
    const currentStep = Number(route.query.step);

    const payload = {
        step: currentStep
    };

    if (currentStepTemplate.steps?.length) {
        const currentPoint = route.query.point ? Number(route.query.point) : 0;

        if (currentPoint < currentStepTemplate.steps.length - 1) payload.point = currentPoint + 1;
        else payload.step = currentStep + 1;
    } else {
        payload.step = currentStep + 1;
    }

    await changeStep(payload);
}

const router = useRouter();

async function changeStep(payload) {
    stepIsChanging.value = false;

    const query = {
        ...route.query,
        step: payload.step
    };

    if (isNotNullish(payload.point)) query.point = payload.point;
    else delete query.point;

    await router.push({ query });

    stepIsChanging.value = false;
}

// timeline

const timeline = computed(() => store.state.Timeline.timeline);

const { isLoading: isGeneralLoading } = useDelayedLoader(true);

async function fetchTimeline(withLoader = false) {
    if (withLoader) isGeneralLoading.value = true;

    await store.dispatch('FETCH_TIMELINE', route.query);

    if (withLoader) isGeneralLoading.value = false;
    return Boolean(timeline.value);
}

watch(
    () => route.query?.consultant_id,
    (newValue, oldValue) => {
        if (newValue !== oldValue) fetchTimeline();
    },
    { deep: true }
);

async function updateTimeline() {
    await store.dispatch('FETCH_TIMELINE', route.query);
}

// priority

function getPriorityStep() {
    let highPriorityTimelineStep = null;

    for (let i = 0; i < timeline.value.steps.length; i++) {
        if (timeline.value.steps[i].status === 0) {
            highPriorityTimelineStep = timeline.value.steps[i].number;
            break;
        }
    }

    return highPriorityTimelineStep ?? 0;
}

function moveToPriorityStep() {
    const highPriorityTimelineStep = getPriorityStep();

    const query = {
        ...route.query,
        step: highPriorityTimelineStep
    };

    router.push({ query });
}

onMounted(async () => {
    const timelineExist = await fetchTimeline(true);
    if (timelineExist) moveToPriorityStep();
});

// request

const requestFormIsVisible = ref(false);

function fetchRequests() {
    store.dispatch('FETCH_COMPANY_REQUESTS', route.params.id);
}
</script>
