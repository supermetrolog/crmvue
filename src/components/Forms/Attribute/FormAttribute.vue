<template>
    <UiModal
        @closed="emit('close')"
        show
        :width="800"
        :title="isEditMode ? `Редактирование атрибута #${formData!.id}` : 'Новый атрибут'"
    >
        <Loader
            v-if="isLoading"
            :label="isDeleting ? 'Удаление атрибута' : 'Сохранение атрибута'"
        />
        <UiForm>
            <UiFormGroup>
                <UiCol :cols="8">
                    <UiFormGroup>
                        <UiInput
                            v-model="form.label"
                            :v="v$.label"
                            label="Название"
                            class="col-6"
                            required
                        />
                        <UiInput
                            v-model="form.kind"
                            :disabled="isEditMode"
                            :v="v$.kind"
                            label="KIND"
                            class="col-6"
                            required
                        />
                        <MultiSelect
                            v-model="form.value_type"
                            :v="v$.value_type"
                            label="Тип данных"
                            class="col-6"
                            required
                            searchable
                            :options="AttributeValueTypeOptions"
                        />
                        <MultiSelect
                            v-model="form.input_type"
                            :v="v$.input_type"
                            label="Тип поля"
                            class="col-6"
                            required
                            searchable
                            :options="AttributeInputTypeOptions"
                        />
                        <UiTextarea
                            v-model="form.description"
                            :v="v$.description"
                            class="col-12"
                            label="Описание"
                        />
                    </UiFormGroup>
                </UiCol>
                <UiCol :cols="4" class="variants" :class="{ active: isSelectableOptions }">
                    <UiFormGroup>
                        <UiCol :cols="12">
                            <FormAttributeOptions
                                v-model:options="form.options"
                                :attribute="formData"
                            />
                        </UiCol>
                    </UiFormGroup>
                </UiCol>
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
            <UiButton
                v-if="isEditMode"
                @click="deleteQuestion(formData!.id)"
                :disabled="isDeletedEntity"
                color="light"
                icon="fa-solid fa-trash"
            >
                Удалить
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, reactive } from 'vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { useValidation } from '@/composables/useValidation';
import { helpers, maxLength, required, requiredIf } from '@vuelidate/validators';
import api from '@/api/api';
import { useAsync } from '@/composables/useAsync';
import Loader from '@/components/common/Loader.vue';
import {
    Attribute,
    AttributeInputType,
    AttributeInputTypeOptions,
    AttributeValueTypeOptions
} from '@/modules/eav/attribute';
import { useFormData } from '@/utils/use/useFormData';
import { useNotify } from '@/utils/use/useNotify';
import { CreateAttributeDto } from '@/api/attribute';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import FormAttributeOptions from '@/components/Forms/Attribute/FormAttributeOptions.vue';
import { CreateAttributeOptionDto } from '@/api/attribute-option';

const emit = defineEmits<{
    created: [attribute: Attribute];
    updated: [attribute: Attribute];
    deleted: [attribute: Attribute];
    close: [];
}>();

const props = defineProps<{ formData?: Attribute | null }>();

const { form, isDeletedEntity, isEditMode } = useFormData(
    reactive<CreateAttributeDto & { options: CreateAttributeOptionDto[] }>({
        kind: '',
        label: '',
        description: null,
        value_type: '',
        input_type: '',
        options: []
    }),
    props.formData
);

const { v$, validate } = useValidation(
    {
        kind: {
            required: helpers.withMessage('Заполните KIND', requiredIf(isEditMode)),
            maxLength: helpers.withMessage('Не более 64 символов', maxLength(64))
        },
        label: {
            required: helpers.withMessage('Заполните название атрибута', required),
            maxLength: helpers.withMessage('Не более 64 символов', maxLength(64))
        },
        description: {
            maxLength: helpers.withMessage('Не более 64 символов', maxLength(255))
        },
        value_type: {
            required: helpers.withMessage('Выберите тип данных', required)
        },
        input_type: {
            required: helpers.withMessage('Выберите тип поля', required)
        }
    },
    form
);

const notify = useNotify();

const { isLoading: isCreating, execute: createQuestion } = useAsync(
    api.attribute.createWithOptions,
    {
        onFetchResponse: ({ response }) => {
            notify.success('Атрибут успешно создан.');
            emit('created', response);
        }
    }
);

const { isLoading: isUpdating, execute: updateQuestion } = useAsync(api.attribute.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Атрибут успешно обновлен.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deleteQuestion } = useAsync(api.attribute.delete, {
    onFetchResponse: () => {
        notify.success('Атрибут успешно удален.');
        emit('deleted', props.formData!);
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить атрибут',
        message: 'Вы уверены, что хотите удалить атрибут?',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateQuestion(props.formData!.id, form);
    else await createQuestion(form);
}

// options

const isSelectableOptions = computed(() => {
    return [
        AttributeInputType.Select,
        AttributeInputType.MultiSelect,
        AttributeInputType.Custom
    ].includes(form.input_type);
});
</script>
<style>
.variants {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.variants:not(.active) {
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
}
</style>
