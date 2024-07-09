<template>
    <div class="form__control checkbox-chip">
        <label
            class="checkbox-chip__label"
            :class="{
                required: required,
                active: isActive,
                disabled: isDisabled,
                'checkbox-chip__label--danger': danger,
                'checkbox-chip__label--icon': !text && icon,
                invalid: hasValidationError && !disabled
            }"
        >
            <input
                v-model="modelValue"
                @change="onChange"
                @click="onClick"
                :disabled="disabled"
                :value="value"
                :true-value="1"
                :false-value="disabledValue"
                type="checkbox"
            />
            {{ text }}
            <i v-if="icon" :class="icon"></i>
        </label>
        <slot />
    </div>
</template>

<script setup>
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import { computed, ref, toRef } from 'vue';

const modelValue = defineModel({ type: [Array, Number, String, Boolean] });
const emit = defineEmits(['change']);
const props = defineProps({
    text: {
        type: [String, Number, null],
        default: null
    },
    required: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    value: {
        type: [String, Number, Boolean],
        default: false
    },
    icon: {
        type: String,
        default: null
    },
    danger: {
        type: Boolean,
        default: false
    },
    v: {
        type: Object,
        default: null
    },
    multiple: {
        type: Boolean,
        default: null
    },
    property: {
        type: String,
        default: null
    },
    disabledValue: {
        type: [Number, String],
        default: 0
    },
    reactive: {
        type: Boolean,
        default: false
    }
});

const field = ref(modelValue);

const { hasValidationError, validate } = useFormControlValidation(toRef(props, 'v'), modelValue, {
    reactive: props.reactive
});

const isActive = computed(() => {
    if (modelValue.value instanceof Array) {
        if (props.property === null) {
            return (
                modelValue.value.includes(props.value) ||
                modelValue.value.includes(props.value.toString())
            );
        }

        return modelValue.value.some(element => element[props.property] == props.value);
    }

    if (props.multiple) return Number(modelValue.value) === 1;

    return Boolean(modelValue.value);
});

const isDisabled = computed(() => props.multiple && modelValue.value == props.disabledValue);

const onClick = event => {
    if (props.property === null) return true;

    event.preventDefault();

    if (isActive.value)
        modelValue.value = [
            ...modelValue.value.filter(element => element[props.property] != props.value)
        ];
    else modelValue.value = [...modelValue.value, { [props.property]: props.value }];

    onChange();
};

const onChange = () => {
    validate();
    if (props.multiple && modelValue.value == props.disabledValue) modelValue.value = null;
    emit('change', modelValue.value);
};
</script>
