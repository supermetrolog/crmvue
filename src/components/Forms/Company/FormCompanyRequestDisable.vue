<template>
    <UiForm @submit="onSubmit">
        <Loader v-if="isLoading" />
        <UiFormGroup>
            <MultiSelect
                v-model="form.passive_why"
                :v="v$.form.passive_why"
                required
                label="Причина"
                class="col-12"
                :options="PassiveWhyRequest"
            />
            <UiTextarea
                v-model="form.passive_why_comment"
                :v="v$.form.passive_why_comment"
                required
                label="Комментарий"
                class="col-12 mt-1"
            />
        </UiFormGroup>
        <UiFormGroup>
            <UiCol :cols="12">
                <UiButton class="w-100" color="danger">Завершить</UiButton>
            </UiCol>
        </UiFormGroup>
    </UiForm>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { PassiveWhyRequest } from '@/const/const.js';
import { helpers, required } from '@vuelidate/validators';
import api from '@//api/api.js';
import Loader from '@/components/common/Loader.vue';
import { reactive, shallowRef } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import UiCol from '@/components/common/UI/UiCol.vue';

const emit = defineEmits(['disabled']);
const props = defineProps({
    request_id: {
        type: Number,
        required: true
    }
});

const isLoading = shallowRef(false);
const form = reactive({
    passive_why: null,
    passive_why_comment: null
});

const { v$, validate } = useValidation(
    {
        form: {
            passive_why: {
                required: helpers.withMessage('Выберите причину', required)
            },
            passive_why_comment: {
                required: helpers.withMessage('Укажите комментарий', required)
            }
        }
    },
    { form }
);

async function onSubmit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    try {
        const disabled = await api.request.disable(props.request_id, form);
        if (disabled) emit('disabled', form);
    } finally {
        isLoading.value = false;
    }
}
</script>
