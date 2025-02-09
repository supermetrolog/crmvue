<template>
    <Modal
        @close="emit('close')"
        show
        :title="formData ? 'Редактирование вопроса' : 'Создание вопроса'"
        width="600"
    >
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup>
                <Input
                    v-model="form.text"
                    :v="v$.form.text"
                    label="Текст вопроса"
                    class="col-12"
                    required
                />
                <Input v-model="form.group" :v="v$.form.group" label="Группа" class="col-6" />
                <Input v-model="form.template" :v="v$.form.template" label="Шаблон" class="col-6" />
                <div class="mx-auto d-flex gap-2">
                    <FormSubmit success>Сохранить</FormSubmit>
                    <Button
                        v-if="formData"
                        @click="deleteQuestion"
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
import { helpers, maxLength, required } from '@vuelidate/validators';
import Input from '@/components/common/Forms/Input.vue';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({ formData: { type: Object, default: null } });

const notify = useNotify();
const { confirm } = useConfirm();

const isLoading = shallowRef(false);
const form = reactive({
    text: null,
    group: null
});

const v$ = useVuelidate(
    {
        form: {
            text: {
                required: helpers.withMessage('Заполните поле', required)
            },
            template: {
                max: helpers.withMessage('Не более 32 символов', maxLength(32))
            }
        }
    },
    { form }
);

const createQuestion = async () => {
    const created = await api.question.create(form);
    if (created) {
        notify.success('Question успешно создан.');
        emit('created', created);
    }
};

const updateQuestion = async () => {
    const updated = await api.question.update(props.formData.id, form);
    if (updated) {
        notify.success('Question успешно обновлен.');
        emit('updated', updated);
    }
};

const deleteQuestion = async () => {
    const confirmed = await confirm(
        'Вы уверены, что хотите удалить вопрос? Действие нельзя отменить'
    );
    if (!confirmed) return;

    isLoading.value = true;

    const deleted = await api.question.delete(props.formData.id);
    if (deleted) {
        notify.success('Вопрос успешно удален.');
        emit('deleted');
        emit('close');
    }

    isLoading.value = false;
};

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    if (props.formData) await updateQuestion();
    else await createQuestion();

    isLoading.value = false;
};

if (props.formData) {
    Object.assign(form, { ...props.formData });
}
</script>
