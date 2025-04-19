<template>
    <UiModal
        @closed="emit('close')"
        :width="500"
        :title="isEditMode ? `Редактирование папки #${formData.id}` : 'Новая папка'"
        show
    >
        <Loader v-if="isLoading" :label="isDeleting ? 'Удаление папки' : 'Сохранение папки'" />
        <UiForm>
            <UiFormGroup>
                <UiCol :cols="12">
                    <p class="form__label">Название папки *</p>
                    <div class="d-flex gap-1 align-items-start">
                        <IconPicker v-model="form.icon" :color="`#${form.color}`" :size="40" />
                        <ColorPicker
                            v-model="form.color"
                            :colors="COLORS"
                            without-hashtag
                            :size="40"
                        />
                        <UiInput v-model="form.name" :v="v$.form.name" required class="w-100" />
                    </div>
                </UiCol>
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
            <UiButton
                v-if="isEditMode"
                @click="deleteFolder(formData.id)"
                :disabled="isDeletedEntity"
                color="light"
                icon="fa-solid fa-trash"
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
import Loader from '@/components/common/Loader.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import ColorPicker from '@/components/common/Forms/ColorPicker.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import IconPicker from '@/components/common/Forms/IconPicker.vue';
import UiCol from '@/components/common/UI/UiCol.vue';

const COLORS = ['#c78a1b', '#fe6a49', '#423f3f', '#457dfa'];

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({
    formData: Object,
    morph: {
        type: String,
        required: true
    }
});

const notify = useNotify();

const { form, isDeletedEntity, isEditMode } = useFormData(
    reactive({
        name: null,
        color: '7c7c86',
        icon: 'fa-solid fa-folder',
        morph: props.morph
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            name: {
                required: helpers.withMessage('Заполните название', required),
                maxLength: helpers.withMessage(
                    'Название не может быть больше 60 символов',
                    maxLength(60)
                )
            }
        }
    },
    { form }
);

const { isLoading: isCreating, execute: createFolder } = useAsync(api.folder.create, {
    onFetchResponse: ({ response }) => {
        notify.success('Папка успешно создана.');
        emit('created', response);
    }
});

const { isLoading: isUpdating, execute: updateFolder } = useAsync(api.folder.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Папка успешно обновлена.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deleteFolder } = useAsync(api.folder.delete, {
    onFetchResponse: () => {
        notify.success('Папка успешно удалена.');
        emit('deleted');
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить папку',
        message: 'Вы уверены, что хотите удалить папку? Удаленную папку нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateFolder(props.formData.id, form);
    else await createFolder(form);
}
</script>
