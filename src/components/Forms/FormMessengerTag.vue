<template>
    <UiModal
        @closed="emit('close')"
        :width="500"
        :title="isEditMode ? `Редактирование тэга #${formData.id}` : 'Создание тэга'"
        show
    >
        <Loader v-if="isLoading" :label="isDeleting ? 'Удаление тэга' : 'Сохранение тэга'" />
        <UiForm>
            <UiFormGroup>
                <UiInput
                    v-model="form.name"
                    :v="v$.form.name"
                    label="Тэг"
                    class="col-12"
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
                @click="deleteTag(formData.id)"
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
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync.js';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: Object });

const notify = useNotify();

const { form, isEditMode, isDeletedEntity } = useFormData(
    reactive({
        name: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            name: {
                required: helpers.withMessage('Заполните поле', required)
            }
        }
    },
    { form }
);

const { isLoading: isCreating, execute: createTag } = useAsync(api.messengerTag.create, {
    onFetchResponse: ({ response }) => {
        notify.success('Тэг успешно создан.');
        emit('created', response);
    }
});

const { isLoading: isUpdating, execute: updateTag } = useAsync(api.messengerTag.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Тэг успешно обновлен.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deleteTag } = useAsync(api.messengerTag.delete, {
    onFetchResponse: () => {
        notify.success('Тэг успешно удален.');
        emit('deleted');
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить тэг',
        message: 'Вы уверены, что хотите удалить тэг? Удаленный тэг нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash',
        icon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateTag(props.formData.id, form);
    else await createTag(form);
}
</script>
