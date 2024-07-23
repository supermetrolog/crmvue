<template>
    <div ref="currentEl" class="form__control" :class="{ 'form__control--disabled': disabled }">
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
                    { 'form__input--unit': unit, 'form__input--rounded': rounded }
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

const modelValue = defineModel({
    type: [String, Number],
    default: ''
});

const props = defineProps({
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
    searchable: {
        type: Boolean,
        default: false
    },
    options: {
        type: [Array, Object],
        default: () => []
    },
    min: {
        type: [String, Number]
    },
    max: {
        type: [String, Number]
    },
    unit: {
        type: String,
        default: null
    },
    rounded: {
        type: Boolean,
        default: false
    },
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
    withEnterSubmit: {
        type: Boolean,
        default: false
    }
});

const searchableIsVisible = shallowRef(false);
const localeOptions = ref(props.options);
const currentEl = ref(null);
const searchableEl = ref(null);

const paddingRightStyle = computed(() => {
    let unitWidth = props.unit.replaceAll('/', '').replaceAll('<sup>', '').length * 10;
    let validationWidth = props.v && props.v.$dirty ? 20 : 0;
    return `padding-right: ${unitWidth + 20 + validationWidth}px`;
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
        if (props.type === 'number') modelValue.value = Number(value);
        else modelValue.value = value;
        search(value);
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
