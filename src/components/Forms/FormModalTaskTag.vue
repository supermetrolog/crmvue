<template>
    <Modal
        @close="emit('close')"
        show
        :title="formData ? 'Редактирование тэга' : 'Создание тэга'"
        width="600"
    >
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup>
                <Input v-model="form.name" :v="v$.form.name" label="Тэг" class="col-12" required />
                <ColorPicker
                    v-model="form.color"
                    class="col-12"
                    :colors="COLORS"
                    label="Цвет"
                    circle
                    without-hashtag
                />
                <Textarea v-model="form.description" label="Описание" class="col-12" />
                <div class="mx-auto d-flex gap-2">
                    <FormSubmit success>Сохранить</FormSubmit>
                    <Button
                        v-if="formData"
                        @click="deleteTag"
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
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import useVuelidate from '@vuelidate/core';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, required } from '@vuelidate/validators';
import Input from '@/components/common/Forms/Input.vue';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import Textarea from '@/components/common/Forms/Textarea.vue';
import ColorPicker from '@/components/common/Forms/ColorPicker.vue';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: { type: Object, default: null } });

const notify = useNotify();
const { confirm } = useConfirm();

const COLORS = ['#c78a1b', '#fe6a49', '#423f3f', '#457dfa'];

const isLoading = shallowRef(false);
const form = reactive({
    name: null,
    description: null,
    color: '#f65f5f'
});

const v$ = useVuelidate(
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

const deleteTag = async () => {
    const confirmed = await confirm('Вы уверены, что хотите удалить тэг? Действие нельзя отменить');
    if (!confirmed) return;

    isLoading.value = true;

    const deleted = await api.taskTag.delete(props.formData.id);
    if (deleted) {
        notify.success('Тэг успешно удален.');
        emit('deleted');
        emit('close');
    }

    isLoading.value = false;
};

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    if (props.formData) await updateTag();
    else await createTag();

    isLoading.value = false;
};

if (props.formData) {
    Object.assign(form, { ...props.formData });
}
</script>
