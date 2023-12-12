<template>
    <div class="fuck">
        <Modal
            :title="formsdata ? 'Изменение контакта' : 'Создание контакта'"
            @close="clickCloseModal"
            class="normal"
        >
            <Form @submit="onSubmit" class="p-2">
                <Loader class="center" v-if="loader" />
                <FormGroup class="mb-1">
                    <Input
                        v-model="forms.middle_name"
                        label="Фамилия"
                        class="col-4 pr-1"
                    />
                    <Input
                        v-model="forms.first_name"
                        label="Имя"
                        :v="v$.forms.first_name"
                        required
                        class="col-4 pr-1"
                    />
                    <Input v-model="forms.last_name" label="Отчество" class="col-4" />
                </FormGroup>
                <FormGroup class="mb-1">
                    <PropogationDoubleInput
                        v-model="forms.phones"
                        :v="v$.forms.phones"
                        maska="+7 (###) ###-##-##"
                        placeholder="+7 "
                        name="phone"
                        name2="exten"
                        label="Телефон"
                        class="col-6 pr-1"
                    />
                    <div class="col-1">
                        <FormGroup class="label-padding">
                            <p>Осн.</p>
                            <Checkbox
                                @change="changeIsMainPhone(phone)"
                                v-for="phone in forms.phones"
                                :key="phone.phone"
                                v-model="phone.isMain"
                                class="col-12 large"
                            />
                        </FormGroup>
                    </div>
                    <PropogationInput
                        v-model="forms.emails"
                        :v="v$.forms.emails"
                        name="email"
                        label="Email"
                        class="col-4 pr-1"
                    />
                    <div class="col-1">
                        <FormGroup class="label-padding">
                            <p>Осн.</p>
                            <Checkbox
                                @change="changeIsMainEmail(email)"
                                v-for="email in forms.emails"
                                :key="email.email"
                                v-model="email.isMain"
                                class="col-12 large"
                            />
                        </FormGroup>
                    </div>
                </FormGroup>
                <FormGroup class="mb-1">
                    <PropogationDoubleInput
                        v-model="forms.invalidPhones"
                        maska="#################################"
                        name="phone"
                        name2="exten"
                        label="Невалидный телефон"
                        class="col-6 pr-1"
                    />
                </FormGroup>
                <FormGroup class="mb-1">
                    <Checkbox
                        v-model="forms.wayOfInformsings"
                        label="Способ информирования"
                        class="col-6 pr-1"
                        name="way"
                        :options="wayOfInformsings"
                    />
                    <MultiSelect
                        v-model="forms.position"
                        :v="v$.forms.position"
                        @change="changePosition"
                        required
                        label="Должность"
                        class="col-6 pr-1"
                        :options="positionList"
                    >
                        <Checkbox
                            v-model="forms.position_unknown"
                            @change="changePositionUnknown"
                            label="Должность неизвестна"
                            mode="inline"
                            title="Должность неизвестна"
                            class="col-12 p-0 mt-1 large text-center"
                        />
                    </MultiSelect>
                </FormGroup>
                <FormGroup class="mb-1">
                    <MultiSelect
                        v-model="forms.consultant_id"
                        label="Консультант"
                        class="pr-1"
                        :class="{ 'col-5': forms.warning, 'col-6': !forms.warning }"
                        :v="v$.forms.consultant_id"
                        required
                        :options="CONSULTANT_LIST"
                    />

                    <Checkbox
                        v-model="forms.good"
                        label="Хор. взаим."
                        title="Хорошие взаимоотношения"
                        class="col-2 large text-center"
                    />
                    <Checkbox
                        v-model="forms.faceToFaceMeeting"
                        label="Оч. встреча"
                        title="Очная встреча"
                        class="col-2 large text-center"
                    />

                    <Checkbox
                        v-model="forms.warning"
                        label="Внимание!"
                        @change="changeWarning"
                        class="large text-center"
                        :class="{ 'col-3': forms.warning, 'col-2': !forms.warning }"
                    >
            <Textarea
                v-if="forms.warning"
                v-model="forms.warning_why_comment"
                :v="v$.forms.warning_why_comment"
                required
                label="Причина"
                class="col-12 p-0 pt-1"
                placeholder="Опишите причину"
            />
                    </Checkbox>
                </FormGroup>
                <FormGroup class="mb-1">
                    <MultiSelect
                        v-model="forms.company_id"
                        extraClasses="long-text"
                        label="Компания"
                        required
                        class="col-6 pr-1"
                        :v="v$.forms.company_id"
                        :filterResults="false"
                        :minChars="1"
                        :resolveOnLoad="true"
                        :delay="0"
                        :searchable="true"
                        :options="
              async (query) => {
                return await searchCompany(query);
              }
            "
                    />
                    <Radio
                        v-model="forms.status"
                        required
                        label="Статус"
                        class="col-6 text-center"
                        :options="statusOptions"
                    >
                        <MultiSelect
                            v-if="!forms.status"
                            v-model="forms.passive_why"
                            :v="v$.forms.passive_why"
                            required
                            label="Причина пассива"
                            class="col-12 p-0"
                            :options="passiveWhyOptions"
                        >
              <Textarea
                  v-model="forms.passive_why_comment"
                  class="col-12 p-0 pt-1"
                  placeholder="Опишите причину"
              />
                        </MultiSelect>
                    </Radio>
                </FormGroup>
                <FormGroup class="mb-1">
                    <Checkbox
                        v-model="forms.isMain"
                        label="Основной контакт"
                        title="Очная встреча"
                        class="col-12 large text-center"
                    />
                </FormGroup>
                <FormGroup class="mt-4">
                    <Submit class="col-4 mx-auto">
                        {{ formsdata ? "Сохранить" : "Создать" }}
                    </Submit>
                </FormGroup>
            </Form>
        </Modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import {
    FeedbackList,
    PositionList,
    ActivePassive,
    PassiveWhyContact,
} from "@/const/const.js";
import Input from "@/components/forms/Input.vue";
import Submit from "@/components/forms/Submit.vue";
import PropogationInput from "@/components/forms/PropogationInput.vue";
import PropogationDoubleInput from "@/components/forms/PropogationDoubleInput.vue";
import Checkbox from "@/components/forms/Checkbox.vue";
import Textarea from "@/components/forms/Textarea.vue";
import Radio from "@/components/forms/Radio.vue";
import MultiSelect from "@/components/forms/MultiSelect.vue";
import { validatePropogationInput } from "@/utils/index.js";
import api from "@/api/api.js";
import Loader from "@/components/common/Loader.vue";
import Modal from "@/components/common/Modal.vue";
import FormGroup from "@/components/forms/FormGroup.vue";
import Form from "@/components/forms/Form.vue";

