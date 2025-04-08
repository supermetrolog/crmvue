<template>
    <div class="timeline-feedback-picker">
        <p class="timeline-feedback-picker__title mb-1">Выберите способ связи:</p>
        <div class="d-flex flex-wrap gap-1">
            <CheckboxChip
                v-for="(option, key) in options"
                :key="key"
                v-model="modelValue"
                @change="$emit('onChange')"
                :value="key"
                :text="option.label"
                :disabled="disabled"
                :icon="option.icon"
                class="timeline-feedback-picker__element"
            />
        </div>
    </div>
</template>
<script setup>
import { FeedbackList } from '@/const/const.js';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';

const modelValue = defineModel();

defineEmits(['onChange']);
defineProps({
    disabled: Boolean
});

const options = Object.values(FeedbackList);
</script>
