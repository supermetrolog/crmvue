<template>
    <Form @submit="onSubmit" class="account-edit">
        <div class="row">
            <div class="col-lg-8">
                <div class="account-section">
                    <Loader v-if="isLoading" />
                    <p class="account-section__title">Редактирование профиля</p>
                    <FormGroup>
                        <Input
                            v-model="form.userProfile.middle_name"
                            :v="v$.form.userProfile.middle_name"
                            label="Фамилия"
                            class="col-12 col-sm-6 col-lg-12 col-xl-4"
                            required
                        />
                        <Input
                            v-model="form.userProfile.first_name"
                            :v="v$.form.userProfile.first_name"
                            label="Имя"
                            class="col-12 col-sm-6 col-lg-12 col-xl-4"
                            required
                        />
                        <Input
                            v-model="form.userProfile.last_name"
                            :v="v$.form.userProfile.last_name"
                            label="Отчество"
                            class="col-12 col-sm-6 col-lg-12 col-xl-4"
                        />
                        <PropogationInput
                            v-model="form.userProfile.phones"
                            :v="v$.form.userProfile.phones"
                            :validators="formPhonesValidators"
                            label="Телефон"
                            property-name="phone"
                            :maska="[
                                '+# (###) ###-##-##',
                                '+## (###) ###-##-##',
                                '+### (###) ###-##-##'
                            ]"
                            class="col-12 col-sm-6 col-lg-12 col-xl-4"
                            add-text="Добавить телефон"
                        />
                        <PropogationInput
                            v-model="form.userProfile.emails"
                            :v="v$.form.userProfile.emails"
                            :validators="formEmailsValidators"
                            label="Emails"
                            class="col-12 col-sm-6 col-lg-12 col-xl-4"
                            property-name="email"
                            add-text="Добавить Email"
                        />
                        <Input
                            v-model="form.password"
                            label="Пароль"
                            class="col-12 col-sm-6 col-lg-12 col-xl-4"
                            type="password"
                        />
                    </FormGroup>
                    <FormGroup>
                        <div class="col-12">
                            <Submit success class="w-100">Сохранить изменения</Submit>
                        </div>
                    </FormGroup>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="account-section">
                    <p class="account-section__title">Редактирование аватара</p>
                    <FormGroup>
                        <FileInput
                            v-model:native="form.userProfile.fileList"
                            v-model:data="form.userProfile.avatar"
                            class="col-12 account-edit__avatar"
                            single
                            :api-url="$url.api.uploads()"
                            accept="image/jpeg,image/png,image/jpg"
                        >
                            Выбрать аватар
                        </FileInput>
                    </FormGroup>
                </div>
            </div>
        </div>
    </Form>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import { emptyWithProperty, everyProperty, validateEmail, validatePhone } from '@//validators';
import useValidate from '@vuelidate/core';
import { helpers, or, required, requiredIf } from '@vuelidate/validators';
import Submit from '@/components/common/Forms/Submit.vue';
import Loader from '@/components/common/Loader.vue';
import Utils, { cloneObject } from '@/utils';

export default {
    name: 'AccountEdit',
    components: { Loader, Submit, FileInput, PropogationInput, Input, FormGroup, Form },
    data() {
        return {
            isLoading: false,
            v$: useValidate(),
            form: {
                password: null,
                email: null,
                userProfile: {
                    first_name: null,
                    middle_name: null,
                    last_name: null,
                    phones: [],
                    emails: [],
                    avatar: null,
                    fileList: []
                }
            }
        };
    },
    computed: {
        formEmailsValidators() {
            return [{ func: validateEmail, message: 'Укажите корректный Email' }];
        },
        formPhonesValidators() {
            return [{ func: validatePhone, message: 'Укажите корректный телефон' }];
        }
    },
    validations() {
        return {
            form: {
                userProfile: {
                    first_name: {
                        required: helpers.withMessage('Введите имя', required)
                    },
                    middle_name: {
                        required: helpers.withMessage('Введите фамилию', required)
                    },
                    emails: {
                        required: helpers.withMessage(
                            'Пустые поля недопустимы',
                            everyProperty(
                                requiredIf(() => this.form.userProfile.emails.length > 1),
                                'email'
                            )
                        ),
                        everyHasCorrectEmail: helpers.withMessage(
                            '',
                            or(emptyWithProperty('email'), everyProperty(validateEmail, 'email'))
                        )
                    },
                    phones: {
                        requiredIfMany: helpers.withMessage(
                            'Пустые поля недопустимы',
                            everyProperty(
                                requiredIf(() => this.form.userProfile.phones.length > 1),
                                'phone'
                            )
                        ),
                        everyHasCorrectPhone: helpers.withMessage(
                            '',
                            or(emptyWithProperty('phone'), everyProperty(validatePhone, 'phone'))
                        )
                    }
                },
                username: {
                    required: helpers.withMessage('Введите юзернейм', required)
                },
                email: {
                    email: helpers.withMessage('Заполните email правильно', validateEmail)
                }
            }
        };
    },
    methods: {
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.isLoading = true;

                const updated = await this.$store.dispatch('UPDATE_USER', this.form);

                if (updated) {
                    await this.$store.dispatch('REFRESH_USER');
                } else {
                    this.$notify('При обновлении пользователя произошла ошибка. Попробуйте позже.');
                }

                this.form.password = null;
                this.v$.$reset();
                this.isLoading = false;
            }
        }
    },
    created() {
        this.form = Utils.normalizeDataForUserForm(cloneObject(this.$store.getters['THIS_USER']));
    }
};
</script>
