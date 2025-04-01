<template>
    <div class="timeline-page-header">
        <div class="timeline-page-header__row">
            <TimelineHeaderInfo class="timeline-page-header__info" :company :request />
            <TimelineHeaderActions
                @disable="disableFormIsVisible = true"
                @complete="dealFormIsVisible = true"
                @edit="$emit('edit')"
                :request
                :consultants
            />
        </div>
        <div class="timeline-page-header__tabs">
            <UiButton
                @click="$emit('change-tab', 'main')"
                class="timeline-page-header__button"
                :color="currentTab === 'main' ? 'success-light' : 'light'"
                :class="{ 'font-weight-semi': currentTab === 'main' }"
            >
                Прохождение таймлайна
            </UiButton>
            <UiButton
                @click="$emit('change-tab', 'log')"
                class="timeline-page-header__button"
                :color="currentTab === 'log' ? 'success-light' : 'light'"
                :tooltip="messagesTippy"
                :class="{
                    'animate__animated animate__flash': messagesHasAnimation,
                    'font-weight-semi': currentTab === 'log'
                }"
            >
                Логи таймлайна ({{ messagesCount }})
            </UiButton>
        </div>
        <teleport to="body">
            <FormModalCompanyRequestDisable
                @close="disableFormIsVisible = false"
                @disabled="updateRequests"
                :show="disableFormIsVisible"
                :request_id="request.id"
            />
            <FormCompanyDeal
                v-if="dealFormIsVisible"
                @close="dealFormIsVisible = false"
                @created="updateRequests"
                :company_id="request.company_id"
                :request_id="request.id"
                :deal-type="request.dealType"
                is-our-deal
            />
        </teleport>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import FormModalCompanyRequestDisable from '@/components/Forms/Company/FormModalCompanyRequestDisable.vue';
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TimelineHeaderInfo from '@/components/Timeline/TimelineHeaderInfo.vue';
import TimelineHeaderActions from '@/components/Timeline/TimelineHeaderActions.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['change-tab', 'edit']);
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    request: {
        type: Object,
        required: true
    },
    currentTab: {
        type: String,
        default: 'main'
    }
});

const store = useStore();
const route = useRoute();

const disableFormIsVisible = ref(false);
const dealFormIsVisible = ref(false);
const messagesHasAnimation = ref(false);

const timeline = computed(() => store.state.Timeline.timeline);

const consultants = computed(() => {
    return store.state.Timeline.request_timelines.map(element => element.consultant);
});

const messagesCount = computed(() => {
    if (timeline.value)
        return timeline.value.steps.reduce((total, current) => total + current.comments?.length, 0);

    return 0;
});

watch(messagesCount, (newValue, oldValue) => {
    if (newValue > oldValue) createAnimation();
});

const messagesTippy = computed(() => {
    if (!timeline.value) return null;

    const totalText = 'Всего сообщений по таймлайну: ' + messagesCount.value + '<br>';

    const currentStep = timeline.value.steps[Number(route.query.step) || 0];

    if (!currentStep) return totalText;

    const localText = 'Сообщений на текущем шаге: ' + currentStep.comments?.length;

    return totalText + localText;
});

const company = computed(() => store.state.Companies.company);

// animations

let messagesAnimation;

function createAnimation() {
    clearAnimation();
    messagesHasAnimation.value = true;

    messagesAnimation = setTimeout(() => {
        messagesHasAnimation.value = false;
        clearAnimation();
    }, 1000);
}

function clearAnimation() {
    clearTimeout(messagesAnimation);
    messagesAnimation = null;
}

async function updateRequests() {
    await store.dispatch('FETCH_COMPANY_REQUESTS', props.request.company_id);
    emit('close');
}

onBeforeUnmount(clearAnimation);
</script>
