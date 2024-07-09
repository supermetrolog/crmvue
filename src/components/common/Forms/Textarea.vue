<template>
    <div class="form__control">
        <label :class="{ required: required }">
            <span v-if="label" class="form__label">{{ label }}</span>
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
import { onMounted, ref, toRef, watch } from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';

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
    }
});

const textarea = ref(null);

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
});
</script>
