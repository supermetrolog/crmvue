<template>
    <div>
        <div class="timeline-info" :class="{ success: success && !disabled, disabled, paused }">
            <div class="timeline-info__content">
                <div>
                    <slot name="before" />
                    <UiField v-if="paused" color="white" class="mb-1">
                        <i class="fa-regular fa-circle-pause" />
                        <span>На паузе до {{ stepPauseDate }}</span>
                    </UiField>
                    <UiField v-if="disabled" color="danger-light" class="mb-1">
                        <i class="fa-solid fa-exclamation-triangle icon" />
                        <span>Для прохождения шага выполните предыдущей</span>
                    </UiField>
                    <p v-if="title" class="timeline-info__title">
                        <span>{{ title }}</span>
                    </p>
                    <div class="timeline-info__description">
                        <slot />
                    </div>
                </div>
            </div>
            <div v-if="$slots.footer" class="timeline-info__footer">
                <slot name="footer" />
            </div>
        </div>
        <TimelineStepPauseComment
            v-if="paused && step.comment"
            class="mt-1"
            :step
            :user="timeline.consultant"
        />
    </div>
</template>
<script setup>
import UiField from '@/components/common/UI/UiField.vue';
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import TimelineStepPauseComment from '@/components/Timeline/Step/TimelineStepPauseComment.vue';

const props = defineProps({
    title: String,
    success: {
        type: [Boolean, Number],
        default: false
    },
    disabled: Boolean,
    paused: Boolean,
    step: {
        type: Object,
        required: true
    },
    timeline: {
        type: Object,
        required: true
    }
});

const stepPauseDate = computed(() => toDateFormat(props.step.date, 'D.MM.YY'));
</script>
