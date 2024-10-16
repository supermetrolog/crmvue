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
    >
        <template #option="{ option }">
            <ConsultantPickerOption :option="option" />
        </template>
        <template #singlelabel="{ value }">
            <ConsultantPickerOption class="custom" :option="value" />
        </template>
    </MultiSelect>
</template>
<script setup>
import ConsultantPickerOption from '@/components/common/Forms/ConsultantPicker/ConsultantPickerOption.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';

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
</script>
