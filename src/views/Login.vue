<template>
    <div class="login">
        <div class="login__header">
            <div class="row no-gutters mb-4">
                <div class="col-12 logo">
                    <img src="@/assets/image/logo.png" alt="RAYS ARMA" />
                </div>
            </div>
            <div class="row no-gutters">
                <div class="col-12 text-center title">
                    <h3>Аутентификация</h3>
                </div>
            </div>
        </div>
        <div class="login__body">
            <div class="row no-gutters">
                <div class="col-12">
                    <UiForm @submit="submit" class="login__form">
                        <Loader v-if="isLoading" />
                        <UiFormGroup class="mb-3">
                            <UiInput
                                v-model="form.username"
                                :v="v$.form.username"
                                required
                                label="Логин"
                                class="col-12 mb-2"
                                with-enter-submit
                            />
                            <UiInput
                                v-model="form.password"
                                :v="v$.form.password"
                                required
                                class="col-12"
                                label="Пароль"
                                type="password"
                                with-enter-submit
                            />
                        </UiFormGroup>
                        <UiFormGroup>
                            <div class="col-12">
                                <FormSubmit
                                    class="w-100 btn-dark"
                                    :disabled="isLoading || hasValidationError"
                                >
                                    Войти
                                </FormSubmit>
                            </div>
                        </UiFormGroup>
                    </UiForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { helpers, minLength, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import { useStore } from 'vuex';
import { computed, shallowReactive, shallowRef } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { useRouter } from 'vue-router';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';
import useVuelidate from '@vuelidate/core';

const store = useStore();
const router = useRouter();
const { redirectRoute, setRedirect } = useAuth();

const isLoading = shallowRef(false);
const form = shallowReactive({
    username: null,
    password: null
});

const rules = {
    form: {
        username: {
            required: helpers.withMessage('Заполните логин', required),
            minLength: helpers.withMessage('Логин не может быть меньше 4 символов', minLength(4))
        },
        password: {
            required: helpers.withMessage('Заполните пароль', required),
            minLength: helpers.withMessage('Пароль не может быть меньше 4 символов', minLength(4))
        }
    }
};

const v$ = useVuelidate(rules, { form });

const hasValidationError = computed(() => v$.value.$error);

const submit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    try {
        const loggedIn = await store.dispatch('login', form);

        if (loggedIn) {
            await store.dispatch('initialize');

            if (redirectRoute.value) {
                if (redirectRoute.value.includes('/login')) setRedirect('/');
                await router.push({ path: redirectRoute.value });
                setRedirect(null);
            } else {
                await router.push({ name: 'root' });
            }
        }
    } finally {
        isLoading.value = false;
    }
};
</script>
