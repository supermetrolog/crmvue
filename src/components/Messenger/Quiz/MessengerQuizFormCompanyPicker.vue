<template>
    <div class="messenger-quiz-form-company-picker">
        <Form>
            <FormGroup>
                <CompanyPicker
                    v-model="modelValue"
                    label="Выбор компаний"
                    :options="searchCompany"
                    placement="top"
                    mode="tags"
                    class="col-12"
                    :disabled="disabled"
                    :close-on-select="false"
                />
            </FormGroup>
        </Form>
    </div>
</template>
<script setup>
import { toRef } from 'vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';

const modelValue = defineModel();
defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});

const searchCompany = useSearchCompany(toRef(() => null));
</script>
