<template>
    <Modal
        @close="$emit('close')"
        width="1300"
        show
        :min-height="500"
        :title="formdata ? 'Редактирование контакта' : 'Создание нового контакта'"
    >
        <template #header>
            <span>|</span>
            <Switch
                v-model="form.isMain"
                :transform="Number"
                true-title="Основной контакт"
                false-title="Обычный контакт"
            />
        </template>
        <Loader v-if="isLoading" />
        <Form v-else @submit="onSubmit">
            <div class="row">
                <Input v-model="form.middle_name" label="Фамилия" class="col-4" />
                <Input
                    v-model="form.first_name"
                    label="Имя"
                    :v="v$.form.first_name"
                    required
                    class="col-4"
                />
                <Input v-model="form.last_name" label="Отчество" class="col-4" />
            </div>
            <div class="row mt-2">
                <PropogationDoubleInput
                    v-model="form.phones"
                    :v="v$.form.phones"
                    :validators="formContactsPhonesValidators"
                    maska="+7 (###) ###-##-##"
                    placeholder="+7"
                    addText="Добавить телефон"
                    first-name="phone"
                    second-name="exten"
                    label="Телефон"
                    class="col-3"
                />
                <div class="col-1">
                    <template v-if="form.phones.length">
                        <span class="form__subtitle">Осн.</span>
                        <CheckboxChip
                            v-for="(phone, key) in form.phones"
                            :key="key"
                            v-model="phone.isMain"
                            @change="onChangeIsMainPhone(key)"
                            :v="v$.form.phones"
                            title="Основной номер"
                            class="mb-2"
                            icon="fa-solid fa-user-check"
                        />
                    </template>
                </div>
                <PropogationInput
                    v-model="form.emails"
                    :v="v$.form.emails"
                    :validators="formContactsEmailsValidators"
                    addText="Добавить Email"
                    property-name="email"
                    label="Email"
                    class="col-3"
                />
                <div class="col-1">
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
                </div>
                <PropogationDoubleInput
                    v-model="form.invalidPhones"
                    maska="#################################"
                    addText="Добавить телефон"
                    first-name="phone"
                    second-name="exten"
                    label="Невалидный телефон"
                    class="col-4"
                />
            </div>
            <div class="row mt-2">
                <div class="col-12">
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
                        />
                    </div>
                </div>
                <div class="col-12">
                    <span class="form__subtitle">Должность</span>
                    <div class="form__row row">
                        <MultiSelect
                            v-model="form.position"
                            @change="onChangePosition"
                            :v="v$.form.position"
                            required
                            class="col-6"
                            :options="PositionList"
                            :disabled="form.position_unknown"
                        />
                        <Checkbox
                            v-model="form.position_unknown"
                            @change="onChangePositionUnknown"
                            numeric
                            class="col-4"
                        >
                            Должность неизвестна
                        </Checkbox>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <ConsultantPicker
                    v-model="form.consultant_id"
                    class="col-6"
                    :v="v$.form.consultant_id"
                    required
                    :options="getConsultantsOptions"
                />
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
            </div>
            <div class="row mt-2">
                <div class="col-6">
                    <span class="form__subtitle">Прочее</span>
                    <div class="form__row mt-1">
                        <CheckboxChip v-model="form.good" text="Хорошие взаимоотношения" />
                        <CheckboxChip v-model="form.faceToFaceMeeting" text="Очная встреча" />
                        <CheckboxChip
                            v-model="form.warning"
                            @change="onChangeWarning"
                            text="Внимание!"
                        />
                    </div>
                    <AnimationTransition>
                        <Textarea
                            v-if="form.warning"
                            v-model="form.warning_why_comment"
                            class="mt-2"
                            :v="v$.form.warning_why_comment"
                            required
                            label="Причина"
                            placeholder="Опишите причину"
                        />
                    </AnimationTransition>
                </div>
                <div class="col-6">
                    <span class="form__subtitle">Статус</span>
                    <div class="form__row mt-1">
                        <RadioChip
                            v-for="(status, value) in ActivePassive"
                            :key="value"
                            v-model="form.status"
                            :label="status"
                            :value="Number(value)"
                        />
                    </div>
                    <AnimationTransition>
                        <MultiSelect
                            v-if="!form.status"
                            v-model="form.passive_why"
                            :v="v$.form.passive_why"
                            required
                            label="Причина пассива"
                            class="mt-2"
                            :options="PassiveWhyContact"
                        >
                            <Textarea
                                v-model="form.passive_why_comment"
                                placeholder="Опишите причину"
                            />
                        </MultiSelect>
                    </AnimationTransition>
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

