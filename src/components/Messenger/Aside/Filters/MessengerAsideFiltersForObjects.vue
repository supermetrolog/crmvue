<template>
    <Form>
        <FormGroup>
            <ConsultantPicker
                v-model="consultantIds"
                class="col-12"
                :options="getConsultantsOptions"
                mode="multiple"
                :close-on-select="false"
                multiple
                multiple-property="label"
            />
        </FormGroup>
    </Form>
</template>
<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { computed } from 'vue';

const modelValue = defineModel();
const { getConsultantsOptions } = useConsultantsOptions();

const consultantIds = computed({
    get() {
        return modelValue.value?.consultant_ids ?? [];
    },
    set(value) {
        modelValue.value.consultant_ids = value;
    }
});
</script>
