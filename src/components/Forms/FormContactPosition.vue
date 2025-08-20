<template>
    <UiModal
        @closed="emit('close')"
        :width="600"
        :title="isEditMode ? `Редактирование должности #${formData.id}` : 'Новая должность'"
        show
    >
        <Loader
            v-if="isLoading"
            :label="isDeleting ? 'Удаление должности' : 'Сохранение должности'"
        />
        <UiForm>
            <UiFormGroup>
                <UiCol :cols="12">
                    <p class="font-weight-semi">Название должности *</p>
                    <div class="d-flex gap-1 align-items-start">
                        <UiCan admin>
                            <IconPicker v-model="form.icon" :color="`#${form.color}`" :size="40" />
                            <ColorPicker
                                v-model="form.color"
                                :colors="COLORS"
                                without-hashtag
                                :size="40"
                            />
                        </UiCan>
                        <UiInput v-model="form.name" :v="v$.name" required class="w-100" />
                    </div>
                </UiCol>
            </UiFormGroup>
            <UiCan admin>
                <UiFormDivider />
                <UiFormGroup>
                    <UiInput v-model="form.slug" :v="v$.slug" label="Slug" class="col-6" />
                    <UiInput
                        v-model="form.short_name"
                        :v="v$.short_name"
                        label="Сокращенное название"
                        class="col-6"
                    />
                    <UiTextarea
                        v-model="form.description"
                        :v="v$.description"
                        label="Описание"
                        class="col-12"
                        auto-height
                        :min-height="50"
                        :max-height="150"
                    />
                    <UiInput
                        v-model="form.sort_order"
                        type="number"
                        label="Порядковый номер"
                        class="col-12"
                    />
                </UiFormGroup>
                <UiFormDivider />
                <UiFormGroup>
                    <UiCol :cols="12">
                        <div class="d-flex gap-1 align-items-start">
                            <IconPicker v-model="form.icon" :color="`#${form.color}`" :size="40" />
                            <ColorPicker
                                v-model="form.color"
                                :colors="COLORS"
                                without-hashtag
                                :size="40"
                            />
                        </div>
                    </UiCol>
                </UiFormGroup>
                <UiFormDivider />
                <UiFormGroup>
                    <Switch
                        v-model="form.is_active"
                        true-title="Показывать в выборе"
                        :transform="Number"
                        class="col-12"
                    />
                </UiFormGroup>
            </UiCan>
        </UiForm>
        <template #actions>
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiCan admin>
                <UiButton
                    v-if="isEditMode"
                    @click="deletePosition(formData.id)"
                    :disabled="isDeletedEntity"
                    color="light"
                    icon="fa-solid fa-trash"
                >
                    Удалить
                </UiButton>
            </UiCan>
        </template>
    </UiModal>
</template>
<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import { computed, reactive } from 'vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { helpers, maxLength, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import { useValidation } from '@/composables/useValidation.js';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import ColorPicker from '@/components/common/Forms/ColorPicker.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import IconPicker from '@/components/common/Forms/IconPicker.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import UiCan from '@/components/common/UI/UiCan.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import Switch from '@/components/common/Forms/Switch.vue';

const COLORS = ['#c78a1b', '#fe6a49', '#423f3f', '#457dfa'];

const emit = defineEmits(['created', 'close']);

const props = defineProps({
    formData: Object
});

const notify = useNotify();

const { form, isEditMode } = useFormData(
    reactive({
        name: null,
        slug: null,
        short_name: null,
        description: null,
        icon: 'fa-solid fa-user',
        sort_order: 100,
        is_active: true,
        color: null
    }),
    props.formData
);

const { v$, validate, isDeletedEntity } = useValidation(
    {
        name: {
            required: helpers.withMessage('Заполните название', required),
            maxLength: helpers.withMessage(
                'Название не может быть больше 64 символов',
                maxLength(64)
            )
        },
        short_name: {
            maxLength: helpers.withMessage(
                'Сокр. назв. не может быть больше 32 символов',
                maxLength(32)
            )
        },
        description: {
            maxLength: helpers.withMessage(
                'Описание не может быть больше 255 символов',
                maxLength(255)
            )
        },
        slug: {
            maxLength: helpers.withMessage('Slug не может быть больше 64 символов', maxLength(64))
        }
    },
    form
);

const { isLoading: isCreating, execute: createPosition } = useAsync(api.contactPosition.create, {
    onFetchResponse: ({ response }) => {
        notify.success('Должность успешно добавлена.');
        emit('created', response);
    }
});

const { isLoading: isUpdating, execute: updatePosition } = useAsync(api.contactPosition.update, {
    onFetchResponse: ({ response }) => {
        notify.success('Должность успешно обновлена.');
        emit('updated', response);
    }
});

const { isLoading: isDeleting, execute: deletePosition } = useAsync(api.contactPosition.delete, {
    onFetchResponse: () => {
        notify.success('Должность успешно удалена.');
        emit('deleted');
        emit('close');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить должность',
        message:
            'Вы уверены, что хотите удалить должность? Удаленную должность нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const isLoading = computed(() => isCreating.value || isUpdating.value || isDeleting.value);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updatePosition(props.formData.id, form);
    else await createPosition(form);
}

// TODO: Update formData
</script>
