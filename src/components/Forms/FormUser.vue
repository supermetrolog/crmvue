<template>
    <UiModal
        @close="$emit('close')"
        :width="1300"
        :title="isEditMode ? `Изменение пользователя #${formData.id}` : 'Создание пользователя'"
        class="modal-form-user"
        show
        custom-close
        has-tabs
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <Tabs>
                <Tab name="Основные данные">
                    <UiFormGroup>
                        <UiInput
                            v-model="form.username"
                            :disabled="isEditMode"
                            :v="v$.form.username"
                            label="Username"
                            :required="!isEditMode"
                            class="col-4"
                        />
                        <UiInput
                            v-model="form.password"
                            :v="v$.form.password"
                            label="Пароль"
                            :required="!isEditMode"
                            class="col-4"
                        />
                    </UiFormGroup>
                    <p class="form__block">Данные профиля</p>
                    <UiFormGroup>
                        <UiInput
                            v-model="form.userProfile.middle_name"
                            label="Фамилия"
                            :v="v$.form.userProfile.middle_name"
                            required
                            class="col-4"
                        />
                        <UiInput
                            v-model="form.userProfile.first_name"
                            label="Имя"
                            :v="v$.form.userProfile.first_name"
                            required
                            class="col-4"
                        />
                        <UiInput
                            v-model="form.userProfile.last_name"
                            label="Отчество"
                            class="col-4"
                        />
                        <UiInput
                            v-model="form.userProfile.caller_id"
                            label="Добавочный номер"
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
                    </UiFormGroup>
                    <p class="form__block">Данные почты</p>
                    <UiFormGroup>
                        <UiInput
                            v-model="form.email"
                            :v="v$.form.email"
                            label="Email для почты"
                            class="col-4"
                            title="Необходим для отправки предложений с аккаунта пользователя"
                        />
                        <UiInput
                            v-model="form.email_username"
                            label="Email логин"
                            class="col-4"
                            title="Необходим для отправки предложений с аккаунта пользователя"
                        />
                        <UiInput
                            v-model="form.email_password"
                            label="Email пароль"
                            class="col-4"
                            title="Необходим для отправки предложений с аккаунта пользователя"
                        />
                    </UiFormGroup>
                    <p class="form__block">Статус</p>
                    <UiFormGroup>
                        <RadioOptions
                            v-model="form.role"
                            class="col-12"
                            label="Роль"
                            :options="RoleList"
                            show-radio
                            :rounded="false"
                        />
                    </UiFormGroup>
                </Tab>
                <Tab name="Аватар">
                    <UiFormGroup>
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
                    </UiFormGroup>
                </Tab>
            </Tabs>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
            <UiButton
                v-if="isEditMode"
                @click="archiveUser"
                :loading="isLoadingArchive"
                color="light"
                icon="fa-solid fa-archive"
            >
                Отправить в архив
            </UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { useStore } from 'vuex';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import { RoleList } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import { emptyWithProperty, everyProperty, validateEmail, validatePhone } from '@//validators';
import { computed, onMounted, reactive } from 'vue';
import { validationRulesForUser, validationRulesForUserProfile } from '@/validators/rules/user.js';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { helpers, or, requiredIf } from '@vuelidate/validators';
import api from '@/api/api.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import { useAsync } from '@/composables/useAsync.js';

const emit = defineEmits(['close', 'updated', 'created']);
const props = defineProps({
    formData: Object
});

const store = useStore();

const { form, isEditMode } = useFormData(
    reactive({
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
    }),
    props.formData
);

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

const { v$, validate } = useValidation(
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

const { execute: updateUser, isLoading: isLoadingUpdate } = useAsync(api.user.update, {
    onFetchResponse({ response }) {
        emit('updated', response);
        emit('close');
        store.dispatch('refreshUser');
    },
    payload: () => [props.formData.id, form]
});

const { execute: createUser, isLoading: isLoadingCreate } = useAsync(api.user.create, {
    onFetchResponse({ response }) {
        emit('created', response);
        emit('close');
    }
});

const { execute: archiveUser, isLoading: isLoadingArchive } = useAsync(api.user.archive, {
    confirmation: true,
    confirmationContent: {
        title: 'Отправить в архив',
        message:
            'Вы уверены, что хотите отправить пользователя в архив? Пользователь не сможет входить в CRM.'
    },
    payload: () => props.formData.id
});

const isLoading = computed(
    () => isLoadingUpdate.value || isLoadingCreate.value || isLoadingArchive.value
);

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    if (isEditMode.value) await updateUser();
    else await createUser(form);
}

onMounted(() => {
    delete form.password;
    delete form.created_at;
});
</script>
