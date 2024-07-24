<template>
    <Modal @close="$emit('close')" title="Редактирование оборудования" width="700">
        <Loader v-if="isLoading" />
        <Form @submit="onSubmit">
            <FormGroup>
                <MultiSelect
                    v-model="form.passive_type"
                    :v="v$.form.passive_type"
                    :options="equipmentOptions.passiveType"
                    label="Причина пассива"
                    class="col-12"
                    required
                />
                <Textarea v-model="form.passive_comment" class="col-12" label="Описание причины" />
            </FormGroup>
            <FormGroup>
                <FormSubmit class="mx-auto" small success>Сохранить</FormSubmit>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script setup>
import Form from '@/components/common/Forms/Form.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import useVuelidate from '@vuelidate/core';
import api from '@//api/api.js';
import Modal from '@/components/common/Modal.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { reactive, shallowRef } from 'vue';
import { equipmentOptions } from '@/const/options/equipment.options.js';
import Textarea from '@/components/common/Forms/Textarea.vue';
import { useFormData } from '@/utils/useFormData.js';
import { helpers, required } from '@vuelidate/validators';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import Loader from '@/components/common/Loader.vue';
import { useNotify } from '@/utils/useNotify.js';

const emit = defineEmits(['close', 'updated']);
const props = defineProps({
    formData: {
        type: Object,
        default: null
    }
});

const { form } = useFormData(
    reactive({
        availability: null,
        delivery: null,
        address: null,
        name: null,
        state: null,
        description: null,
        contact_id: null,
        company_id: null,
        category: null,
        consultant_id: null,
        deliveryPrice: null,
        benefit: null,
        tax: null,
        price: null,
        count: null,
        files: [],
        fileList: [],
        photos: [],
        status: 2,
        passive_type: null,
        passive_comment: null
    }),
    props.formData
);

const isLoading = shallowRef(false);

const notify = useNotify();
const v$ = useVuelidate(
    {
        form: {
            passive_type: {
                required: helpers.withMessage('Выберите причину', required)
            }
        }
    },
    { form }
);

const onSubmit = () => {
    v$.value.$validate();

    if (!v$.value.form.$error) updateEquipment();
};
const updateEquipment = async () => {
    isLoading.value = true;

    form.status = equipmentOptions.statusStatement.PASSIVE;
    const equipment = await api.equipment.update(props.formData.id, form);

    isLoading.value = false;

    if (equipment) {
        notify.success('Оборудование отправлено в пассив');
        emit('updated', equipment);
        emit('close');
    }
};
</script>
