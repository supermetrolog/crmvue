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
                invalid: hasValidationError && !disabled,
                'checkbox-chip__label--show-checkbox': showCheckbox,
                'checkbox-chip__label--rounded': rounded
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
                class="checkbox-chip__input"
            />
            <input v-show="showCheckbox" :disabled="disabled" :checked="isActive" type="checkbox" />
            {{ text }}
            <i v-if="icon" v-tippy="iconLabel" @click="onIconClick" :class="icon"></i>
        </label>
        <slot />
    </div>
</template>

<script setup>
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import { computed, toRef } from 'vue';

const modelValue = defineModel({ type: [Array, Number, String, Boolean] });
const emit = defineEmits(['change', 'icon-clicked']);
const props = defineProps({
    text: [String, Number],
    required: Boolean,
    name: String,
    disabled: Boolean,
    value: {
        type: [String, Number, Boolean],
        default: false
    },
    icon: String,
    danger: Boolean,
    v: Object,
    multiple: Boolean,
    property: String,
    disabledValue: {
        type: [Number, String],
        default: 0
    },
    reactive: Boolean,
    iconLabel: String,
    handledIcon: Boolean,
    showCheckbox: Boolean,
    rounded: {
        type: Boolean,
        default: true
    }
});

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

const onIconClick = event => {
    if (props.handledIcon) {
        event.stopPropagation();
        event.preventDefault();
    }

    emit('icon-clicked');
};

const onChange = () => {
    validate();
    if (props.multiple && modelValue.value == props.disabledValue) modelValue.value = null;
    emit('change', modelValue.value);
};
</script>
