<template>
    <div class="form__control">
        <label for="" :class="{ required: required }">
            <span v-if="label || $slots.label" class="form__label">
                <slot name="label" :label="label">{{ label }}</slot>
            </span>
            <Multiselect
                ref="multiselect"
                v-model="field"
                @change="onChange($event)"
                :value-prop="optionValueProp"
                :label="optionLabelProp"
                class="form__multiselect"
                :class="[validationClass, extraClasses, { filled: hasValue }]"
                :placeholder="placeholder"
                :mode="mode"
                :append-to-body="appendToBody"
                :options="_options"
                :close-on-select="closeOnSelect"
                :clear-on-select="clearOnSelect"
                :searchable="searchable"
                :create-tag="createTag"
                :can-deselect="canDeselect"
                :filterResults="filterResults"
                :min-chars="minChars"
                :resolve-on-load="resolveOnLoad"
                :delay="delay"
                :loading="loading"
                :multiple-label="multipleLabel"
                :disabled="Boolean(disabled)"
                :hide-selected="hideSelected"
                :groups="groups"
                no-results-text="Ничего не найдено"
                no-options-text="Список пуст"
                :open-direction="placement"
                :object="object"
            >
                <template v-if="$slots.singlelabel" #singlelabel="{ value }">
                    <div class="multiselect-single-label">
                        <slot name="singlelabel" :value="value" />
                    </div>
                </template>
                <template #option="{ option, isSelected, isPointed }">
                    <slot
                        name="option"
                        :option="option"
                        :isSelected="isSelected"
                        :isPointed="isPointed"
                    />
                </template>
                <template #tag="{ option, disabled, handleTagRemove }">
                    <slot
                        name="tag"
                        :option="option"
                        :disabled="disabled"
                        :handleTagRemove="handleTagRemove"
                    >
                        <div class="multiselect-tag">
                            <span>
                                <slot
                                    name="tag"
                                    :option="option"
                                    :disabled="disabled"
                                    :value-prop="optionLabelProp"
                                >
                                    {{ option[optionLabelProp] }}
                                </slot>
                            </span>
                            <UiButtonIcon
                                v-if="!disabled"
                                @click="handleTagRemove(option, $event)"
                                icon="fa-solid fa-close"
                                label="Удалить"
                                class="ml-1"
                            />
                        </div>
                    </slot>
                </template>
            </Multiselect>
        </label>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
        <div v-if="$slots.after" class="mt-2">
            <slot name="after" />
        </div>
        <div
            v-if="multiple && field?.length && localeOptionsLength"
            class="form__chips mt-2"
            :class="{ disabled: disabled }"
        >
            <div
                v-for="(element, index) in selectedOptions"
                :key="multipleProperty ? element.value : element"
            >
                <slot
                    name="chip"
                    :removeByIndex="removeElement"
                    :index="index"
                    :option="element"
                    :options="selectedOptions"
                >
                    <Chip
                        @delete="removeElement(index)"
                        :value="multipleProperty ? element.value : element"
                        :html="
                            multipleProperty ? element[multipleProperty] : localeOptions[element]
                        "
                    />
                </slot>
            </div>
        </div>
        <slot />
    </div>
</template>

<script setup>
import Multiselect from '@vueform/multiselect';
import Chip from '@/components/common/Chip.vue';
import ValidationMessage from '@/components/common/Forms/VaildationMessage.vue';
import { computed, ref, toRef, watch } from 'vue';
import { useFormControlValidation } from '@/composables/useFormControlValidation.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isArray } from '@/utils/helpers/array/isArray.js';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { plural } from '@/utils/plural.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

const emit = defineEmits(['change']);
const props = defineProps({
    v: {
        type: Object,
        default: null
    },
    label: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: 'Выберите значение..'
    },
    options: {
        type: [Function, Array, Object],
        required: true
    },
    mode: {
        type: String,
        default: 'single'
    },
    closeOnSelect: {
        type: Boolean,
        default: true
    },
    clearOnSelect: Boolean,
    searchable: Boolean,
    createTag: Boolean,
    canDeselect: Boolean,
    filterResults: {
        type: Boolean,
        default: true
    },
    minChars: {
        type: Number,
        default: 1
    },
    resolveOnLoad: {
        type: Boolean,
        default: true
    },
    delay: {
        type: Number,
        default: 0
    },
    extraClasses: {
        type: String,
        default: ''
    },
    loading: Boolean,
    name: {
        type: String,
        default: null
    },
    hideSelected: Boolean,
    groups: Boolean,
    multipleLabel: {
        type: Function,
        default: n => {
            return plural(
                n.length,
                'Выбран %d элемент',
                'Выбраны %d элемента',
                'Выбрано %d элементов'
            );
        }
    },
    multiple: Boolean,
    multipleProperty: {
        type: String,
        default: undefined
    },
    transform: {
        type: Function,
        default: value => value
    },
    disabled: {
        type: [Boolean, Number],
        default: false
    },
    reactive: {
        type: [Boolean, Number],
        default: false
    },
    required: Boolean,
    placement: {
        type: String,
        default: 'bottom'
    },
    object: Boolean,
    appendToBody: {
        type: Boolean,
        default: true
    },
    optionLabelProp: {
        type: String,
        default: 'label'
    },
    optionValueProp: {
        type: String,
        default: 'value'
    }
});

const modelValue = defineModel();
const field = ref(modelValue.value);
const localeOptions = ref([]);

const localeOptionsLength = computed(() => {
    if (isArray(localeOptions.value)) return localeOptions.value.length;
    return Object.keys(localeOptions.value).length;
});

const { hasValidationError, validate, validationClass } = useFormControlValidation(
    toRef(props, 'v'),
    field,
    { reactive: props.reactive }
);

const hasValue = computed(() => {
    if (isNullish(field.value)) return false;

    if (isArray(field.value)) return field.value.length;
    if (isString(field.value)) return isNotEmptyString(field.value);

    return isNotNullish(field.value);
});

const setData = () => {
    if (modelValue.value?.length)
        field.value = modelValue.value.map(element => element[props.name]);
    else field.value = [];
};

const _options = computed(() => {
    if (typeof props.options === 'function')
        return async (...args) => {
            const response = await props.options(...args);
            localeOptions.value = response;
            return response;
        };

    return props.options;
});

const selectedOptions = computed(() => {
    if (props.multipleProperty) {
        return field.value.map(element => {
            return localeOptions.value.find(item => item.value == element);
        });
    } else return field.value;
});

watch(modelValue, newValue => {
    if (props.name) setData();
    else if (field.value !== newValue) field.value = newValue;
});

const removeElement = index => {
    field.value.splice(index, 1);
};

const onChange = value => {
    if (value === undefined) return;

    if (props.name) {
        const newModelValue = value.map(element => ({ [props.name]: props.transform(element) }));
        modelValue.value = newModelValue;
        emit('change', newModelValue);
    } else {
        let finalValue = null;

        if (Array.isArray(value)) finalValue = value.map(props.transform);
        else finalValue = props.transform(value);

        modelValue.value = finalValue;
        emit('change', finalValue);
    }

    validate();
};

if (props.name) setData();
if (typeof props.options !== 'function') localeOptions.value = props.options;
</script>
