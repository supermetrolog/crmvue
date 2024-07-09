<template>
    <Modal
        @close="clickCloseModal"
        :title="formdata ? 'Изменение пользователя' : 'Создание пользователя'"
        class="modal-form-user"
    >
        <Form @submit="onSubmit">
            <Loader v-if="loader" />
            <div class="row">
                <Input
                    v-model="form.username"
                    :disabled="!!formdata"
                    :v="v$.form.username"
                    label="Юзернейм"
                    required
                    class="col-4"
                />
                <Input
                    v-model="form.password"
                    :v="v$.form.password"
                    label="Пароль"
                    :required="!formdata"
                    class="col-4"
                />
                <Input
                    v-model="form.userProfile.caller_id"
                    :disabled="!!formdata"
                    label="Добавочный номер"
                    maska="##########"
                    class="col-4"
                />
            </div>
            <div class="row mt-2">
                <Input
                    v-model="form.userProfile.middle_name"
                    label="Фамилия"
                    :v="v$.form.userProfile.middle_name"
                    required
                    class="col-4"
                />
                <Input
                    v-model="form.userProfile.first_name"
                    label="Имя"
                    :v="v$.form.userProfile.first_name"
                    required
                    class="col-4"
                />
                <Input v-model="form.userProfile.last_name" label="Отчество" class="col-4" />
            </div>
            <div class="row mt-2">
                <Input
                    v-model="form.email"
                    :v="v$.form.email"
                    label="Email для почты"
                    class="col-4"
                    title="Необходим для отправки предложений с аккаунта пользователя"
                />
                <Input
                    v-model="form.email_username"
                    label="Email логин"
                    class="col-4"
                    title="Необходим для отправки предложений с аккаунта пользователя"
                />
                <Input
                    v-model="form.email_password"
                    label="Email пароль"
                    class="col-4"
                    title="Необходим для отправки предложений с аккаунта пользователя"
                />
            </div>
            <div class="row mt-2">
                <PropogationInput
                    v-model="form.userProfile.phones"
                    :v="v$.form.userProfile.phones"
                    :validators="formPhonesValidators"
                    label="Телефон"
                    property-name="phone"
                    :maska="['+# (###) ###-##-##', '+## (###) ###-##-##', '+### (###) ###-##-##']"
                    class="col-4"
                    add-text="Добавить телефон"
                />
                <PropogationInput
                    v-model="form.userProfile.emails"
                    :v="v$.form.userProfile.emails"
                    :validators="formEmailsValidators"
                    label="Emails"
                    class="col-4"
                    property-name="email"
                />
                <FileInput
                    v-model:native="form.userProfile.fileList"
                    v-model:data="form.userProfile.avatar"
                    label="Аватар"
                    class="col-4 text-center"
                    single
                    only-images
                    :api-url="$url.api.uploads()"
                    accept="image/jpeg,image/png,image/jpg"
                >
                    Выбрать аватар
                </FileInput>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <span class="form__subtitle">Роль</span>
                    <div class="form__row mt-1">
                        <RadioChip
                            v-for="(role, value) in roleOptions"
                            :key="value"
                            v-model="form.role"
                            :label="role"
                            :value="Number(value)"
                        />
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <Submit class="col-3 mx-auto" small success>
                    {{ formdata ? 'Сохранить' : 'Создать' }}
                </Submit>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { mapActions } from 'vuex';
import useValidate from '@vuelidate/core';
import { helpers, or, required, requiredIf } from '@vuelidate/validators';
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import Utils, { cloneObject } from '@/utils';
import { RoleList } from '@/const/const.js';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import { emptyWithProperty, everyProperty, validateEmail, validatePhone } from '@//validators';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';

export default {
    name: 'FormUser',
    components: {
        Submit,
        RadioChip,
        Loader,
        Modal,
        Form,
        Input,
        FileInput,
        PropogationInput
    },
    emits: ['closeUserForm', 'updated', 'created'],
    props: {
        formdata: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            form: {
                username: null,
                password: null,
                email: null,
                email_username: null,
                email_password: null,
                role: 2,
                userProfile: {
                    first_name: null,
                    middle_name: null,
                    last_name: null,
                    phones: [],
                    emails: [],
                    caller_id: null,
                    avatar: null,
                    fileList: []
                }
            }
        };
    },
    computed: {
        roleOptions: () => RoleList,
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
                                requiredIf(
                                    () =>
                                        this.form.userProfile.emails.length > 1 ||
                                        this.formdata.userProfile.emails.length
                                ),
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
                                requiredIf(
                                    () =>
                                        this.form.userProfile.phones.length > 1 ||
                                        this.formdata.userProfile.phones.length
                                ),
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
                password: {
                    customRequired: helpers.withMessage('Введите пароль', this.customRequired)
                },
                email: {
                    email: helpers.withMessage('Заполните email правильно', validateEmail)
                }
            }
        };
    },
    methods: {
        ...mapActions(['CREATE_USER', 'UPDATE_USER', 'REFRESH_USER']),
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.loader = true;
                if (this.formdata) {
                    this.updateUser();
                } else {
                    this.createUser();
                }
            }
        },
        async updateUser() {
            if (await this.UPDATE_USER(this.form)) {
                this.$emit('updated');
                this.clickCloseModal();
                this.REFRESH_USER();
            }
            this.loader = false;
        },
        async createUser() {
            if (await this.CREATE_USER(this.form)) {
                this.$emit('created');

                this.clickCloseModal();
            }
            this.loader = false;
        },
        clickCloseModal() {
            this.$emit('closeUserForm');
        },
        customRequired(value) {
            if (!this.formdata) {
                if (value != null) {
                    return true;
                }
                return false;
            }
            return true;
        }
    },
    created() {
        this.loader = true;
        if (this.formdata) {
            this.form = { ...this.form, ...cloneObject(this.formdata) };
            this.form = Utils.normalizeDataForUserForm(this.form);
        }
        this.loader = false;
    }
};
</script>

<style></style>
