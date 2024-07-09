<template>
    <div class="login">
        <div class="login__header">
            <div class="row no-gutters mb-4">
                <div class="col-12 logo">
                    <img src="@/assets/image/pl-logo.png" alt="PENNY LANE REALTY" />
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
                    <Form @submit="submit" class="login__form">
                        <Loader v-if="isLoading" />
                        <FormGroup class="mb-3">
                            <Input
                                v-model="form.username"
                                :v="v$.form.username"
                                required
                                label="Логин"
                                class="col-12 mb-2"
                                with-enter-submit
                            />
                            <Input
                                v-model="form.password"
                                :v="v$.form.password"
                                required
                                class="col-12"
                                label="Пароль"
                                type="password"
                                with-enter-submit
                            />
                        </FormGroup>
                        <FormGroup>
                            <div class="col-12">
                                <FormSubmit
                                    class="w-100 btn-dark"
                                    :disabled="isLoading || hasValidationError"
                                >
                                    Войти
                                </FormSubmit>
                            </div>
                        </FormGroup>
                    </Form>
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
import Input from '@/components/common/Forms/Input.vue';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
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
    console.log('SUBMIT');

    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    const loggedIn = await store.dispatch('login', form);
    if (loggedIn) {
        await store.dispatch('INIT');
        if (redirectRoute.value) {
            await router.push({ path: redirectRoute.value });
            setRedirect(null);
        } else {
            await router.push({ name: 'root' });
        }
    }

    isLoading.value = false;
};
</script>
