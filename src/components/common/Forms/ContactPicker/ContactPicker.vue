<template>
    <MultiSelect
        v-model="modelValue"
        @change="$emit('change', $event)"
        :label
        searchable
        can-deselect
        resolve-on-load
        :delay="400"
        :options
        :close-on-select="closeOnSelect"
        :placeholder="placeholder"
        :filter-results="false"
        :min-chars="1"
    >
        <template #option="{ option }">
            <ContactPickerOption :option="option" />
        </template>
        <template v-if="$slots.tag" #tag="{ option }">
            <slot name="tag" :option="option"></slot>
        </template>
        <template #singlelabel="{ value }">
            <ContactPickerSingleLabel class="custom w-auto" :option="value" />
        </template>
        <template #after>
            <slot name="after" />
        </template>
    </MultiSelect>
</template>
<script setup>
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import ContactPickerOption from '@/components/common/Forms/ContactPicker/ContactPickerOption.vue';
import ContactPickerSingleLabel from '@/components/common/Forms/ContactPicker/ContactPickerSingleLabel.vue';

const modelValue = defineModel();

defineEmits(['change']);

defineProps({
    closeOnSelect: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: 'ФИО, компания, номер телефона или ID контакта..'
    },
    label: {
        type: String,
        default: 'Контакт'
    },
    options: {
        type: [Array, Function, Object],
        required: true
    }
});
</script>
