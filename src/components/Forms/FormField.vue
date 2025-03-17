<template>
    <UiModal
        @closed="emit('close')"
        :width="700"
        :title="
            isEditMode
                ? `Редактирование поля для ответа #${formData.id}`
                : 'Создание поля для ответа'
        "
        show
    >
        <Loader v-if="isLoading" :label="isDeleting ? 'Удаление поля' : 'Сохранение поля'" />
        <UiForm>
            <UiFormGroup>
                <MultiSelect
                    v-model="form.field_type"
                    :v="v$.form.field_type"
                    class="col-6"
                    label="Тип поля"
                    :options="fieldOptions"
                    required
                />
                <MultiSelect
                    v-model="form.type"
                    :v="v$.form.type"
                    class="col-6"
                    label="Тип данных у поля"
                    :options="fieldTypeOptions"
                    required
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check" bolder small>
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" bolder small>
                Отмена
            </UiButton>
            <UiButton
                v-if="isEditMode"
                @click="deleteField(formData.id)"
                :disabled="isDeletedEntity"
                color="light"
                icon="fa-solid fa-trash"
                bolder
                small
            >
                Удалить
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed, reactive } from 'vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: Object });

const fieldOptions = {
    radio: 'Радио-кнопки',
    checkbox: 'Checkbox',
    'tab-checkbox': 'Tab-checkbox',
    input: 'Input',
    textarea: 'Textarea',
    files: 'files'
};

const fieldTypeOptions = {
    boolean: 'Boolean',
    string: 'String',
    integer: 'Integer',
    json: 'Json'
};

const notify = useNotify();

const { form, isDeletedEntity, isEditMode } = useFormData(
    reactive({
        field_type: null,
        type: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            field_type: {
                required: helpers.withMessage('Заполните поле', required)
            },
            type: {
                required: helpers.withMessage('Заполните поле', required)
            }
        }
    },
    { form }
);

const { isLoading: isCreating, execute: createField } = useAsync(api.field.create, {
    onFetchResponse: ({ response }) => {
        notify.success('Поле успешно создан.');
        emit('created', response);
    }
});

const { isLoading: isUpdating, execute: updateField } = useAsync(api.field.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Поле успешно обновлено.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deleteField } = useAsync(api.field.delete, {
    onFetchResponse: () => {
        notify.success('Поле успешно удалено.');
        emit('deleted');
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить поле',
        message: 'Вы уверены, что хотите удалить поле? Удаленное поле нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateField(props.formData.id, form);
    else await createField(form);
}
</script>
