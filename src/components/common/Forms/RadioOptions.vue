<template>
    <div class="radio-options">
        <span v-if="label" class="form__label" :class="{ required: required }">{{ label }}</span>
        <div class="form__row mt-1">
            <RadioChip
                v-for="option in preparedOptions"
                :key="option.value"
                v-model="modelValue"
                @change="validate"
                :value="option.value"
                :label="option.label"
                :unselect="unselect"
                :disabled="disabled"
                :class="[itemClass, { invalid: hasValidationError }]"
                :show-radio
                :rounded
                :icon="option.icon"
            />
            <slot name="after-options" />
        </div>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
    </div>
</template>

<script setup>
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { computed, toRef } from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';

const modelValue = defineModel({ type: [Number, String, Boolean] });

const props = defineProps({
    options: {
        type: [Array, Object],
        required: true
    },
    v: Object,
    label: String,
    itemClass: String,
    disabled: Boolean,
    required: Boolean,
    unselect: Boolean,
    showRadio: Boolean,
    rounded: {
        type: Boolean,
        default: true
    },
    objectKey: String
});

const preparedOptions = computed(() => {
    if (Array.isArray(props.options)) return props.options;

    return Object.keys(props.options).map(key => ({
        value: Number(key),
        label: props.objectKey ? props.options[key][props.objectKey] : props.options[key],
        icon: props.options[key]?.icon
    }));
});

const { hasValidationError, validate } = useFormControlValidation(toRef(props, 'v'), modelValue);
</script>
