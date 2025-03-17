<template>
    <UiForm>
        <UiFormGroup>
            <CheckboxOptions
                v-model="categories"
                class="col-12"
                label="Категория"
                :options="CompanyCategories"
            />
            <ConsultantPicker
                v-model="consultantIds"
                class="col-12"
                :options="getConsultantsOptions"
                mode="multiple"
                :close-on-select="false"
                multiple
                multiple-property="label"
            />
        </UiFormGroup>
    </UiForm>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { computed } from 'vue';
import { CompanyCategories } from '@/const/const.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';

const modelValue = defineModel();
const { getConsultantsOptions } = useConsultantsOptions();

const categories = computed({
    get() {
        return modelValue.value?.categories ?? [];
    },
    set(value) {
        modelValue.value.categories = value;
    }
});

const consultantIds = computed({
    get() {
        return modelValue.value?.consultant_ids ?? [];
    },
    set(value) {
        modelValue.value.consultant_ids = value;
    }
});
</script>
