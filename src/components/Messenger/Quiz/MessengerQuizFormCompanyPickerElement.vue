<template>
    <div class="messenger-quiz-form-company-picker">
        <Form>
            <FormGroup>
                <Input
                    v-model="modelValue"
                    label="Площадь"
                    placeholder="Введите площадь.."
                    unit="м<sup>2</sup>"
                />
            </FormGroup>
        </Form>
    </div>
</template>
<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';

const modelValue = defineModel('area');
defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    company: {
        type: Object,
        required: true
    }
});
</script>