<script setup>
import useVuelidate from '@vuelidate/core';
import { helpers, or, required } from '@vuelidate/validators';
import { ActivePassive, FeedbackIcons, PassiveWhyContact, PositionList } from '@/const/const.js';
import Input from '@/components/common/Forms/Input.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import PropogationDoubleInput from '@/components/common/Forms/PropogationDoubleInput.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import Form from '@/components/common/Forms/Form.vue';
import {
    anyHasProperty,
    emptyWithProperty,
    everyProperty,
    validateEmail,
    validatePhone
} from '@//validators';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import { reactive, ref, toRef } from 'vue';
import { useFormData } from '@/utils/useFormData.js';
import Switch from '@/components/common/Forms/Switch.vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import api from '@/api/api.js';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';

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

const { getConsultantsOptions } = useConsultantsOptions();
const { form } = useFormData(
    reactive({
        company_id: null,
        first_name: null,
        middle_name: null,
        last_name: null,
        position: null,
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
const formContactsPhonesValidators = [
    { func: validatePhone, message: 'Телефон должен состоять из 11 цифр' }
];

const customRequiredPosition = value => {
    if (form.position_unknown) return true;

    return required.$validator(value);
};

const customRequiredEmailsOrPhones = () => {
    return !emptyWithProperty('email')(form.emails) || !emptyWithProperty('phone')(form.phones);
};

const customRequiredPassiveWhy = () => {
    if (form.status) return true;
    return Boolean(required.$validator(form.passive_why));
};

const customRequiredWarningWhyComment = () => {
    if (!form.warning) return true;
    return Boolean(required.$validator(form.warning_why_comment));
};

const v$ = useVuelidate(
    {
        form: {
            position: {
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
            phones: {
                customRequiredPhones: helpers.withMessage(
                    'Добавьте телефон или email',
                    customRequiredEmailsOrPhones
                ),
                everyHasCorrectPhone: helpers.withMessage(
                    'Заполните все телефоны',
                    or(emptyWithProperty('phone'), everyProperty(validatePhone, 'phone'))
                ),
                requiredIsMain: helpers.withMessage(
                    'Выберите главный номер',
                    or(emptyWithProperty('phone'), anyHasProperty('isMain', 1))
                )
            },
            passive_why: {
                customRequiredPassiveWhy: helpers.withMessage(
                    'Выберите причину',
                    customRequiredPassiveWhy
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

const updateContact = async () => {
    const updated = await api.contacts.update(props.formdata.id, form);
    if (updated) {
        emit('updated', props.formdata.id, updated);
        emit('close');
    }
};

const createContact = async () => {
    const createdContact = await api.contacts.create(form);
    if (createdContact) {
        emit('created', createdContact);
        emit('close');
    }
};

const onSubmit = async () => {
    v$.value.$validate();
    if (v$.value.form.$error) return;

    isLoading.value = true;

    normalizeForm();
    if (props.formdata) await updateContact();
    else await createContact();

    isLoading.value = false;
};

const onChangeWarning = () => {
    if (form.warning) form.good = 0;
};

const onChangePosition = () => {
    if (form.position) form.position_unknown = 0;
};

const onChangePositionUnknown = () => {
    if (form.position_unknown) form.position = null;
};

const searchCompany = useSearchCompany(
    toRef(props.formdata ? () => props.formdata.company_id : () => props.company_id)
);

const onChangeIsMainEmail = key => {
    const currentMainIndex = form.emails.findIndex(
        (element, index) => element.isMain && index !== key
    );

    if (currentMainIndex !== -1) form.emails[currentMainIndex].isMain = null;
};

const onChangeIsMainPhone = key => {
    const currentMainIndex = form.phones.findIndex(
        (element, index) => element.isMain && index !== key
    );

    if (currentMainIndex !== -1) form.phones[currentMainIndex].isMain = null;
};

const normalizeForm = () => {
    form.phones = form.phones.filter(element => element.phone.length);
    form.emails = form.emails.filter(element => element.email.length);
    form.invalidPhones = form.invalidPhones.filter(element => element.phone.length);
};

if (props.company_id) form.company_id = props.company_id;
</script>
