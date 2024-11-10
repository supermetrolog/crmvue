<template>
    <MultiSelect
        v-model="modelValue"
        :label="label"
        searchable
        can-deselect
        resolve-on-load
        :delay="400"
        :options="options"
        :close-on-select="closeOnSelect"
        :placeholder="placeholder"
        :filter-results="false"
        :min-chars="1"
    >
        <template #option="{ option }">
            <CompanyPickerOption :option="option" />
        </template>
        <template v-if="$slots.tag" #tag="{ option }">
            <slot name="tag" :option="option"></slot>
        </template>
        <template #singlelabel="{ value }">
            <CompanyPickerOption class="custom" :option="value" />
        </template>
    </MultiSelect>
</template>
<script setup>
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import CompanyPickerOption from '@/components/common/Forms/CompanyPicker/CompanyPickerOption.vue';

const modelValue = defineModel();

defineProps({
    closeOnSelect: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: 'Название или ID компании..'
    },
    label: {
        type: String,
        default: 'Компания'
    },
    options: {
        type: [Array, Function, Object],
        required: true
    }
});
</script>
