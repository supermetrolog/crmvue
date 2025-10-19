<template>
    <UiModal
        @close="$emit('close')"
        :width="1300"
        custom-close
        show
        :min-height="500"
        :title="isEditMode ? `Редактирование контакта #${formdata.id}` : 'Создание нового контакта'"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <UiFormGroup>
                <UiInput v-model="form.middle_name" label="Фамилия" class="col-4" />
                <UiInput
                    v-model="form.first_name"
                    label="Имя"
                    :v="v$.form.first_name"
                    required
                    class="col-4"
                >
                    <UiCheckbox
                        v-model="form.isMain"
                        numeric
                        label="Основной контакт компании"
                        class="mt-1"
                    />
                </UiInput>
                <UiInput v-model="form.last_name" label="Отчество" class="col-4" />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <FormCompanyContactPhones
                    v-model:phones="form.phones"
                    :contact="formdata"
                    class="col-4"
                />
                <PropogationInput
                    v-model="form.emails"
                    :v="v$.form.emails"
                    :validators="formContactsEmailsValidators"
                    addText="Добавить Email"
                    property-name="email"
                    label="Email"
                    class="col-3"
                />
                <UiCol :cols="1">
                    <template v-if="form.emails.length">
                        <span class="form__subtitle">Осн.</span>
                        <CheckboxChip
                            v-for="(email, key) in form.emails"
                            :key="key"
                            v-model="email.isMain"
                            @change="onChangeIsMainEmail(key)"
                            :v="v$.form.emails"
                            title="Основной Email"
                            class="mb-2"
                            icon="fa-solid fa-user-check"
                        />
                    </template>
                </UiCol>
                <UiPhoneInput
                    v-model="form.invalidPhones"
                    :disabled="form.invalidPhones.length === 0"
                    maska="#################################"
                    addText="Добавить телефон"
                    first-name="phone"
                    second-name="exten"
                    label="Невалидный телефон"
                    class="col-4"
                />
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <UiCol :cols="12">
                    <span class="form__subtitle">Способ информирования</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="(element, index) in FeedbackIcons"
                            :key="index"
                            v-model="form.wayOfInformings"
                            property="way"
                            :value="index"
                            :text="element.name"
                            :icon="element.icon"
                            show-checkbox
                            :rounded="false"
                        />
                    </div>
                </UiCol>
            </UiFormGroup>
            <UiFormDivider />
            <UiFormGroup>
                <MultiSelect
                    v-model="form.company_id"
                    class="col-6"
                    extra-classes="long-text"
                    label="Компания"
                    required
                    :v="v$.form.company_id"
                    :filterResults="false"
                    resolve-on-load
                    :min-chars="1"
                    :delay="600"
                    :searchable="true"
                    :options="
                        async query => {
                            return await searchCompany(query);
                        }
                    "
                />
                <ContactPositionPicker
                    v-model="form.position_id"
                    v-model:unknown="form.position_unknown"
                    :v="v$.form.position_id"
                    required
                    class="col-6"
                />
            </UiFormGroup>
            <UiFormGroup>
                <ConsultantPicker
                    v-model="form.consultant_id"
                    class="col-6"
                    :v="v$.form.consultant_id"
                    required
                    :options="getConsultantsOptions"
                />
                <UiCol :cols="6">
                    <span class="form__subtitle">Прочее</span>
                    <div class="form__row mt-1">
                        <RadioChip
                            v-model="form.good"
                            icon="fa-regular fa-smile"
                            label="Хорошие взаимоотношения"
                            :rounded="false"
                            :value="1"
                            unselect
                        />
                        <RadioChip
                            v-model="form.faceToFaceMeeting"
                            icon="fa-regular fa-handshake"
                            label="Очная встреча"
                            :value="1"
                            :rounded="false"
                            unselect
                        />
                        <RadioChip
                            v-model="form.warning"
                            @change="onChangeWarning"
                            icon="fa-solid fa-exclamation-triangle"
                            label="Внимание!"
                            :value="1"
                            :rounded="false"
                            unselect
                        />
                    </div>
                </UiCol>
                <AnimationTransition :speed="0.5">
                    <UiCol v-if="form.warning" :cols="12">
                        <div class="dashboard-bg-light p-2 br-1">
                            <UiTextarea
                                v-model="form.warning_why_comment"
                                :v="v$.form.warning_why_comment"
                                :min-height="50"
                                :auto-height
                                :max-height="150"
                                required
                                label="Комментарий"
                                placeholder='Опишите причину к статусу "Внимание"..'
                            />
                        </div>
                    </UiCol>
                </AnimationTransition>
            </UiFormGroup>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" icon="fa-solid fa-check">
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban">Отмена</UiButton>
        </template>
    </UiModal>
