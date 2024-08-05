<template>
    <Modal
        @close="$emit('close')"
        :title="formdata ? 'Изменение контакта' : 'Создание контакта'"
        width="1300"
        show
    >
        <template #header>
            <CheckboxChip v-model="forms.isMain" :value="forms.isMain" text="Основной контакт" />
        </template>
        <Loader v-if="isLoading" />
        <Spinner v-if="isFetching" />
        <Form v-else @submit="onSubmit">
            <div class="row">
                <Input v-model="forms.middle_name" label="Фамилия" class="col-4" />
                <Input
                    v-model="forms.first_name"
                    label="Имя"
                    :v="v$.forms.first_name"
                    required
                    class="col-4"
                />
                <Input v-model="forms.last_name" label="Отчество" class="col-4" />
            </div>
            <div class="row mt-2">
                <PropogationDoubleInput
                    v-model="forms.phones"
                    :v="v$.forms.phones"
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
                    <template v-if="forms.phones.length">
                        <span class="form__subtitle">Осн.</span>
                        <CheckboxChip
                            v-for="phone in forms.phones"
                            :key="phone.phone"
                            v-model="phone.isMain"
                            @change="changeIsMainPhone(phone)"
                            :v="v$.forms.phones"
                            title="Основной номер"
                            class="mb-2"
                            icon="fa-solid fa-user-check"
                        />
                    </template>
                </div>
                <PropogationInput
                    v-model="forms.emails"
                    :v="v$.forms.emails"
                    :validators="formContactsEmailsValidators"
                    addText="Добавить Email"
                    property-name="email"
                    label="Email"
                    class="col-3"
                />
                <div class="col-1">
                    <template v-if="forms.emails.length">
                        <span class="form__subtitle">Осн.</span>
                        <CheckboxChip
                            v-for="email in forms.emails"
                            :key="email.email"
                            v-model="email.isMain"
                            @change="changeIsMainEmail(email)"
                            :v="v$.forms.emails"
                            title="Основной Email"
                            class="mb-2"
                            icon="fa-solid fa-user-check"
                        />
                    </template>
                </div>
                <PropogationDoubleInput
                    v-model="forms.invalidPhones"
                    maska="#################################"
                    addText="Добавить телефон"
                    first-name="phone"
                    second-name="exten"
                    label="Невалидный телефон"
                    class="col-4"
                />
            </div>
            <div class="row mt-2">
                <div class="col-6">
                    <span class="form__subtitle">Способ информирования</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="(element, index) in wayOfInformings"
                            :key="index"
                            v-model="forms.wayOfInformings"
                            property="way"
                            :value="index"
                            :text="element.name"
                            :icon="element.icon"
                        />
                    </div>
                </div>
                <div class="col-6">
                    <span class="form__subtitle">Должность</span>
                    <div class="form__row row">
                        <MultiSelect
                            v-model="forms.position"
                            @change="changePosition"
                            :v="v$.forms.position"
                            required
                            class="col-7"
                            :options="positionList"
                            :disabled="forms.position_unknown"
                        />
                        <CheckboxChip
                            v-model="forms.position_unknown"
                            @change="changePositionUnknown"
                            danger
                            text="Должность неизвестна"
                        />
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <MultiSelect
                    v-model="forms.consultant_id"
                    label="Консультант"
                    class="col-6"
                    :v="v$.forms.consultant_id"
                    required
                    :options="CONSULTANT_LIST"
                />
                <MultiSelect
                    v-model="forms.company_id"
                    class="col-6"
                    extra-classes="long-text"
                    label="Компания"
                    required
                    :v="v$.forms.company_id"
                    :filterResults="false"
                    :min-chars="1"
                    :resolve-on-load="true"
                    :delay="0"
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
                        <CheckboxChip v-model="forms.good" text="Хорошие взаимоотношения" />
                        <CheckboxChip v-model="forms.faceToFaceMeeting" text="Очная встреча" />
                        <CheckboxChip
                            v-model="forms.warning"
                            @change="changeWarning"
                            text="Внимание!"
                        />
                    </div>
                    <AnimationTransition>
                        <Textarea
                            v-if="forms.warning"
                            v-model="forms.warning_why_comment"
                            class="mt-2"
                            :v="v$.forms.warning_why_comment"
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
                            v-for="(status, value) in statusOptions"
                            :key="value"
                            v-model="forms.status"
                            :label="status"
                            :value="Number(value)"
                        />
                    </div>
                    <AnimationTransition>
                        <MultiSelect
                            v-if="!forms.status"
                            v-model="forms.passive_why"
                            :v="v$.forms.passive_why"
                            required
                            label="Причина пассива"
                            class="mt-2"
                            :options="passiveWhyOptions"
                        >
                            <Textarea
                                v-model="forms.passive_why_comment"
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

<script>
import { mapActions, mapGetters } from 'vuex';
import useValidate from '@vuelidate/core';
import { helpers, or, required } from '@vuelidate/validators';
import { ActivePassive, FeedbackIcons, PassiveWhyContact, PositionList } from '@/const/const.js';
import Input from '@/components/common/Forms/Input.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import PropogationDoubleInput from '@/components/common/Forms/PropogationDoubleInput.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import api from '@//api/api.js';
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
import { cloneObject } from '@/utils/index.js';
import Spinner from '@/components/common/Spinner.vue';

// TODO: Убрать Teleport и отрефачить все использоания этой формы

