<template>
    <div class="timeline-info" :class="{ success: success && !disabled }">
        <div class="timeline-info__content">
            <AnimationTransition :speed="0.5">
                <i
                    v-if="success && !disabled"
                    class="fa-regular fa-circle-check timeline-info__icon"
                ></i>
                <i v-else-if="disabled" class="fa-regular fa-circle-pause timeline-info__icon"></i>
            </AnimationTransition>
            <div>
                <p v-if="title" class="timeline-info__title">
                    <span>{{ title }}</span>
                    <DashboardChip v-if="disabled" class="dashboard-bg-success mb-1">
                        Для прохождения шага выполните предыдущей
                    </DashboardChip>
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
</template>
<script setup>
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

defineEmits(['next']);
defineProps({
    title: {
        type: String,
        default: null
    },
    success: {
        type: [Boolean, Number],
        default: false
    },
    disabled: Boolean,
    withoutNext: Boolean,
    hasTutorial: Boolean
});
</script>
