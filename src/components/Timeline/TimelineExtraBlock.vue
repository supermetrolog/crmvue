<template>
    <div class="timeline-logs">
        <teleport to="body">
            <LetterViewModal
                v-if="letterViewIsVisible"
                @close="letterViewIsVisible = false"
                :letterID="viewingLetterId"
            />
        </teleport>
        <div class="timeline-logs__scroller row">
            <div class="col-12">
                <Accordion @changed="onTabSwitched" :default-tab-hash="step.id">
                    <AccordionItem
                        v-for="timelineStep in timeline.steps"
                        :id="timelineStep.id"
                        :key="timelineStep.id"
                        :title="
                            TimelineOptions[timelineStep.number].label +
                            ` (${timelineStep.comments.length})`
                        "
                        :title-classes="
                            timelineStep.status === 1 ? 'success_block' : 'warning_block'
                        "
                    >
                        <div class="timeline-logs__wrapper">
                            <TimelineComments @view="viewLetter" :data="timelineStep.comments" />
                            <UiForm :ref="'#' + timelineStep.id" @submit="submit(timelineStep)">
                                <UiFormGroup v-if="!disabled">
                                    <UiTextarea
                                        v-model="form.comment"
                                        class="col-12"
                                        :v="v$.form.comment"
                                        :disabled="isLoading"
                                        placeholder="Добавьте комментарий по процессу"
                                    />
                                    <Submit
                                        success
                                        class="col-4 mx-auto mt-1"
                                        :disabled="isLoading"
                                    >
                                        Добавить
                                    </Submit>
                                </UiFormGroup>
                            </UiForm>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { Timeline as TimelineOptions } from '@/const/const';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import Accordion from '@/components/common/Accordion/Accordion.vue';
import AccordionItem from '@/components/common/Accordion/AccordionItem.vue';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api';
import TimelineComments from '@/components/Timeline/TimelineComments.vue';
import LetterViewModal from '@/components/common/Letter/LetterViewModal.vue';
import { useValidation } from '@/composables/useValidation.js';
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';

const emit = defineEmits(['commentAdded']);
const props = defineProps({
    step: Object,
    disabled: Boolean
});

const form = reactive({
    comment: null
});

const { v$, validate, resetValidation } = useValidation(
    {
        form: {
            comment: {
                required: helpers.withMessage('Введите комментарий', required)
            }
        }
    },
    { form }
);

function resetForm() {
    form.comment = null;
    resetValidation();
}

const isLoading = ref(false);
const letterViewIsVisible = ref(false);

const currentTimelineStepId = ref(props.step?.id);
const viewingLetterId = ref(null);

const store = useStore();

const timeline = computed(() => store.getters.TIMELINE);

const { currentUser } = useAuth();

watch(
    () => props.step,
    value => {
        currentTimelineStepId.value = value.id;
    }
);

let scrollingTimeout;

onBeforeUnmount(() => {
    clearTimeout(scrollingTimeout);
});

function scrollToForm(hash) {
    if (!hash) return;

    // this.$refs[hash][0].$el.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'end',
    //     alignToTop: false
    // });
}

function scrollToFormDelay(hash) {
    clearTimeout(scrollingTimeout);
    scrollingTimeout = setTimeout(() => scrollToForm(hash), 500);
}

function onTabSwitched(item) {
    scrollToFormDelay(item.tab.hash);
}

async function submit(step) {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    const comments = [
        {
            timeline_id: step.timeline_id,
            timeline_step_id: step.id,
            timeline_step_number: step.number,
            title: currentUser.value.userProfile.short_name,
            comment: form.comment,
            type: 3
        }
    ];

    if (await api.timeline.addActionComments(comments)) {
        emit('commentAdded');
        resetForm();
        scrollToFormDelay('#' + step.id);
    }

    isLoading.value = false;
}

async function viewLetter(letterId) {
    viewingLetterId.value = letterId;
    letterViewIsVisible.value = true;
}
</script>
