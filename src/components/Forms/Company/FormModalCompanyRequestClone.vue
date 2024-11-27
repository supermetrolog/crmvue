<template>
    <Modal @close="$emit('close')" show width="750" title="Клонирование запроса">
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup>
                <ConsultantPicker
                    v-model="form.consultant_id"
                    :v="v$.form.consultant_id"
                    :options="getConsultantsOptions"
                    required
                    class="col-8 mx-auto"
                />
                <div class="col-12 text-center mt-4">
                    <CompanyBoxRequestsListItem :request="request" read-only />
                </div>
                <Submit class="col-4 mt-2 mx-auto" success>Клонировать</Submit>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import Form from '@/components/common/Forms/Form.vue';
import Loader from '@/components/common/Loader.vue';
import CompanyBoxRequestsListItem from '@/components/Company/Box/CompanyBoxRequestsListItem.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import api from '@/api/api.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { reactive, ref } from 'vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';

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

const v$ = useVuelidate(
    {
        form: {
            consultant_id: {
                required: helpers.withMessage('Выберите консультанта', required)
            }
        }
    },
    { form }
);

async function onSubmit() {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    const request = {
        ...props.request,
        consultant_id: form.consultant_id
    };

    delete request.id;
    delete request.created_at;
    delete request.updated_at;

    request.status = 1;

    const createdRequest = await api.request.create(request);
    if (createdRequest) emit('cloned');

    isLoading.value = false;
}
</script>
