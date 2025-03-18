<template>
    <UiModal
        @closed="emit('close')"
        :width="600"
        :title="isEditMode ? `Редактирование эффекта #${formData.id}` : 'Создание эффекта'"
        show
    >
        <Loader v-if="isLoading" :label="isDeleting ? 'Удаление эффекта' : 'Сохранение эффекта'" />
        <UiForm>
            <UiFormGroup>
                <UiInput
                    v-model="form.title"
                    :v="v$.form.title"
                    label="Название эффекта"
                    class="col-6"
                    required
                />
                <UiInput
                    v-model="form.kind"
                    :disabled="isEditMode"
                    :v="v$.form.kind"
                    label="KIND"
                    class="col-6"
                    required
                />
                <UiTextarea v-model="form.description" class="col-12" label="Описание эффекта" />
                <Switch
                    v-model="form.active"
                    true-title="Активен"
                    false-title="Отключен"
                    class="col-12"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check" small bolder>
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" small bolder>
                Отмена
            </UiButton>
            <UiButton
                v-if="isEditMode"
                @click="deleteEffect(formData.id)"
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
import { helpers, required } from '@vuelidate/validators';
import UiInput from '@/components/common/Forms/UiInput.vue';
import Loader from '@/components/common/Loader.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useValidation } from '@/composables/useValidation.js';
import { useFormData } from '@/utils/use/useFormData.js';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: Object });

const notify = useNotify();

const { form, isEditMode, isDeletedEntity } = useFormData(
    reactive({
        title: null,
        kind: null,
        description: null,
        active: true
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            title: {
                required: helpers.withMessage('Заполните название', required)
            },
            kind: {
                required: helpers.withMessage('Заполните kind', required)
            }
        }
    },
    { form }
);

const { isLoading: isCreating, execute: createEffect } = useAsync(api.effect.create, {
    onFetchResponse: ({ response }) => {
        notify.success('Эффект успешно создан.');
        emit('created', response);
    }
});

const { isLoading: isUpdating, execute: updateEffect } = useAsync(api.effect.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Эффект успешно обновлен.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deleteEffect } = useAsync(api.effect.delete, {
    onFetchResponse: () => {
        notify.success('Эффект успешно удален.');
        emit('deleted');
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить эффект',
        message: 'Вы уверены, что хотите удалить эффект? Удаленный эффект нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateEffect(props.formData.id, form);
    else await createEffect(form);
}
</script>
