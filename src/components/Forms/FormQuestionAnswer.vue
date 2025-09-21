<template>
    <UiModal
        @closed="emit('close')"
        :title="
            isEditMode
                ? `Редактирование варианта ответа #${formData.id}`
                : 'Создание варианта ответа'
        "
        :width="1000"
        show
    >
        <Loader v-if="isLoading || optionsLoading" :label="loadingLabel" />
        <UiForm>
            <UiFormGroup>
                <MultiSelect
                    v-model="form.category"
                    :v="v$.form.category"
                    class="col-6"
                    label="Категория"
                    :options="categoryOptions"
                    required
                />
                <MultiSelect
                    v-if="fields.length"
                    v-model="form.field_id"
                    :v="v$.form.field_id"
                    label="Поле"
                    class="col-6"
                    :options="fields"
                />
                <UiInput
                    v-else
                    v-model="form.field_id"
                    :v="v$.form.field_id"
                    required
                    class="col-6"
                    type="number"
                    label="ID поля"
                />
                <MultiSelect
                    v-if="questions.length"
                    v-model="form.question_id"
                    :v="v$.form.question_id"
                    searchable
                    label="Вопрос"
                    class="col-6"
                    :options="questions"
                />
                <UiInput
                    v-else
                    v-model="form.question_id"
                    :v="v$.form.question_id"
                    required
                    class="col-6"
                    type="number"
                    label="ID вопроса"
                />
                <MultiSelect
                    v-model="form.effect_ids"
                    label="События"
                    class="col-6"
                    mode="tags"
                    searchable
                    :options="effects"
                />
                <UiTextarea
                    v-model="form.value"
                    :v="v$.form.value"
                    :required="valueIsRequired"
                    class="col-12"
                    label="Заголовок ответа"
                />
                <UiTextarea
                    v-model="form.message"
                    class="col-12"
                    label="Сообщение в случае ответа"
                />
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit"
color="success-light"
icon="fa-solid fa-check"
bolder
small>
                Сохранить
            </UiButton>
            <UiButton @click="close"
color="light"
icon="fa-solid fa-ban"
bolder
small>
                Отмена
            </UiButton>
            <UiButton
                v-if="isEditMode"
                @click="deleteQuestionAnswer(formData.id)"
                :disabled="isDeletedEntity"
                color="light"
                icon="fa-solid fa-trash"
                bolder
                small
            >
                Удалить
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed, reactive } from 'vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import { useAsync } from '@/composables/useAsync';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

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
    formData: Object,
    optionsLoading: Boolean
});

const categoryOptions = {
    'yes-no': 'Да/Нет [yes-no]',
    'text-answer': 'Текстовые поля [text-answer]',
    tab: 'Основные опции [tab]',
    checkbox: 'Дополнительные возможности [checkbox]',
    files: 'Файлы [files]',
    custom: 'Шаблон [custom]'
};

const notify = useNotify();

const valueIsRequired = computed(() => form.category !== 'yes-no');

const { form, isDeletedEntity, isEditMode } = useFormData(
    reactive({
        category: null,
        field_id: null,
        question_id: null,
        value: null,
        message: null,
        effect_ids: []
    }),
    props.formData,
    {
        transforms: {
            effect_ids: data => data.effects?.map(effect => effect.id) ?? []
        }
    }
);

const { v$, validate } = useValidation(
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

const { isLoading: isCreating, execute: createQuestionAnswer } = useAsync(
    api.question.createAnswerOption,
    {
        onFetchResponse: ({ response }) => {
            notify.success('Вопрос успешно создан.');
            emit('created', response);
        }
    }
);

const { isLoading: isUpdating, execute: updateQuestionAnswer } = useAsync(
    api.question.updateAnswerOption,
    {
        onFetchResponse: ({ response }) => {
            notify.success('Вопрос успешно обновлен.');
            emit('updated', response);
        }
    }
);

const { isLoading: isDeleting, execute: deleteQuestionAnswer } = useAsync(
    api.question.deleteAnswer,
    {
        onFetchResponse: () => {
            notify.success('Вопрос успешно удален.');
            emit('deleted');
            emit('close');
        },
        confirmation: true,
        confirmationContent: {
            title: 'Удалить вопрос',
            message: 'Вы уверены, что хотите удалить вопрос? Удаленный вопрос нельзя восстановить.',
            okButton: 'Удалить',
            okIcon: 'fa-solid fa-trash'
        }
    }
);

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);
const loadingLabel = computed(() => {
    if (props.optionsLoading) return 'Загрузка данных';
    if (isDeletedEntity.value) return 'Удаление варианта';
    return 'Обновление вариантов';
});

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateQuestionAnswer(props.formData.id, form);
    else await createQuestionAnswer(form);
}
</script>
