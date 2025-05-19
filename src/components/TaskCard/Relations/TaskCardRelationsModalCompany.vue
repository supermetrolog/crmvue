<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="650"
        :title="isEditMode ? 'Редактирование связи с компанией' : 'Связать задачу с компанией'"
    >
        <Loader v-if="loading" small />
        <UiForm>
            <UiFormGroup>
                <CompanyPicker
                    v-if="!isEditMode"
                    v-model="form.company"
                    :v="v$.company"
                    :options="searchCompany"
                    label="Выбор компании"
                    placement="top"
                    class="col-12"
                    object
                />
                <UiTextarea v-model="form.comment" class="col-12" label="Комментарий" auto-height />
            </UiFormGroup>
            {{ form.company }}
        </UiForm>
        <template #actions="{ close }">
            <UiButton
                @click="submit"
                :disabled="loading || isNullish(form.company)"
                color="success-light"
                icon="fa-solid fa-check"
                :loading
            >
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { reactive, toRef } from 'vue';
import { helpers, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';
import Loader from '@/components/common/Loader.vue';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { useFormData } from '@/utils/use/useFormData.js';

const emit = defineEmits(['create', 'close']);
const props = defineProps({
    loading: Boolean,
    relations: {
        type: Array,
        default: () => []
    },
    formData: Object
});

const searchCompany = useSearchCompany(toRef(() => null));

const { form, isEditMode } = useFormData(
    reactive({
        company: null,
        comment: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        company: {
            required: helpers.withMessage('Укажите, на какую дату перенести задачу!', required)
        }
    },
    form
);

function formToPayload() {
    return {
        entity_type: 'company',
        entity_id: form.company.value,
        comment: form.comment
    };
}

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    emit('create', formToPayload());
}
</script>
