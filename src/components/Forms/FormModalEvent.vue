<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :title="isEditMode ? `Редактирование события ${formdata.id}` : 'Создание события'"
        :width="600"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <UiInput v-model="form.title" class="col-12" label="Название" :v="v$.form.title" />
                <UiInput
                    v-model="form.startDate"
                    class="col-12"
                    :v="v$.form.startDate"
                    type="datetime-local"
                    label="Начало события"
                />
                <UiInput
                    v-model="form.endDate"
                    class="col-12"
                    type="datetime-local"
                    label="Конец события"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" small icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" small icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import Loader from '@/components/common/Loader.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api.js';
import { useValidation } from '@/composables/useValidation.js';
import { useFormData } from '@/utils/use/useFormData.js';
import { reactive, ref } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['close', 'updated', 'created']);
const props = defineProps({
    formdata: {
        type: Object
    },
    forUpdate: Boolean
});

const { form, isEditMode } = useFormData(
    reactive({
        title: null,
        startDate: null,
        endDate: null,
        consultant_id: null
    }),
    props.formdata
);

const { v$, validate } = useValidation(
    {
        form: {
            title: {
                required: helpers.withMessage('Заполните название', required)
            },
            startDate: {
                required: helpers.withMessage('Выберите дату начала события', required)
            }
        }
    },
    { form }
);

const isLoading = ref(false);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    try {
        if (props.forUpdate) await update();
        else await create();
    } finally {
        isLoading.value = false;
    }
}

async function create() {
    const createdEvent = await api.calendar.createEvent(form);
    if (createdEvent) emit('created', form);
}

async function update() {
    const updatedEvent = await api.calendar.updateEvent(form);
    if (updatedEvent) emit('updated', form);
}
</script>
