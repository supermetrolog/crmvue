<template>
    <div class="messenger-quiz-form-company-picker">
        <div class="messenger-quiz-form-company-picker__list">
            <TransitionGroup name="opacity">
                <div v-if="!modelValue.length" class="messenger-quiz-form-company-picker-element">
                    Добавьте компанию..
                </div>
                <MessengerQuizFormCompanyPickerElement
                    v-for="company in modelValue"
                    :key="company.id"
                    @delete="deleteCompany(company.id)"
                    :company="company"
                />
            </TransitionGroup>
            <MessengerButton v-tippy="'Добавить компанию'" @click="openForm" :disabled="disabled">
                <i class="fa-solid fa-plus" />
            </MessengerButton>
        </div>
        <Modal @close="closeForm" width="800" title="Выбор компании" :show="formIsVisible">
            <Form>
                <FormGroup>
                    <CompanyPicker
                        v-model="form.company"
                        label="Выбор компаний"
                        :options="searchCompany"
                        placement="top"
                        class="col-8"
                        object
                    />
                    <Input
                        v-model="form.area"
                        :min="0"
                        type="number"
                        label="Площадь"
                        unit="м<sup>2</sup>"
                        class="col-4"
                    />
                </FormGroup>
            </Form>
            <template #footer>
                <Button @click="addCompany" :disabled="!form.company" small success>
                    Добавить
                </Button>
                <Button @click="closeForm" small>Отменить</Button>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import { reactive, ref, toRef } from 'vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizFormCompanyPickerElement from '@/components/Messenger/Quiz/MessengerQuizFormCompanyPickerElement.vue';
import Input from '@/components/common/Forms/Input.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import Button from '@/components/common/Button.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

const modelValue = defineModel();
defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});
const searchCompany = useSearchCompany(toRef(() => null));

const formIsVisible = ref(false);
const form = reactive({
    company: null,
    area: null
});

const clearForm = () => {
    form.company = null;
    form.area = null;
};

const openForm = () => {
    clearForm();
    formIsVisible.value = true;
};

const closeForm = () => {
    clearForm();
    formIsVisible.value = false;
};

const addCompany = () => {
    modelValue.value.push({
        id: form.company.value,
        name: form.company.label,
        area: form.area
    });

    closeForm();
};

const deleteCompany = companyId => {
    spliceById(modelValue.value, companyId);
};
</script>
<style>
.opacity-enter-active,
.opacity-leave-active {
    transition: all 1s ease;
}
.opacity-enter-from,
.opacity-leave-to {
    opacity: 0;
    transform: scale(0.3);
}
</style>
