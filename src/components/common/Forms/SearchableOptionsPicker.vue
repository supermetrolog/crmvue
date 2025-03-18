<template>
    <MultiSelect
        v-model="modelValue"
        :label="label"
        searchable
        can-deselect
        resolve-on-load
        :options="_options"
        :close-on-select="closeOnSelect"
        :placeholder="placeholder"
        :multiple-label="multipleLabelFn"
    />
</template>
<script setup>
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { plural } from '@/utils/plural.js';
import { computed } from 'vue';
import { isObject } from '@/utils/helpers/object/isObject.js';
import { isArray } from '@/utils/helpers/array/isArray.js';

const modelValue = defineModel();

const props = defineProps({
    closeOnSelect: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: 'Выберите вариант..'
    },
    label: {
        type: String,
        required: true
    },
    options: {
        type: [Array, Function, Object],
        required: true
    }
});

const multipleLabelFn = elements => {
    return plural(
        elements.length,
        'Выбран %d элемента',
        'Выбраны %d элемента',
        'Выбрано %d элементов'
    );
};

const _options = computed(() => {
    if (isObject(props.options) || isArray(props.options)) return () => props.options;
    return props.options;
});
</script>
