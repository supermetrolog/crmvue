<template>
    <div class="checkbox-options">
        <span class="form__label" :class="{ required: required }">{{ label }}</span>
        <div class="form__row mt-1">
            <CheckboxChip
                v-for="option in preparedOptions"
                :key="option.value"
                v-model="modelValue"
                @change="validate"
                :v="v"
                :value="option.value"
                :text="option.label"
                :disabled="disabled"
                :property="property"
            />
        </div>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
    </div>
</template>

<script setup>
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import { computed, toRef } from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';

const modelValue = defineModel({ type: Array });

const props = defineProps({
    label: {
        type: String,
        default: null
    },
    options: {
        type: [Array, Object],
        required: true
    },
    v: {
        type: Object,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    property: {
        type: String,
        default: null
    }
});

const preparedOptions = computed(() => {
    if (Array.isArray(props.options)) return props.options;
    return Object.keys(props.options).map(key => ({
        value: Number(key),
        label: props.options[key]
    }));
});

const { hasValidationError, validate } = useFormControlValidation(toRef(props, 'v'), modelValue);
</script>
