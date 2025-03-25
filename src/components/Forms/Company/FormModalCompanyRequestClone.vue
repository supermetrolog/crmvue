<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="750"
        :title="`Клонирование запроса #${request.id}`"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <ConsultantPicker
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    :options="getConsultantsOptions"
                    required
                    class="col-12"
                />
                <div class="col-12 text-center mt-4">
                    <CompanyBoxRequestsListItem :request="request" read-only />
                </div>
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check" bolder>
                Клонировать
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" bolder>Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { reactive, ref } from 'vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';

const emit = defineEmits(['cloned', 'close']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const { getConsultantsOptions } = useConsultantsOptions();

const isLoading = ref(false);

const form = reactive({
    consultant_id: null
});

const { v$, validate } = useValidation(
    {
        form: {
            consultant_id: {
                required: helpers.withMessage('Выберите консультанта', required)
            }
        }
    },
    { form }
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    const request = {
        ...props.request,
        consultant_id: form.consultant_id
    };

    delete request.id;
    delete request.created_at;
    delete request.updated_at;

    request.status = 1;

    try {
        const createdRequest = await api.request.create(request);
        if (createdRequest) emit('cloned');
    } finally {
        isLoading.value = false;
    }
}
</script>
