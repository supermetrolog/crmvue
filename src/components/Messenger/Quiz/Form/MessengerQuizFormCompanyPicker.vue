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
                    <div class="col-8">
                        <CompanyPicker
                            v-model="form.company"
                            label="Выбор компаний"
                            :options="searchCompany"
                            placement="top"
                            class="w-100"
                            :disabled="form.custom"
                            object
                        />
                        <Checkbox v-model="form.custom" class="mt-2">Компании нет в базе</Checkbox>
                    </div>
                    <Input
                        v-model="form.area"
                        :min="0"
                        type="number"
                        label="Площадь"
                        unit="м<sup>2</sup>"
                        class="col-4"
                    />
                    <AnimationTransition :speed="0.5">
                        <Input
                            v-if="form.custom"
                            v-model="form.name"
                            label="Название компании"
                            class="col-12"
                        />
                    </AnimationTransition>
                    <Textarea
                        v-model="form.description"
                        :v="v$.description"
                        :min-height="80"
                        :max-height="300"
                        auto-height
                        class="col-12"
                        label="Комментарий"
                        reactive
                    />
                </FormGroup>
            </Form>
            <template #footer>
                <Button @click="addCompany" :disabled="!form.company && !form.name" small success>
                    Добавить
                </Button>
                <Button @click="closeForm" small>Отменить</Button>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import { reactive, ref, toRef, watch } from 'vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizFormCompanyPickerElement from '@/components/Messenger/Quiz/Form/MessengerQuizFormCompanyPickerElement.vue';
import Input from '@/components/common/Forms/Input.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import Button from '@/components/common/Button.vue';
import { spliceById } from '@/utils/helpers/array/spliceById.js';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, maxLength } from '@vuelidate/validators';

const modelValue = defineModel();
defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});

const searchCompany = useSearchCompany(toRef(() => null));

let uniqueId = -1;

const formIsVisible = ref(false);
const form = reactive({
    company: null,
    area: null,
    custom: false,
    description: null,
    name: null
});

watch(
    () => form.custom,
    value => {
        if (value) form.company = null;
        else form.name = null;
    }
);

const v$ = useVuelidate(
    {
        description: {
            maxLength: helpers.withMessage('Максимум 128 символов', maxLength(128))
        }
    },
    form
);

const clearForm = () => {
    form.company = null;
    form.area = null;
    form.custom = false;
    form.description = null;
    form.name = null;
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
    if (form.custom) {
        modelValue.value.push({
            id: uniqueId,
            company_name: form.name,
            area: form.area,
            description: form.description,
            new: true
        });

        uniqueId--;
    } else {
        modelValue.value.push({
            id: form.company.value,
            company_id: form.company.value,
            company_name: form.company.label,
            area: form.area,
            description: form.description,
            new: false
        });
    }

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
