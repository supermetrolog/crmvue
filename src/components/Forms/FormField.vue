<template>
    <Modal
        @close="emit('close')"
        show
        :title="formData ? 'Редактирование поля для ответа' : 'Создание поля для ответа'"
        width="800"
    >
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup>
                <MultiSelect
                    v-model="form.field_type"
                    :v="v$.form.field_type"
                    class="col-6"
                    label="Тип поля"
                    :options="fieldOptions"
                    required
                />
                <MultiSelect
                    v-model="form.type"
                    :v="v$.form.type"
                    class="col-6"
                    label="Тип данных у поля"
                    :options="fieldTypeOptions"
                    required
                />
                <div class="mx-auto d-flex gap-2">
                    <FormSubmit success>Сохранить</FormSubmit>
                    <Button
                        v-if="formData"
                        @click="deleteField"
                        :disabled="formData.deleted_at !== null"
                        danger
                    >
                        Удалить
                    </Button>
                </div>
            </FormGroup>
        </Form>
    </Modal>
</template>
<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { reactive, shallowRef } from 'vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import useVuelidate from '@vuelidate/core';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: { type: Object, default: null } });

const fieldOptions = {
    radio: 'Радио-кнопки',
    checkbox: 'Checkbox',
    'tab-checkbox': 'Tab-checkbox',
    input: 'Input',
    textarea: 'Textarea',
    files: 'files'
};

const fieldTypeOptions = {
    boolean: 'Boolean',
    string: 'String',
    integer: 'Integer',
    json: 'Json'
};

const notify = useNotify();
const { confirm } = useConfirm();

const isLoading = shallowRef(false);
const form = reactive({
    field_type: null,
    type: null
});

const v$ = useVuelidate(
    {
        form: {
            field_type: {
                required: helpers.withMessage('Заполните поле', required)
            },
            type: {
                required: helpers.withMessage('Заполните поле', required)
            }
        }
    },
    { form }
);

const createField = async () => {
    const created = await api.field.create(form);
    if (created) {
        notify.success('Field успешно создано.');
        emit('created', created);
    }
};

const updateField = async () => {
    const updated = await api.field.update(props.formData.id, form);
    if (updated) {
        notify.success('Field успешно обновлено.');
        emit('updated', updated);
    }
};

const deleteField = async () => {
    const confirmed = await confirm(
        'Вы уверены, что хотите удалить поле? Действие нельзя отменить'
    );
    if (!confirmed) return;

    isLoading.value = true;

    const deleted = await api.field.delete(props.formData.id);
    if (deleted) {
        notify.success('Поле успешно удалено.');
        emit('deleted');
        emit('close');
    }

    isLoading.value = false;
};

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    if (props.formData) await updateField();
    else await createField();

    isLoading.value = false;
};

if (props.formData) {
    Object.assign(form, { ...props.formData });
}
</script>
