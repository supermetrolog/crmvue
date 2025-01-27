<template>
    <div class="form__control" :class="{ 'form__control--disabled': disabled }">
        <label :class="{ required: required }">
            <span v-if="label" class="form__label">{{ label }}</span>
            <DashboardChip v-if="helper" class="form__helper dashboard-bg-light w-auto mb-2">
                {{ helper }}
            </DashboardChip>
            <textarea
                ref="textarea"
                @input="onInput"
                class="form__textarea"
                :class="validationClass"
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
                :disabled="disabled"
            />
        </label>
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
    </div>
</template>

<script setup>
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { computed, onMounted, toRef, useTemplateRef, watch } from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

const modelValue = defineModel({ type: String, default: '' });
const props = defineProps({
    disabled: {
        type: [Boolean, Number],
        default: false
    },
    reactive: {
        type: [Boolean, Number],
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    v: {
        type: Object,
        default: null
    },
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: ''
    },
    autoHeight: {
        type: Boolean,
        default: false
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    helper: {
        type: String,
        default: null
    },
    minHeight: {
        type: Number,
        default: 100
    },
    maxHeight: {
        type: Number,
        default: null
    }
});

const textarea = useTemplateRef('textarea');

const onInput = event => {
    validate();
    modelValue.value = event.target.value.trim();
};

const { hasValidationError, validate, validationClass } = useFormControlValidation(
    toRef(props, 'v'),
    modelValue,
    {
        reactive: props.reactive
    }
);

if (props.autoHeight) {
    watch(modelValue, () => {
        textarea.value.style.height = 'auto';
        textarea.value.style.height = textarea.value.scrollHeight + 'px';
    });
}

onMounted(() => {
    textarea.value.style.height = textarea.value.scrollHeight + 'px';
    if (props.autofocus) focus();
});

const focus = () => {
    textarea.value.focus();
};

defineExpose({ focus });

const minHeightInPx = computed(() => (props.minHeight ? `${props.minHeight}px` : null));
const maxHeightInPx = computed(() => (props.maxHeight ? `${props.maxHeight}px` : null));
</script>
<style scoped>
.form__textarea {
    min-height: v-bind(minHeightInPx);
    max-height: v-bind(maxHeightInPx);
}
</style>
