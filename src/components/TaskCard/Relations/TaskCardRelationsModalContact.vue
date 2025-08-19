<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="650"
        :title="isEditMode ? 'Редактирование связи с контактом' : 'Связать задачу с контактом'"
    >
        <Loader v-if="loading" small />
        <UiForm>
            <UiFormGroup>
                <ContactPicker
                    v-model="form.contact_id"
                    :v="v$.contact"
                    :options="searchContact"
                    label="Выбор контакта"
                    class="col-12"
                />
                <UiTextarea v-model="form.comment" class="col-12" label="Комментарий" auto-height />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton
                @click="submit"
                :disabled="loading || isNullish(form.contact_id)"
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
import { reactive } from 'vue';
import { helpers, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';
import Loader from '@/components/common/Loader.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { useFormData } from '@/utils/use/useFormData.js';
import api from '@/api/api.js';
import { contactOptions } from '@/const/options/contact.options.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import ContactPicker from '@/components/common/Forms/ContactPicker/ContactPicker.vue';

const emit = defineEmits(['create', 'close']);

const props = defineProps({
    loading: Boolean,
    relations: {
        type: Array,
        default: () => []
    },
    formData: Object
});

async function searchContact(search) {
    let query = { search };

    const response = await api.contacts.search({ ...query, type: 0, status: 1 });

    return response.data.map(element => ({
        value: element.id,
        label: element.full_name,
        isMain: element.isMain,
        position: element.position_unknown
            ? 'Должность неизвестна'
            : contactOptions.position[element.position],
        company: getCompanyName(element.company, element.company_id),
        phone: element.phones.length ? element.phones[0].phone : null
    }));
}

const { form, isEditMode } = useFormData(
    reactive({
        contact_id: null,
        comment: null
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        contact_id: {
            required: helpers.withMessage('Выберите контакт!', required)
        }
    },
    form
);

function formToPayload() {
    return {
        entity_type: 'contact',
        entity_id: form.contact_id,
        comment: form.comment
    };
}

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    emit('create', formToPayload());
}
</script>
