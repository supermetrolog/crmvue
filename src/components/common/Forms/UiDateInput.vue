<template>
    <div class="form__control ui-date-input" :class="{ required: required }">
        <label>
            <span v-if="label" class="form__label">{{ label }}</span>
            <VueDatePicker
                @update:model-value="onInput"
                :model-value="modelValue"
                locale="ru"
                auto-apply
                :preset-dates="_presets"
                :required
                :min-date
                :max-date
                :time-picker-inline
                :format
                :placeholder
                :class="[inputClass, { filled: hasValue }]"
                :highlight="{ weekdays: [0, 6] }"
                class="ui-date-input__picker"
                teleport
                :inline
                :disabled
                :start-date
                :focus-start-date
            >
                <template #calendar-header="{ index, day }">
                    <div :class="{ 'color-success': index === 5 || index === 6 }">
                        {{ day }}
                    </div>
                </template>
                <template v-if="presetsLabel" #presets-label>
                    <span class="ui-date-input__presets-label">{{ presetsLabel }}:</span>
                </template>
            </VueDatePicker>
        </label>
        <ValidationInfo v-if="hasValidation && !disabled && !reactive" :validator="v" />
        <ValidationMessage v-if="hasValidationError && !disabled" :message="error" />
        <div v-if="$slots.after" class="mt-2">
            <slot name="after"></slot>
        </div>
    </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import { computed, toRef } from 'vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import ValidationInfo from '@/components/common/Forms/ValidationInfo.vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';

const emit = defineEmits(['change']);

const modelValue = defineModel();

const props = defineProps({
    presets: Array,
    presetsLabel: String,
    placeholder: String,
    format: {
        type: String,
        default: 'dd.MM.yyyy, HH:mm'
    },
    timePickerInline: {
        type: Boolean,
        default: true
    },
    minDate: [Date, String],
    maxDate: [Date, String],
    required: Boolean,
    disabled: Boolean,
    label: String,
    reactive: Boolean,
    inline: Boolean,
    inputClass: [String, Object, Array],
    v: Object,
    startDate: [Date, String],
    focusStartDate: Boolean
});

const _presets = computed(() => {
    if (!props.presets?.length) return undefined;

    if (isNotNullish(props.presetsLabel)) {
        return [
            {
                slot: 'presets-label',
                value: new Date(),
                label: props.presetsLabel
            },
            ...props.presets
        ];
    }

    return props.presets;
});

const hasValue = computed(() => isNotNullish(modelValue.value));

const { hasValidation, hasValidationError, validate, error } = useFormControlValidation(
    toRef(props, 'v'),
    modelValue,
    { reactive: props.reactive }
);

function onInput(value) {
    if (value !== modelValue.value) {
        modelValue.value = value;
        validate();
        emit('change', value);
    }
}

const validationClass = computed(() => {
    if (!props.v) return undefined;

    if (props.v.required) {
        if (props.v.$error) return 'invalid';
        else if (props.v.$dirty && !props.v.$error && !props.reactive) return 'valid';
    } else {
        if (props.v.$error) return 'invalid';
        else if (
            props.v.$dirty &&
            !props.v.$error &&
            isNotNullish(modelValue.value) &&
            !props.reactive
        )
            return 'valid';
    }

    return undefined;
});
</script>
