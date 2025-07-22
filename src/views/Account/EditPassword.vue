<template>
    <UiForm @submit="onSubmit" class="account-edit">
        <div class="row">
            <div class="col-12">
                <div class="account-section">
                    <Loader v-if="isLoading" />
                    <p class="font-weight-semi fs-4">Смена пароля</p>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiInput
                            v-model="form.current_password"
                            :v="v$.form.current_password"
                            label="Текущий пароль"
                            class="col-6"
                            required
                        />
                        <UiInput
                            v-model="form.new_password"
                            :v="v$.form.new_password"
                            label="Новый пароль"
                            class="col-6"
                            required
                        />
                    </UiFormGroup>
                    <UiFormGroup>
                        <div class="col-12">
                            <Submit success class="w-100">Сохранить пароль</Submit>
                        </div>
                    </UiFormGroup>
                </div>
            </div>
        </div>
    </UiForm>
</template>

<script setup>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import Loader from '@/components/common/Loader.vue';
import api from '@/api/api.js';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import { reactive, ref } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { captureException } from '@sentry/vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, minLength, required } from '@vuelidate/validators';

const isLoading = ref(false);

const form = reactive({
    current_password: null,
    new_password: null
});

const notify = useNotify();

const { v$, validate } = useValidation(
    {
        form: {
            current_password: {
                required: helpers.withMessage('Укажите текущий пароль', required)
            },
            new_password: {
                required: helpers.withMessage('Укажите новый пароль', required),
                minLength: helpers.withMessage('Минимум 8 символов', minLength(8))
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
        await api.user.changePassword(form);

        notify.success('Пароль успешно изменен.');
    } catch (error) {
        captureException(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