export default {
    name: 'FormCompanyContact',
    components: {
        Spinner,
        Submit,
        RadioChip,
        AnimationTransition,
        CheckboxChip,
        Form,
        Modal,
        Loader,
        Input,
        PropogationInput,
        PropogationDoubleInput,
        MultiSelect,
        Textarea
    },
    emits: ['close', 'updated', 'created'],
    props: {
        formdata: {
            type: Object,
            default: null
        },
        company_id: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            v$: useValidate(),
            isLoading: false,
            isFetching: false,
            selectedCompany: null,
            forms: {
                company_id: null,
                first_name: null,
                middle_name: null,
                last_name: null,
                position: null,
                faceToFaceMeeting: 0,
                warning: 0,
                good: 0,
                status: 1,
                wayOfInformings: [],
                consultant_id: null,
                phones: [],
                emails: [],
                invalidPhones: [],
                websites: [],
                passive_why: null,
                passive_why_comment: null,
                warning_why_comment: null,
                position_unknown: 0,
                isMain: null
            }
        };
    },
    computed: {
        ...mapGetters(['CONSULTANT_LIST']),
        wayOfInformings: () => FeedbackIcons,
        positionList: () => PositionList,
        statusOptions: () => ActivePassive,
        passiveWhyOptions: () => PassiveWhyContact,
        formContactsEmailsValidators() {
            return [{ func: validateEmail, message: 'Укажите корректный Email' }];
        },
        formContactsPhonesValidators() {
            return [{ func: validatePhone, message: 'Телефон должен состоять из 11 цифр' }];
        }
    },
    validations() {
        return {
            forms: {
                position: {
                    customRequredPosition: helpers.withMessage(
                        'выберите должность',
                        this.customRequiredPosition
                    )
                },
                consultant_id: {
                    required: helpers.withMessage('выберите консультанта', required)
                },
                first_name: {
                    required: helpers.withMessage('введите имя', required)
                },
                company_id: {
                    required: helpers.withMessage('Выберите компанию', required)
                },
                emails: {
                    customRequiredEmails: helpers.withMessage(
                        'Добавьте телефон или email',
                        this.customRequiredEmailsOrPhones
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
                        this.customRequiredEmailsOrPhones
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
                        this.customRequiredPassiveWhy
                    )
                },
                warning_why_comment: {
                    customRequiredWarningWhyComment: helpers.withMessage(
                        'Опишите причину',
                        this.customRequiredWarningWhyComment
                    )
                }
            }
        };
    },
    methods: {
        ...mapActions([
            'FETCH_CONSULTANT_LIST',
            'CREATE_CONTACT',
            'UPDATE_CONTACT',
            'SEARCH_COMPANIES'
        ]),
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.forms.$error) {
                this.normalizeForm();

                if (this.formdata) {
                    await this.updateContact();
                } else {
                    await this.createContact();
                }
            }
        },
        async updateContact() {
            this.isLoading = true;

            if (await this.UPDATE_CONTACT(this.forms)) {
                this.$emit('updated');
                this.$emit('close');
            }

            this.isLoading = false;
        },
        async createContact() {
            this.isLoading = true;

            if (await this.CREATE_CONTACT(this.forms)) {
                this.$emit('created');
                this.$emit('close');
            }

            this.isLoading = false;
        },
        changeWarning() {
            this.forms.warning ? (this.forms.good = 0) : '';
        },
        changePosition() {
            if (this.forms.position) {
                this.forms.position_unknown = 0;
            }
        },
        changePositionUnknown() {
            if (this.forms.position_unknown) {
                this.forms.position = null;
            }
        },
        customRequiredPosition(value) {
            if (this.forms.position_unknown) {
                return true;
            }
            return required.$validator(value);
        },
        customRequiredEmailsOrPhones() {
            return (
                !emptyWithProperty('email')(this.forms.emails) ||
                !emptyWithProperty('phone')(this.forms.phones)
            );
        },
        customRequiredPassiveWhy() {
            if (this.forms.status) return true;
            return Boolean(required.$validator(this.forms.passive_why));
        },
        customRequiredWarningWhyComment() {
            if (!this.forms.warning) return true;
            return Boolean(required.$validator(this.forms.warning_why_comment));
        },
        async searchCompany(query) {
            let result = null;
            let array = [];
            if (this.formdata || this.company_id) {
                if (!this.selectedCompany) {
                    this.selectedCompany = await api.companies.getCompany(
                        this.formdata ? this.formdata.company_id : this.company_id
                    );
                }

                array.push({
                    value: this.selectedCompany.id,
                    label: this.selectedCompany.full_name
                });
            }
            query = {
                all: query
            };
            result = await api.companies.searchCompanies(query);
            result.data.forEach(item => {
                array.push({ value: item.id, label: item.full_name });
            });
            return array;
        },
        changeIsMainEmail(changedEmail) {
            this.forms.emails = this.forms.emails.map(elem => {
                if (elem.email === changedEmail.email) {
                    elem.isMain = changedEmail.isMain ? 1 : null;
                    return elem;
                }
                elem.isMain = null;
                return elem;
            });
        },
        changeIsMainPhone(changedPhone) {
            this.forms.phones = this.forms.phones.map(elem => {
                if (elem.phone === changedPhone.phone) {
                    elem.isMain = changedPhone.isMain ? 1 : null;
                    return elem;
                }
                elem.isMain = null;
                return elem;
            });
        },
        normalizeForm() {
            this.forms.phones = this.forms.phones.filter(element => element.phone.length);
            this.forms.emails = this.forms.emails.filter(element => element.email.length);
            this.forms.invalidPhones = this.forms.invalidPhones.filter(({ phone }) => phone.length);
        },
        async fetchConsultants() {
            this.isFetching = true;
            await this.FETCH_CONSULTANT_LIST();
            this.isFetching = false;
        }
    },
    created() {
        this.forms.company_id = this.company_id;
        if (this.formdata) Object.assign(this.forms, cloneObject(this.formdata));
        this.fetchConsultants();
    }
};
</script>