</template>

<script setup>
import { helpers, or, required } from '@vuelidate/validators';
import { FeedbackIcons } from '@/const/const.js';
import UiInput from '@/components/common/Forms/UiInput.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import UiPhoneInput from '@/components/common/Forms/UiPhoneInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Loader from '@/components/common/Loader.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import { anyHasProperty, emptyWithProperty, everyProperty, validateEmail } from '@//validators';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { reactive, ref, toRef } from 'vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import api from '@/api/api.js';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { useValidation } from '@/composables/useValidation.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import { captureException } from '@sentry/vue';
import FormCompanyContactPhones from '@/components/Forms/Company/FormCompanyContactPhones.vue';
import ContactPositionPicker from '@/components/common/Forms/ContactPositionPicker/ContactPositionPicker.vue';
import { useUserNotificationsPause } from '@/composables/useUserNotificationsPause';

const emit = defineEmits(['close', 'updated', 'created']);
const props = defineProps({
    formdata: {
        type: Object,
        default: null
    },
    company_id: {
        type: Number,
        default: null
    }
});

useUserNotificationsPause('company-contact-form');

const { getConsultantsOptions } = useConsultantsOptions();
const { form, isEditMode } = useFormData(
    reactive({
        company_id: props.company_id,
        first_name: null,
        middle_name: null,
        last_name: null,
        position_id: null,
        faceToFaceMeeting: 0,
        warning: 0,
        good: 0,
        status: 1,
        consultant_id: null,
        wayOfInformings: [],
        phones: [],
        emails: [],
        invalidPhones: [],
        websites: [],
        passive_why: null,
        passive_why_comment: null,
        warning_why_comment: null,
        position_unknown: 0,
        isMain: null,
        is_individual: false,
        individual_full_name: null
    }),
    props.formdata
);

const isLoading = ref(false);

const formContactsEmailsValidators = [{ func: validateEmail, message: 'Укажите корректный Email' }];

const customRequiredPosition = value => {
    if (form.position_unknown) return true;

    return required.$validator(value);
};

const customRequiredEmailsOrPhones = () => {
    return !emptyWithProperty('email')(form.emails) || form.phones.length > 0;
};

const customRequiredWarningWhyComment = () => {
    if (!form.warning) return true;
    return Boolean(required.$validator(form.warning_why_comment));
};

const { v$, validate } = useValidation(
    {
        form: {
            position_id: {
                customRequredPosition: helpers.withMessage(
                    'Выберите должность',
                    customRequiredPosition
                )
            },
            consultant_id: {
                required: helpers.withMessage('Выберите консультанта', required)
            },
            first_name: {
                required: helpers.withMessage('Введите имя', required)
            },
            company_id: {
                required: helpers.withMessage('Выберите компанию', required)
            },
            emails: {
                customRequiredEmails: helpers.withMessage(
                    'Добавьте телефон или email',
                    customRequiredEmailsOrPhones
                ),
                everyHasCorrectEmail: helpers.withMessage(
                    'Заполните все Email',
                    or(emptyWithProperty('email'), everyProperty(validateEmail, 'email'))
                ),
                requiredIsMain: helpers.withMessage(
                    'Выберите главный Email',
                    or(emptyWithProperty('email'), anyHasProperty('isMain', 1))
                )
            },
            warning_why_comment: {
                customRequiredWarningWhyComment: helpers.withMessage(
                    'Опишите причину',
                    customRequiredWarningWhyComment
                )
            }
        }
    },
    { form }
);

async function updateContact() {
    try {
        const payload = await api.contacts.update(props.formdata.id, form);

        emit('updated', props.formdata.id, payload);
        emit('close');
    } catch (error) {
        captureException(error);
    }
}

async function createContact() {
    try {
        const payload = await api.contacts.create(form);

        emit('created', payload);
        emit('close');
    } catch (error) {
        captureException(error);
    }
}

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    isLoading.value = true;

    normalizeForm();

    if (props.formdata) await updateContact();
    else await createContact();

    isLoading.value = false;
}

function onChangeWarning() {
    if (form.warning) form.good = 0;
}

const searchCompany = useSearchCompany(
    toRef(props.formdata ? () => props.formdata.company_id : () => props.company_id)
);

const onChangeIsMainEmail = key => {
    const currentMainIndex = form.emails.findIndex(
        (element, index) => element.isMain && index !== key
    );

    if (currentMainIndex !== -1) form.emails[currentMainIndex].isMain = null;
};

const normalizeForm = () => {
    form.phones = form.phones.filter(element => element.phone.length);
    form.emails = form.emails.filter(element => element.email.length);
    form.invalidPhones = form.invalidPhones.filter(element => element.phone.length);
};
</script>
