<template>
    <div class="form__control" :class="{ 'form__control--disabled': disabled }">
        <label for="" :class="{ required: required }">
            <span v-if="label" class="form__label">
                {{ label }}
            </span>
            <Multiselect
                ref="multiselect"
                v-model="field"
                @change="onChange($event)"
                class="form__multiselect"
                :class="[validationClass, extraClasses, { active: hasValue }]"
                :placeholder="placeholder"
                :mode="mode"
                append-to-body
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
                                <slot name="tag" :option="option" :disabled="disabled">
                                    {{ option.label }}
                                </slot>
                            </span>
                            <i
                                v-if="!disabled"
                                v-tippy="'Удалить'"
                                @click="handleTagRemove(option, $event)"
                                class="ml-1 fa-solid fa-close"
                            />
                        </div>
                    </slot>
                </template>
            </Multiselect>
        </label>
        <ValidationMessage v-if="hasValidationError" :message="v.$errors[0].$message" />
        <div v-if="multiple && field?.length && localeOptions?.length" class="form__chips mt-2">
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
import plural from 'plural-ru';

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
    clearOnSelect: {
        type: Boolean,
        default: false
    },
    searchable: {
        type: Boolean,
        default: false
    },
    createTag: {
        type: Boolean,
        default: false
    },
    canDeselect: {
        type: Boolean,
        default: false
    },
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
    loading: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: null
    },
    hideSelected: {
        type: Boolean,
        default: false
    },
    groups: {
        type: Boolean,
        default: false
    },
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
    multiple: {
        type: Boolean,
        default: false
    },
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
    required: {
        type: Boolean,
        default: false
    },
    placement: {
        type: String,
        default: 'bottom'
    },
    object: {
        type: Boolean,
        default: false
    }
});

const modelValue = defineModel();
const field = ref(modelValue.value);
const localeOptions = ref([]);

const { hasValidationError, validate, validationClass } = useFormControlValidation(
    toRef(props, 'v'),
    field,
    { reactive: props.reactive }
);

const hasValue = computed(() => {
    return field.value != null && field.value !== '' && field.value?.length;
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
