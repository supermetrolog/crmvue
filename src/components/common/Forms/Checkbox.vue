<template>
    <div class="checkbox">
        <label class="checkbox__row">
            <input
                v-model="modelValue"
                @change.stop="onChange"
                :checked="checked"
                type="checkbox"
                :class="validationClass"
                :true-value="numeric ? 1 : trueValue"
                :false-value="numeric ? 0 : falseValue"
                :disabled="disabled"
            />
            <slot />
        </label>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
    </div>
</template>

<script setup>
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import { toRef } from 'vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';

const emit = defineEmits(['change']);
const modelValue = defineModel({ type: [Boolean, Number], default: false });
const props = defineProps({
    required: {
        type: Boolean,
        default: false
    },
    v: {
        type: Object,
        default: null
    },
    label: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    trueValue: {
        type: [Number, String, Object, Boolean],
        default: true
    },
    falseValue: {
        type: [Number, String, Object, Boolean],
        default: false
    },
    checked: {
        type: Boolean,
        default: false
    },
    numeric: {
        type: Boolean,
        default: false
    }
});

const { hasValidationError, validate, validationClass } = useFormControlValidation(
    toRef(props, 'v'),
    modelValue
);

if (props.checked) modelValue.value = props.trueValue;

const onChange = () => {
    validate();
    emit('change', modelValue.value);
};
</script>
