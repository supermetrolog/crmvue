<template>
    <MultiSelect
        v-model="modelValue"
        :label="label"
        searchable
        can-deselect
        resolve-on-load
        :delay="500"
        :options="options"
        :close-on-select="closeOnSelect"
        :placeholder="placeholder"
        :multiple-label="multipleLabelFn"
    >
        <template #option="{ option }">
            <ConsultantPickerOption :option="option" />
        </template>
        <template #singlelabel="{ value }">
            <ConsultantPickerOption class="custom" :option="value" />
        </template>
        <template #chip="{ option, removeByIndex, index }">
            <ConsultantPickerOptionChip @remove="removeByIndex(index)" :option="option" />
        </template>
    </MultiSelect>
</template>
<script setup>
import ConsultantPickerOption from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOption.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import ConsultantPickerOptionChip from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOptionChip.vue';
import plural from 'plural-ru';

const modelValue = defineModel();

defineProps({
    closeOnSelect: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: 'Выберите консультанта..'
    },
    label: {
        type: String,
        default: 'Консультант'
    },
    options: {
        type: [Array, Function, Object],
        required: true
    }
});

const multipleLabelFn = elements => {
    return plural(
        elements.length,
        'Выбран %d сотрудник',
        'Выбраны %d сотрудника',
        'Выбрано %d сотрудников'
    );
};
</script>
