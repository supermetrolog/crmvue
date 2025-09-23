<template>
    <UiForm>
        <UiFormGroup>
            <UiInput v-model="form.label"
:v="v$.label"
label="Название"
required
class="col-6" />
            <UiInput v-model="form.code"
:v="v$.code"
label="Код"
required
class="col-6" />
            <UiInput v-model="form.type"
:v="v$.type"
label="Тип"
required
class="col-6" />
            <UiInput
                v-model="form.order"
                type="number"
                :v="v$.order"
                label="Порядок"
                required
                class="col-6"
            />
            <UiInput v-model="form.icon" label="Иконка" class="col-6" />
            <UiInput v-model="form.style" label="Стиль" class="col-6" />
        </UiFormGroup>
        <UiFormDivider />
        <UiFormGroup>
            <Switch
                v-model="form.confirmation"
                true-title="Необходимость подтверждения"
                :transform="Number"
                class="col-12"
            />
        </UiFormGroup>
        <UiFormDivider />
        <UiFormGroup>
            <UiTextarea
                v-model="form.payload"
                label="JSON Payload"
                auto-height
                :min-height="100"
                :max-height="200"
                class="col-12"
            />
        </UiFormGroup>
        <UiFormDivider />
        <UiFormGroup>
            <UiCol :cols="12">
                <div class="d-flex gap-2">
                    <UiButton
                        @click.prevent="confirmWithValidation"
                        color="success-light"
                        icon="fa-solid fa-check"
                    >
                        Добавить
                    </UiButton>
                    <UiButton @click.prevent="$emit('close')" color="light" icon="fa-solid fa-ban">
                        Отмена
                    </UiButton>
                </div>
            </UiCol>
        </UiFormGroup>
    </UiForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { useValidation } from '@/composables/useValidation';
import { helpers, required } from '@vuelidate/validators';
import Switch from '@/components/common/Forms/Switch.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiCol from '@/components/common/UI/UiCol.vue';

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'confirm', action): void;
}>();

const form = reactive({
    label: '',
    code: '',
    type: '',
    order: 1,
    icon: null,
    style: null,
    confirmation: false,
    payload: null
});

const { v$, withValidation } = useValidation(
    {
        label: {
            required: helpers.withMessage('Заполните название', required)
        },
        code: {
            required: helpers.withMessage('Заполните код', required)
        },
        type: {
            required: helpers.withMessage('Выберите тип', required)
        },
        order: {
            required: helpers.withMessage('Выберите порядок', required)
        }
    },
    form
);

function confirm() {
    emit('confirm', { ...form });
    emit('close');
}

const confirmWithValidation = withValidation(confirm);
</script>
