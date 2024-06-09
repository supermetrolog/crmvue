<template>
    <div class="timeline-feedback-picker">
        <p class="timeline-feedback-picker__title mb-1">Выберите способ связи</p>
        <div class="d-flex flex-wrap gap-1">
            <CheckboxChip
                v-for="(option, key) in options"
                :key="key"
                v-model="field"
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
<script>
import { FeedbackList } from '@/const/const.js';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';

export default {
    name: 'TimelineFeedbackPicker',
    components: { CheckboxChip },
    emits: ['update:modelValue', 'onChange'],
    props: {
        modelValue: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        field: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        },
        options: () => Object.values(FeedbackList)
    }
};
</script>
