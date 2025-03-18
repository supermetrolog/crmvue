<template>
    <UiModal
        @close="emit('close')"
        show
        custom-close
        :title="isEditMode ? `Редактирование тэга ${formData.id}` : 'Создание тэга'"
        :width="600"
    >
        <Loader v-if="isLoading || isDeleting" />
        <UiForm>
            <UiFormGroup>
                <UiInput
                    v-model="form.name"
                    :v="v$.form.name"
                    label="Тэг"
                    class="col-12"
                    required
                />
                <ColorPicker
                    v-model="form.color"
                    class="col-12"
                    :colors="COLORS"
                    label="Цвет"
                    circle
                    without-hashtag
                />
                <UiTextarea v-model="form.description" label="Описание" class="col-12" />
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
import { reactive, ref } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, required } from '@vuelidate/validators';
import UiInput from '@/components/common/Forms/UiInput.vue';
import Loader from '@/components/common/Loader.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import ColorPicker from '@/components/common/Forms/ColorPicker.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import { useFormData } from '@/utils/use/useFormData.js';
import { useAsync } from '@/composables/useAsync.js';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: Object });

const notify = useNotify();

const COLORS = ['#c78a1b', '#fe6a49', '#423f3f', '#457dfa'];

const { isEditMode, form, isDeletedEntity } = useFormData(
    reactive({
        name: null,
        description: null,
        color: '#f65f5f'
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        form: {
            name: {
                required: helpers.withMessage('Заполните поле', required)
            },
            color: {
                required: helpers.withMessage('Выберите цвет', required)
            }
        }
    },
    { form }
);

const createTag = async () => {
    const created = await api.taskTag.create(form);

    if (created) {
        notify.success('Тэг успешно создан.');
        emit('created', created);
    }
};

const updateTag = async () => {
    const updated = await api.taskTag.update(props.formData.id, form);

    if (updated) {
        notify.success('Тэг успешно обновлен.');
        emit('updated', updated);
    }
};

const { execute: deleteTag, isLoading: isDeleting } = useAsync(api.taskTag.delete, {
    onFetchResponse() {
        notify.success('Тэг успешно удален.');
        emit('deleted');
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить тэг',
        message: 'Вы уверены, что хотите удалить тэг? Действие нельзя отменить',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = ref(false);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    try {
        isLoading.value = true;

        if (isEditMode.value) await updateTag();
        else await createTag();
    } finally {
        isLoading.value = false;
    }
}
</script>
