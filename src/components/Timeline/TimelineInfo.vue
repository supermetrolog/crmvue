<template>
    <div class="timeline-info" :class="{ success: success && !disabled, disabled, paused }">
        <div class="timeline-info__content">
            <div>
                <slot name="before" />
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
</template>
<script setup>
import UiField from '@/components/common/UI/UiField.vue';

defineProps({
    title: String,
    success: {
        type: [Boolean, Number],
        default: false
    },
    disabled: Boolean,
    paused: Boolean
});
</script>
