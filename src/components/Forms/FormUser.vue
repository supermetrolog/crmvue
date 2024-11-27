<template>
    <Modal
        @close="$emit('close')"
        show
        :title="formData ? 'Изменение пользователя' : 'Создание пользователя'"
        class="modal-form-user"
        has-tabs
        width="1300"
    >
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <Tabs>
                <Tab name="Основные данные">
                    <FormGroup>
                        <Input
                            v-model="form.username"
                            :disabled="!!formData"
                            :v="v$.form.username"
                            label="Username"
                            :required="!formData"
                            class="col-4"
                        />
                        <Input
                            v-model="form.password"
                            :v="v$.form.password"
                            label="Пароль"
                            :required="!formData"
                            class="col-4"
                        />
                    </FormGroup>
                    <p class="form__block">Данные профиля</p>
                    <FormGroup>
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
                        <Input
                            v-model="form.userProfile.last_name"
                            label="Отчество"
                            class="col-4"
                        />
                        <Input
                            v-model="form.userProfile.caller_id"
                            :disabled="!!formData"
                            label="Добавочный номер"
                            maska="##########"
                            class="col-4"
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
                    </FormGroup>
                    <p class="form__block">Данные почты</p>
                    <FormGroup>
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
                    </FormGroup>
                    <p class="form__block">Статус</p>
                    <FormGroup>
                        <RadioOptions
                            v-model="form.role"
                            class="col-12"
                            label="Роль"
                            :options="RoleList"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Аватар">
                    <FormGroup>
                        <FileInput
                            v-model:native="form.files"
                            v-model:data="form.userProfile.avatar"
                            class="col-12 text-center"
                            single
                            only-images
                            :api-url="$url.api.uploads()"
                            accept="image/jpeg,image/png,image/jpg"
                        >
                            Выбрать аватар
                        </FileInput>
                    </FormGroup>
                </Tab>
            </Tabs>
            <FormGroup>
                <div class="d-flex mx-auto gap-2">
                    <Submit small success>
                        {{ formData ? 'Сохранить' : 'Создать' }}
                    </Submit>
                    <Button v-if="!!formData" @click="archiveUser" info>Отправить в архив</Button>
                </div>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script setup>
import { useStore } from 'vuex';
import useVuelidate from '@vuelidate/core';
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import Utils from '@/utils';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import { RoleList } from '@/const/const.js';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import { emptyWithProperty, everyProperty, validateEmail, validatePhone } from '@//validators';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import { reactive, shallowRef } from 'vue';
import { validationRulesForUser, validationRulesForUserProfile } from '@/validators/rules/user.js';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { userOptions } from '@/const/options/user.options.js';
import { helpers, or, requiredIf } from '@vuelidate/validators';
import api from '@/api/api.js';

const emit = defineEmits(['close', 'updated', 'created']);
const props = defineProps({
    formData: {
        type: Object,
        default: null
    }
});

const store = useStore();
const { confirm } = useConfirm();

const isLoading = shallowRef(false);

const form = reactive({
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
        avatar: null
    },
    files: []
});

const formEmailsValidators = [{ func: validateEmail, message: 'Укажите корректный Email' }];
const formPhonesValidators = [{ func: validatePhone, message: 'Укажите корректный телефон' }];

const emailsValidator = everyProperty(
    requiredIf(() => {
        return (
            form.userProfile.emails.length > 1 ||
            (props.formData && props.formData.userProfile.emails.length)
        );
    }),
    'email'
);

const phonesValidator = everyProperty(
    requiredIf(() => {
        return (
            form.userProfile.phones.length > 1 ||
            (props.formData && props.formData.userProfile.phones.length)
        );
    }),
    'phone'
);

const v$ = useVuelidate(
    {
        form: {
            ...validationRulesForUser,
            userProfile: {
                ...validationRulesForUserProfile,
                emails: {
                    required: helpers.withMessage('Пустые поля недопустимы', emailsValidator),
                    everyHasCorrectEmail: helpers.withMessage(
                        '',
                        or(emptyWithProperty('email'), everyProperty(validateEmail, 'email'))
                    )
                },
                phones: {
                    requiredIfMany: helpers.withMessage('Пустые поля недопустимы', phonesValidator),
                    everyHasCorrectPhone: helpers.withMessage(
                        '',
                        or(emptyWithProperty('phone'), everyProperty(validatePhone, 'phone'))
                    )
                }
            }
        }
    },
    { form }
);

const updateUser = async () => {
    const updated = await api.user.update(props.formData.id, form);

    if (updated) {
        emit('updated');
        emit('close');
        store.dispatch('refreshUser');
    }
};

const createUser = async () => {
    const created = await api.user.create(form);

    if (created) {
        emit('created');
        emit('close');
    }
};

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;
    if (props.formData) await updateUser();
    else await createUser();
    isLoading.value = false;
};

const archiveUser = async () => {
    const confirmed = await confirm(
        'Вы уверены, что хотите отправить пользователя в архив? Это действие нельзя отменить'
    );
    if (!confirmed) return;

    isLoading.value = true;
    form.status = userOptions.statusStatement.INACTIVE;
    await updateUser();
    isLoading.value = false;
};

if (props.formData) {
    Object.assign(form, cloneObject(props.formData));
    Utils.normalizeDataForUserForm(form);
}
</script>
