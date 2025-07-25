<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="650"
        title="Закрепить сообщение за компанией"
    >
        <Loader v-if="isLoading" small />
        <UiForm>
            <UiFormGroup>
                <CompanyPicker
                    v-model="form.company_id"
                    :v="v$.company_id"
                    :options="searchCompany"
                    label="Выбор компании"
                    placement="top"
                    class="col-12"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton
                @click="submit"
                :disabled="isNullish(form.company_id)"
                color="success-light"
                icon="fa-solid fa-check"
                :loading="isLoading"
            >
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { reactive, ref, toRef } from 'vue';
import { helpers, required } from '@vuelidate/validators';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { useValidation } from '@/composables/useValidation.js';
import Loader from '@/components/common/Loader.vue';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import api from '@/api/api.js';
import { captureException } from '@sentry/vue';
import { useNotify } from '@/utils/use/useNotify.js';

const emit = defineEmits(['created', 'close']);
const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

const searchCompany = useSearchCompany(toRef(() => props.message.to.model_id));

const form = reactive({
    company_id: props.message.to.model_id
});

const { v$, validate } = useValidation(
    {
        company_id: {
            required: helpers.withMessage('Выберите компанию!', required)
        }
    },
    form
);

const notify = useNotify();
const isLoading = ref(false);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    try {
        const response = await api.companies.pinMessage(form.company_id, {
            message_id: props.message.id
        });

        notify.success('Сообщение успешно закреплено');
        emit('created', response);
    } catch (e) {
        captureException(e);
    } finally {
        isLoading.value = false;
    }
}
</script>