export default {
    name: "FormCompanyContact",
    components: {
        Form,
        FormGroup,
        Modal,
        Loader,
        Input,
        Submit,
        PropogationInput,
        PropogationDoubleInput,
        Checkbox,
        Radio,
        MultiSelect,
        Textarea,
    },
    data() {
        return {
            v$: useValidate(),
            wayOfInformsings: FeedbackList.get("contact"),
            positionList: PositionList.get("param"),
            statusOptions: ActivePassive.get("param"),
            passiveWhyOptions: PassiveWhyContact.get("param"),
            loader: false,
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
                wayOfInformsings: [],
                consultant_id: null,
                phones: [],
                emails: [],
                invalidPhones: [],
                websites: [],
                passive_why: null,
                passive_why_comment: null,
                warning_why_comment: null,
                position_unknown: 0,
                isMain: null,
            },
        };
    },
    props: {
        formsdata: {
            type: Object,
            default: null,
        },
        company_id: {
            type: Number,
            default: null,
        },
        phones: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        ...mapGetters(["CONSULTANT_LIST"]),
    },
    validations() {
        return {
            forms: {
                position: {
                    customRequredPosition: helpers.withMessage(
                        "выберите должность",
                        this.customRequiredPosition
                    ),
                },
                consultant_id: {
                    required: helpers.withMessage("выберите консультанта", required),
                },
                first_name: {
                    required: helpers.withMessage("введите имя", required),
                },
                company_id: {
                    required: helpers.withMessage("Выберите компанию", required),
                },
                emails: {
                    customRequiredEmails: helpers.withMessage(
                        "дабавьте либо телефон либо email",
                        this.customRequiredEmails
                    ),
                    propogation: helpers.withMessage(
                        "Пустое поле не допустимо",
                        this.validateEmailsPropogation
                    ),
                    email: helpers.withMessage(
                        "заполните email правильно",
                        this.customEmailValidation
                    ),
                    requiredIsMain: helpers.withMessage("Выберите главный email", () => {
                        if (
                            this.forms.emails.length &&
                            !this.forms.emails.find((elem) => elem.isMain === 1)
                        ) {
                            return false;
                        }
                        return true;
                    }),
                },
                phones: {
                    minItemLength: helpers.withMessage(
                        "телефон должен состоять из 11 цифр",
                        () => {
                            let flag = true;
                            this.forms.phones.forEach((elem) => {
                                if (!flag) {
                                    return;
                                }
                                if (!elem.phone) {
                                    flag = false;
                                }
                                if (elem.phone.length !== 18) {
                                    flag = false;
                                }
                            });
                            return flag;
                        }
                    ),
                    customRequiredPhones: helpers.withMessage(
                        "дабавьте либо телефон либо email",
                        this.customRequiredPhones
                    ),
                    phones: {
                        propogation: helpers.withMessage(
                            "Пустое поле не допустимо",
                            this.validatePhonesPropogation
                        ),
                    },
                    requiredIsMain: helpers.withMessage("Выберите главный номер", () => {
                        if (
                            this.forms.phones.length &&
                            !this.forms.phones.find((elem) => elem.isMain === 1)
                        ) {
                            return false;
                        }
                        return true;
                    }),
                },
                passive_why: {
                    customRequiredPassiveWhy: helpers.withMessage(
                        "Выберите причину",
                        this.customRequiredPassiveWhy
                    ),
                },
                warning_why_comment: {
                    customRequiredWarningWhyComment: helpers.withMessage(
                        "Опишите причину",
                        this.customRequiredWarningWhyComment
                    ),
                },
            },
        };
    },
    methods: {
        ...mapActions([
            "FETCH_CONSULTANT_LIST",
            "CREATE_CONTACT",
            "UPDATE_CONTACT",
            "SEARCH_COMPANIES",
        ]),
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.forms.$error) {
                this.loader = true;
                if (this.formsdata) {
                    this.updateContact();
                } else {
                    this.createContact();
                }
            }
        },

        async updateContact() {
            if (await this.UPDATE_CONTACT(this.forms)) {
                this.$emit("updated");
                this.clickCloseModal();
            }
            this.loader = false;
        },
        async createContact() {
            if (await this.CREATE_CONTACT(this.forms)) {
                this.$emit("created");

                this.clickCloseModal();
            }
            this.loader = false;
        },
        changeWarning() {
            this.forms.warning ? (this.forms.good = 0) : "";
        },
        changePosition() {
            if (this.forms.position !== null) {
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
        validateEmailsPropogation() {
            return validatePropogationInput(this.forms.emails, "email");
        },
        validatePhonesPropogation() {
            return validatePropogationInput(this.forms.phones, "phone");
        },
        customEmailValidation() {
            let flag = true;
            this.forms.emails.forEach((item) => {
                if (!email.$validator(item.email)) {
                    flag = false;
                }
            });
            return flag;
        },
        customRequiredEmails() {
            if (this.forms.emails.length) {
                return true;
            }
            if (!this.forms.phones.length) {
                return false;
            }
            return true;
        },
        customRequiredPhones() {
            if (this.forms.phones.length) {
                return true;
            }
            if (!this.forms.emails.length) {
                return false;
            }
            return true;
        },
        customRequiredPassiveWhy() {
            if (this.forms.status) {
                return true;
            }
            if (!required.$validator(this.forms.passive_why)) {
                return false;
            }
            return true;
        },
        customRequiredWarningWhyComment() {
            if (!this.forms.warning) {
                return true;
            }
            if (!required.$validator(this.forms.warning_why_comment)) {
                return false;
            }
            return true;
        },
        async searchCompany(query) {
            let result = null;
            let array = [];
            if (this.formsdata || this.company_id) {
                if (!this.selectedCompany) {
                    this.selectedCompany = await api.companies.getCompany(
                        this.formsdata ? this.formsdata.company_id : this.company_id
                    );
                }

                array.push({
                    value: this.selectedCompany.id,
                    label: this.selectedCompany.full_name,
                });
            }
            query = {
                all: query,
            };
            result = await api.companies.searchCompanies(query);
            result.data.forEach((item) => {
                array.push({ value: item.id, label: item.full_name });
            });
            return array;
        },

        clickCloseModal() {
            this.$emit("closeCompanyforms");
        },
        changeIsMainEmail(changedEmail) {
            this.forms.emails = this.forms.emails.map((elem) => {
                if (elem.email == changedEmail.email) {
                    elem.isMain = changedEmail.isMain ? 1 : null;
                    return elem;
                }
                elem.isMain = null;
                return elem;
            });
        },
        changeIsMainPhone(changedPhone) {
            this.forms.phones = this.forms.phones.map((elem) => {
                if (elem.phone == changedPhone.phone) {
                    elem.isMain = changedPhone.isMain ? 1 : null;
                    return elem;
                }
                elem.isMain = null;
                return elem;
            });
        },
    },
    async mounted() {
        this.loader = true;
        await this.FETCH_CONSULTANT_LIST();
        this.forms.company_id = this.company_id;
        this.forms.phones = this.phones;
        if (this.formsdata) {
            this.forms = { ...this.forms, ...this.formsdata };
        }
        this.loader = false;
    },
    watch: {
        forms: {
            handler() {
            },
            deep: true,
        },
    },
    emits: ["closeCompanyforms", "updated", "created"],
};
</script>

<style>
</style>