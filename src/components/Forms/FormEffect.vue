<template>
    <Modal
        @close="emit('close')"
        show
        :title="formData ? 'Редактирование эффекта' : 'Создание эффекта'"
        width="600"
    >
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup>
                <Input
                    v-model="form.title"
                    :v="v$.form.title"
                    label="Название эффекта"
                    class="col-6"
                    required
                />
                <Input
                    v-model="form.kind"
                    :disabled="formData"
                    :v="v$.form.kind"
                    label="KIND"
                    class="col-6"
                    required
                />
                <Textarea v-model="form.description" class="col-12" label="Описание эффекта" />
                <div class="mx-auto d-flex gap-2">
                    <FormSubmit success>Сохранить</FormSubmit>
                    <Button v-if="formData" @click="deleteEffect" danger> Удалить </Button>
                </div>
            </FormGroup>
        </Form>
    </Modal>
</template>
<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import { reactive, shallowRef } from 'vue';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import useVuelidate from '@vuelidate/core';
import api from '@/api/api.js';
import { useNotify } from '@/utils/useNotify.js';
import { helpers, required } from '@vuelidate/validators';
import Input from '@/components/common/Forms/Input.vue';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import Textarea from '@/components/common/Forms/Textarea.vue';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: { type: Object, default: null } });

const notify = useNotify();
const { confirm } = useConfirm();

const isLoading = shallowRef(false);
const form = reactive({
    title: null,
    kind: null,
    description: null
});

const v$ = useVuelidate(
    {
        form: {
            title: {
                required: helpers.withMessage('Заполните название', required)
            },
            kind: {
                required: helpers.withMessage('Заполните kind', required)
            }
        }
    },
    { form }
);

const createEffect = async () => {
    const created = await api.effect.create(form);
    if (created) {
        notify.success('Эффект успешно создан.');
        emit('created', created);
    }
};

const updateEffect = async () => {
    const updated = await api.effect.update(props.formData.id, form);
    if (updated) {
        notify.success('Эффект успешно обновлен.');
        emit('updated', updated);
    }
};

const deleteEffect = async () => {
    const confirmed = await confirm(
        'Вы уверены, что хотите удалить эффект? Действие нельзя отменить'
    );
    if (!confirmed) return;

    isLoading.value = true;

    const deleted = await api.effect.delete(props.formData.id);
    if (deleted) {
        notify.success('Эффект успешно удален.');
        emit('deleted');
        emit('close');
    }

    isLoading.value = false;
};

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    if (props.formData) await updateEffect();
    else await createEffect();

    isLoading.value = false;
};

if (props.formData) {
    Object.assign(form, { ...props.formData });
}
</script>
