<template>
    <UiModal
        @closed="emit('close')"
        show
        :width="600"
        :title="isEditMode ? `Редактирование вопроса #${formData.id}` : 'Создание вопроса'"
    >
        <Loader v-if="isLoading" :label="isDeleting ? 'Удаление вопроса' : 'Сохранение вопроса'" />
        <UiForm>
            <UiFormGroup>
                <UiInput
                    v-model="form.text"
                    :v="v$.form.text"
                    label="Текст вопроса"
                    class="col-12"
                    required
                />
                <UiInput v-model="form.group" :v="v$.form.group" label="Группа" class="col-6" />
                <UiInput
                    v-model="form.template"
                    :v="v$.form.template"
                    label="Шаблон"
                    class="col-6"
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
                @click="deleteQuestion(formData.id)"
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
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, maxLength, required } from '@vuelidate/validators';
import UiInput from '@/components/common/Forms/UiInput.vue';
import Loader from '@/components/common/Loader.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import { useAsync } from '@/composables/useAsync.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: Object });

const notify = useNotify();

const { form, isDeletedEntity, isEditMode } = useFormData(
    reactive({
        text: null,
        group: null,
        template: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            text: {
                required: helpers.withMessage('Заполните поле', required)
            },
            template: {
                max: helpers.withMessage('Не более 32 символов', maxLength(32))
            }
        }
    },
    { form }
);

const { isLoading: isCreating, execute: createQuestion } = useAsync(api.question.create, {
    onFetchResponse: ({ response }) => {
        notify.success('Вопрос успешно создан.');
        emit('created', response);
    }
});

const { isLoading: isUpdating, execute: updateQuestion } = useAsync(api.question.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Вопрос успешно обновлен.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deleteQuestion } = useAsync(api.question.delete, {
    onFetchResponse: () => {
        notify.success('Вопрос успешно удален.');
        emit('deleted');
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить вопрос',
        message: 'Вы уверены, что хотите удалить вопрос? Удаленный вопрос нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateQuestion(props.formData.id, form);
    else await createQuestion(form);
}
</script>
