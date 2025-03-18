<template>
    <div class="form__control" :class="{ 'form__control--disabled': disabled }">
        <label>
            <span v-if="label" class="form__label">{{ label }}</span>
            <input
                ref="input"
                @input="onInput($event.target.value.trim())"
                @focus="onFocus"
                @keypress.enter="keyPressEnter"
                class="form__input"
                :class="[
                    validationClass,
                    { 'form__input--unit': unit, 'form__input--rounded': rounded, filled: hasValue }
                ]"
                :style="unit ? paddingRightStyle : undefined"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :value="modelValue"
                :min="min"
                :max="max"
                :required="required"
            />
            <span v-if="unit" ref="unit" class="form__unit" v-html="unit"></span>
            <slot />
        </label>
        <div v-if="searchable" ref="searchableEl" class="searchable">
            <div v-show="searchableIsVisible" class="searchable-container">
                <ul>
                    <li
                        v-for="(item, index) in localeOptions"
                        :key="index + 'fuck'"
                        @click="selectItem(item)"
                    >
                        {{ item }}
                    </li>
                </ul>
            </div>
        </div>
        <ValidationInfo v-if="hasValidation && !disabled && !reactive" :validator="v" />
        <ValidationMessage
            v-if="hasValidationError && !disabled"
            :message="v.$errors[0].$message"
        />
    </div>
</template>

<script setup>
import ValidationInfo from '@/components/common/Forms/ValidationInfo.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { computed, onMounted, ref, shallowRef, toRef, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

const modelValue = defineModel({
    type: [String, Number],
    default: ''
});

const props = defineProps({
    v: Object,
    type: {
        type: String,
        default: 'text'
    },
    label: String,
    placeholder: String,
    searchable: Boolean,
    options: {
        type: [Array, Object],
        default: () => []
    },
    min: [String, Number],
    max: [String, Number],
    unit: String,
    rounded: Boolean,
    disabled: Boolean,
    reactive: Boolean,
    required: Boolean,
    withEnterSubmit: Boolean
});

const searchableIsVisible = shallowRef(false);
const localeOptions = ref(props.options);
const searchableEl = ref(null);

const paddingRightStyle = computed(() => {
    let unitWidth = props.unit.replaceAll('/', '').replaceAll('<sup>', '').length * 10;
    let validationWidth = props.v && props.v.$dirty ? 20 : 0;
    return `padding-right: ${unitWidth + 20 + validationWidth}px`;
});

const hasValue = computed(() => {
    if (isNullish(modelValue.value)) return false;

    if (isArray(modelValue.value)) return modelValue.value.length;
    if (isString(modelValue.value)) return isNotEmptyString(modelValue.value);

    return isNotNullish(modelValue.value);
});

watch(
    () => props.options,
    () => {
        localeOptions.value = props.options;
    }
);

const search = value => {
    if (!props.searchable) return;

    searchableIsVisible.value = true;
    localeOptions.value = props.options.filter(
        element => element.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
};

const onFocus = () => {
    if (props.searchable) searchableIsVisible.value = true;
};

const { hasValidation, hasValidationError, validate, validationClass } = useFormControlValidation(
    toRef(props, 'v'),
    modelValue,
    { reactive: props.reactive }
);

const onInput = value => {
    if (value !== modelValue.value) {
        validate();

        if (props.type === 'number') {
            modelValue.value = value.length ? Number(value) : null;
        } else modelValue.value = value;

        if (props.searchable) search(value);
    }
};

const close = () => {
    searchableIsVisible.value = false;
};

const selectItem = item => {
    onInput(item);
    searchableIsVisible.value = false;
};

const keyPressEnter = event => {
    if (!props.withEnterSubmit) event.preventDefault();
};

if (props.searchable) onClickOutside(searchableEl, close);

onMounted(() => {
    if (props.reactive) validate();
});
</script>
