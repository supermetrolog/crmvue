<template>
    <UiModal
        @closed="emit('close')"
        :width="500"
        :title="isEditMode ? `Редактирование варианта` : 'Добавление варианта'"
        show
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <UiInput
                    v-model="form.label"
                    :v="v$.label"
                    required
                    label="Название"
                    class="col-12"
                />
            </UiFormGroup>
            <UiAccordion title="Продвинутые настройки">
                <template #body>
                    <UiFormGroup class="mt-2">
                        <UiInput
                            v-model="form.value"
                            @focus="valueHasChanges = true"
                            :v="v$.value"
                            required
                            label="Значение"
                            class="col-12"
                        />
                        <UiInput
                            v-model="form.sort_order"
                            label="Положение в списке"
                            class="col-12"
                        />
                    </UiFormGroup>
                </template>
            </UiAccordion>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-close">Отмена</UiButton>
            <UiButton
                v-if="isEditMode"
                @click="deleteOption(formData!.id)"
                color="light"
                icon="fa-solid fa-trash"
            >
                Удалить
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup lang="ts">
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed, reactive, ref, watch } from 'vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { helpers, maxLength, required } from '@vuelidate/validators';
import { useAsync } from '@/composables/useAsync';
import api from '@/api/api';
import { useNotify } from '@/utils/use/useNotify';
import Loader from '@/components/common/Loader.vue';
import { AttributeOption } from '@/modules/eav/attribute-option';
import { CreateAttributeOptionDto } from '@/api/attribute-option';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';
import { transliterate } from '@/utils/transliterate';

const emit = defineEmits<{
    created: [option: AttributeOption];
    updated: [option: AttributeOption];
    deleted: [option: AttributeOption];
    close: [];
}>();

const props = defineProps<{ formData: AttributeOption | null; attributeId: number }>();

const { form, isEditMode } = useFormData(
    reactive<CreateAttributeOptionDto>({
        label: '',
        value: '',
        sort_order: 10,
        attribute_id: props.attributeId
    }),
    props.formData
);

const valueHasChanges = ref(false);

watch(
    () => form.label,
    value => {
        if (valueHasChanges.value) {
            return;
        }

        if (value) {
            form.value = transliterate(value);
        } else {
            form.value = '';
        }
    }
);

const { v$, validate } = useValidation(
    {
        form: {
            value: {
                required: helpers.withMessage('Укажите значение', required),
                length: helpers.withMessage('Максимальная длина - 128 символов', maxLength(128))
            },
            label: {
                length: helpers.withMessage('Максимальная длина - 128 символов', maxLength(128))
            }
        }
    },
    { form }
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateOption(props.formData!.id, form);
    else await createOption(form);
}

const notify = useNotify();

const { isLoading: isCreating, execute: createOption } = useAsync(api.attributeOption.create, {
    onFetchResponse: ({ response }) => {
        notify.success('Вариант успешно обновлена.');
        emit('updated', response);
    }
});

const { isLoading: isUpdating, execute: updateOption } = useAsync(api.attributeOption.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Вариант успешно обновлена.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deleteOption } = useAsync(api.attributeOption.delete, {
    onFetchResponse: () => {
        notify.success('Вариант успешно удален.');
        emit('deleted', props.formData!);
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить вариант',
        message: 'Вы уверены, что хотите удалить вариант?',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);
</script>
