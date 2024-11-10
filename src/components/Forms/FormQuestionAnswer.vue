<template>
    <Modal
        @close="emit('close')"
        show
        :title="
            formData && formData.id ? 'Редактирование варианта ответа' : 'Создание варианта ответа'
        "
        width="1200"
    >
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <FormGroup>
                <MultiSelect
                    v-model="form.category"
                    :v="v$.form.category"
                    class="col-3"
                    label="Категория"
                    :options="categoryOptions"
                    required
                />
                <MultiSelect
                    v-if="fields.length"
                    v-model="form.field_id"
                    :v="v$.form.field_id"
                    label="Поле"
                    class="col-3"
                    :options="fields"
                />
                <Input
                    v-else
                    v-model="form.field_id"
                    :v="v$.form.field_id"
                    required
                    class="col-3"
                    type="number"
                    label="ID поля"
                />
                <MultiSelect
                    v-if="questions.length"
                    v-model="form.question_id"
                    :v="v$.form.question_id"
                    label="Вопрос"
                    class="col-3"
                    :options="questions"
                />
                <Input
                    v-else
                    v-model="form.question_id"
                    :v="v$.form.question_id"
                    required
                    class="col-3"
                    type="number"
                    label="ID вопроса"
                />
                <MultiSelect
                    v-model="form.effect_ids"
                    label="События"
                    class="col-3"
                    mode="tags"
                    searchable
                    :options="effects"
                />
                <Textarea
                    v-model="form.value"
                    :v="v$.form.value"
                    :required="valueIsRequired"
                    class="col-12"
                    label="Заголовок ответа"
                />
                <div class="mx-auto d-flex gap-2">
                    <FormSubmit success>Сохранить</FormSubmit>
                    <Button
                        v-if="formData"
                        @click="deleteAnswer"
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
import { computed, reactive, shallowRef } from 'vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import useVuelidate from '@vuelidate/core';
import api from '@/api/api.js';
import { useNotify } from '@/utils/useNotify.js';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Modal from '@/components/common/Modal.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import Button from '@/components/common/Button.vue';

const emit = defineEmits(['created', 'updated', 'close', 'deleted']);
const props = defineProps({
    questions: {
        type: Array,
        default: () => []
    },
    fields: {
        type: Array,
        default: () => []
    },
    effects: {
        type: Array,
        default: () => []
    },
    formData: {
        type: Object,
        default: null
    }
});

const categoryOptions = {
    'yes-no': 'Да/Нет [yes-no]',
    'text-answer': 'Текстовые поля [text-answer]',
    tab: 'Основные опции [tab]',
    checkbox: 'Дополнительные возможности [checkbox]'
};

const notify = useNotify();
const { confirm } = useConfirm();

const isLoading = shallowRef(false);
const form = reactive({
    category: null,
    field_id: null,
    question_id: null,
    value: null
});

const valueIsRequired = computed(() => {
    return form.category !== 'yes-no';
});

const v$ = useVuelidate(
    {
        form: {
            category: {
                required: helpers.withMessage('Заполните поле', required)
            },
            field_id: {
                required: helpers.withMessage('Заполните поле', required)
            },
            question_id: {
                required: helpers.withMessage('Заполните поле', required)
            },
            value: {
                required: helpers.withMessage(
                    'Заполните поле',
                    requiredIf(() => valueIsRequired.value)
                )
            }
        }
    },
    { form }
);

const createAnswer = async () => {
    const created = await api.question.createAnswerOption(form);
    if (created) {
        notify.success('AnswerOption успешно создан.');
        emit('created', created);
    }
};

const updateAnswer = async () => {
    const updated = await api.question.updateAnswerOption(props.formData.id, form);
    if (updated) {
        notify.success('AnswerOption успешно обновлен.');
        emit('updated', updated);
    }
};

const deleteAnswer = async () => {
    const confirmed = await confirm(
        'Вы уверены, что хотите удалить вариант ответа? Действие нельзя отменить'
    );
    if (!confirmed) return;

    isLoading.value = true;

    const deleted = await api.question.deleteAnswer(props.formData.id);
    if (deleted) {
        notify.success('Вариант ответа успешно удален.');
        emit('deleted');
        emit('close');
    }

    isLoading.value = false;
};

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    if (props.formData && props.formData.id) await updateAnswer();
    else await createAnswer();

    isLoading.value = false;
};

if (props.formData) {
    Object.assign(form, { ...props.formData });
}
</script>
