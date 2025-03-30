<template>
    <div class="form__control" :class="{ 'form__control--disabled': disabled, required: required }">
        <label>
            <span v-if="label" class="form__label">{{ label }}</span>
            <DashboardChip v-if="helper" class="form__helper dashboard-bg-light w-auto mb-2">
                {{ helper }}
            </DashboardChip>
            <textarea
                ref="textarea"
                @input="onInput"
                class="form__textarea"
                :class="[validationClass, { filled: hasValue }]"
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
                :disabled="disabled"
                :required
            />
        </label>
        <ValidationMessage v-if="hasValidationError && !disabled" :message="error" />
    </div>
</template>

<script setup>
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { computed, onMounted, toRef, useTemplateRef, watch } from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';

const modelValue = defineModel({ type: String });
const props = defineProps({
    disabled: {
        type: [Boolean, Number],
        default: false
    },
    reactive: {
        type: [Boolean, Number],
        default: false
    },
    required: Boolean,
    v: {
        type: Object,
        default: null
    },
    type: {
        type: String,
        default: 'text'
    },
    label: String,
    placeholder: String,
    autoHeight: Boolean,
    autofocus: Boolean,
    helper: String,
    minHeight: {
        type: Number,
        default: 100
    },
    maxHeight: Number
});

const textarea = useTemplateRef('textarea');

const hasValue = computed(() => {
    if (isNullish(modelValue.value)) return false;
    return isNotEmptyString(modelValue.value);
});

function onInput(event) {
    validate();
    modelValue.value = event.target.value.trim();
}

const { hasValidationError, validate, validationClass, error } = useFormControlValidation(
    toRef(props, 'v'),
    modelValue,
    {
        reactive: props.reactive
    }
);

const { pause: pauseAutoHeight, resume: resumeAutoHeight } = watch(modelValue, () => {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = textarea.value.scrollHeight + 'px';
});

watch(
    () => props.autoHeight,
    value => {
        if (value) resumeAutoHeight();
        else pauseAutoHeight();
    },
    { immediate: true }
);

onMounted(() => {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = textarea.value.scrollHeight + 'px';

    if (props.autofocus) focus();
});

function focus() {
    textarea.value.focus();
}

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
