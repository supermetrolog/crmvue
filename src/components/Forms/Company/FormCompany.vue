<template>
    <Modal
        @close="clickCloseModal"
        :title="formdata ? 'Редактирование компании' : 'Создание компании'"
        class="modal-form-company"
        width="1000"
        has-tabs
    >
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false }">
                <Loader v-if="loader" class="center" />
                <Tab name="Основное">
                    <div class="row mb-2">
                        <CheckboxChip
                            v-model="form.noName"
                            :value="form.noName"
                            text="Без названия"
                            class="col-12 mb-2"
                        />
                        <Input
                            v-model.trim="form.nameRu"
                            :disabled="form.noName"
                            :v="v$.form.nameRu"
                            :maska="{
                                mask: 'Z*',
                                tokens: { Z: { pattern: /[а-яА-Я0-9 (--)]/ } }
                            }"
                            :required="!form.nameEng"
                            label="Название Ru"
                            class="col-6"
                        />
                        <Input
                            v-model.trim="form.nameEng"
                            :disabled="form.noName"
                            :v="v$.form.nameEng"
                            :maska="{
                                mask: 'Z*',
                                tokens: { Z: { pattern: /[a-zA-Z0-9 (--)]/ } }
                            }"
                            :required="!form.nameRu"
                            label="Название Eng"
                            class="col-6"
                        />
                    </div>
                    <div class="row mb-2">
                        <Input
                            v-model.trim="form.nameBrand"
                            :v="v$.form.nameBrand"
                            :maska="{
                                mask: 'Z*',
                                tokens: { Z: { pattern: /[а-яА-Яa-zA-Z0-9 (--)]/ } }
                            }"
                            label="Название Brand"
                            class="col-5"
                        />
                        <MultiSelect
                            v-model="form.companyGroup_id"
                            label="Входит в ГК"
                            class="col-4"
                            :searchable="true"
                            :options="COMPANY_GROUP_LIST"
                        />
                        <MultiSelect
                            v-model="form.formOfOrganization"
                            :disabled="form.noName"
                            label="ФО"
                            title="Форма организации"
                            class="col-3"
                            :options="formOfOrganizationOptions"
                        />
                    </div>
                    <div class="row mb-2">
                        <MultiSelect
                            v-model="form.officeAdress"
                            :title="form.officeAdress"
                            extra-classes="long-text"
                            label="Адрес офиса"
                            class="col-12"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="Boolean(formdata)"
                            :delay="0"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await getAddress(query);
                                }
                            "
                        />
                    </div>
                    <div class="row">
                        <MultiSelect
                            v-model="form.consultant_id"
                            :v="v$.form.consultant_id"
                            required
                            label="Консультант"
                            class="col-6"
                            :options="CONSULTANT_LIST"
                        />
                        <PropogationInput
                            v-model="form.contacts.websites"
                            :v="v$.form.contacts.websites"
                            :validators="formContactsWebsitesValidators"
                            placeholder="https://google.com"
                            label="Вебсайт"
                            property-name="website"
                            class="col-6"
                        />
                    </div>
                    <div class="row mt-2">
                        <PropogationDoubleInput
                            v-model="form.contacts.phones"
                            :v="v$.form.contacts.phones"
                            :maska="[
                                '+7 (###) ###-##-###',
                                '+### (###) ###-##-##',
                                '+#### (###) ###-##-##'
                            ]"
                            placeholder="+7 "
                            name="phone"
                            first-name="phone"
                            second-name="exten"
                            label="Телефон"
                            class="col-6"
                        />
                        <PropogationInput
                            v-model="form.contacts.emails"
                            :v="v$.form.contacts.emails"
                            :validators="formContactsEmailsValidators"
                            placeholder="index@mail.ru"
                            property-name="email"
                            label="Email"
                            class="col-6"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-12">
                            <span class="form__subtitle">Категория</span>
                            <div class="form__row mt-1">
                                <CheckboxChip
                                    v-for="(category, index) in categoryOptions"
                                    :key="index"
                                    v-model="form.categories"
                                    :v="v$.form.categories"
                                    :value="index"
                                    :text="category"
                                    property="category"
                                />
                            </div>
                        </div>
                        <div class="col-6 mt-2">
                            <span class="form__subtitle">Прочее</span>
                            <CheckboxChip
                                v-model="form.processed"
                                :value="form.processed"
                                text="Обработано"
                                class="mt-1"
                            />
                        </div>
                        <div class="col-6 mt-2">
                            <span class="form__subtitle">Статус</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.status" label="Пассив" :value="0" />
                                <RadioChip v-model="form.status" label="Актив" :value="1" />
                            </div>
                        </div>
                        <div class="col-6 mt-2">
                            <div class="row">
                                <RadioStars
                                    v-model="form.rating"
                                    label="Рейтинг"
                                    class="col-12 mt-2"
                                    :options="ratingOptions"
                                />
                                <div class="col-12 mt-1">
                                    <span>
                                        <i class="fas fa-star"></i>
                                        - не особо важно,
                                    </span>
                                    <span>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        - важно,
                                    </span>
                                    <span>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        - очень важно
                                    </span>
                                </div>
                            </div>
                        </div>
                        <AnimationTransition>
                            <div v-if="!form.status" class="col-4 mt-2">
                                <MultiSelect
                                    v-model="form.passive_why"
                                    :v="v$.form.passive_why"
                                    required
                                    label="Причина пассива"
                                    :options="passiveWhyOptions"
                                />
                                <Textarea
                                    v-model="form.passive_why_comment"
                                    class="col-12 p-0 pt-1"
                                />
                            </div>
                        </AnimationTransition>
                    </div>
                    <div class="row mt-2">
                        <Textarea v-model="form.description" label="Описание" class="col-12" />
                    </div>
                </Tab>
                <Tab name="Деятельность">
                    <div class="row">
                        <MultiSelect
                            v-model="form.activityGroup"
                            :v="v$.form.activityGroup"
                            required
                            title="Группа деятельности"
                            label="Группа дея-ти"
                            class="col-6"
                            :options="activityGroupOptions"
                        />
                        <MultiSelect
                            v-model="form.activityProfile"
                            :v="v$.form.activityProfile"
                            required
                            title="Профиль деятельности"
                            label="Профиль дея-ти"
                            class="col-6"
                            :options="activityProfileOptions"
                        />
                        <MultiSelect
                            v-model="form.productRanges"
                            mode="tags"
                            :close-on-select="false"
                            :loading="false"
                            :searchable="true"
                            :create-tag="true"
                            :resolve-on-load="true"
                            label="Номенклатура товара"
                            class="col-12 mt-2"
                            :options="COMPANY_PRODUCT_RANGE_LIST"
                            name="product"
                        />
                    </div>
                </Tab>
                <Tab name="Реквизиты">
                    <div class="row">
                        <MultiSelect
                            v-model="form.legalAddress"
                            :title="form.legalAddress"
                            label="Юр. адрес"
                            class="col-12"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="Boolean(formdata)"
                            :delay="0"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await getAddress(query);
                                }
                            "
                        />
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.ogrn"
                            :v="v$.form.ogrn"
                            label="ОГРН"
                            class="col-4"
                            maska="#############"
                        />
                        <Input
                            v-model="form.inn"
                            :v="v$.form.inn"
                            label="ИНН"
                            class="col-4"
                            maska="############"
                        />
                        <Input
                            v-model="form.kpp"
                            :v="v$.form.kpp"
                            label="КПП"
                            class="col-4"
                            maska="#########"
                        />
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.checkingAccount"
                            :v="v$.form.checkingAccount"
                            label="Расчетный счет"
                            class="col-4"
                            maska="####################"
                        />
                        <Input
                            v-model="form.correspondentAccount"
                            :v="v$.form.correspondentAccount"
                            label="Корреспондентский счет"
                            class="col-4"
                            maska="####################"
                        />
                        <MultiSelect
                            v-model="form.inTheBank"
                            label="В банке"
                            class="col-4"
                            :searchable="true"
                            :options="COMPANY_IN_THE_BANK_LIST"
                        />
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.bik"
                            :v="v$.form.bik"
                            label="БИК"
                            class="col-4"
                            maska="#########"
                        />
                        <Input
                            v-model="form.okpo"
                            :v="v$.form.okpo"
                            label="ОКПО"
                            class="col-4"
                            maska="##########"
                        />
                        <Input
                            v-model="form.okved"
                            :v="v$.form.okved"
                            label="ОКВЭД"
                            class="col-4"
                            maska="##############################"
                        />
                    </div>
                    <div class="row mt-2">
                        <Input v-model="form.signatoryName" label="Имя подписанта" class="col-4" />
                        <Input
                            v-model="form.signatoryMiddleName"
                            label="Фамилия подписанта"
                            class="col-4"
                        />
                        <Input
                            v-model="form.signatoryLastName"
                            label="Отчество подписанта"
                            class="col-4"
                        />
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.documentNumber"
                            label="№ документа"
                            maska="#####################"
                            class="col-6 pr-1"
                        />
                        <Input
                            v-model="form.basis"
                            label="Действует на основе"
                            class="col-6 pl-1"
                        />
                    </div>
                </Tab>
                <Tab name="Документы">
                    <div class="row">
                        <FileInput
                            v-model:native="form.fileList"
                            v-model:data="form.files"
                            label="Документы"
                            class="col-12"
                            sortable
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
                <div class="row mt-4 align-self-end">
                    <Submit success class="col-3 mx-auto">
                        {{ formdata ? 'Сохранить' : 'Создать' }}
                    </Submit>
                </div>
            </Tabs>
        </Form>
    </Modal>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import PropogationDoubleInput from '@/components/common/Forms/PropogationDoubleInput.vue';
import RadioStars from '@/components/common/Forms/RadioStars.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import useValidate from '@vuelidate/core';
import { helpers, maxLength, minLength, required } from '@vuelidate/validators';
import { mapActions, mapGetters } from 'vuex';
import {
    ActivePassive,
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    CompanyFormOrganization,
    PassiveWhy,
    RatingList
} from '@/const/const.js';
import Utils, { cloneObject } from '@/utils';
import { yandexmap } from '@/utils/yandexMap.js';
import api from '@//api/api.js';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import {
    everyProperty,
    onlyEnglish,
    onlyRussian,
    validateEmail,
    validatePhone,
    validateUrl
} from '@//validators';
import Submit from '@/components/common/Forms/Submit.vue';

export default {
    name: 'FormCompany',
    components: {
        Submit,
        AnimationTransition,
        RadioChip,
        CheckboxChip,
        Loader,
        Modal,
        Form,
        Input,
        PropogationInput,
        PropogationDoubleInput,
        Textarea,
        RadioStars,
        MultiSelect,
        FileInput
    },
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
                activityGroup: null,
                activityProfile: null,
                basis: null,
                bik: null,
                categories: [],
                checkingAccount: null,
                companyGroup_id: null,
                consultant_id: null,
                contacts: { phones: [], emails: [], websites: [] },
                correspondentAccount: null,
                description: null,
                documentNumber: null,
                formOfOrganization: null,
                inTheBank: null,
                inn: null,
                kpp: null,
                legalAddress: null,
                nameBrand: null,
                nameEng: null,
                nameRu: null,
                noName: 0,
                officeAdress: null,
                ogrn: null,
                okpo: null,
                okved: null,
                processed: 0,
                productRanges: [],
                signatoryLastName: null,
                signatoryMiddleName: null,
                signatoryName: null,
                status: 1,
                rating: 5,
                passive_why: null,
                passive_why_comment: null,
                files: [],
                fileList: []
            }
        };
    },
    computed: {
        ...mapGetters([
            'COMPANY',
            'CONSULTANT_LIST',
            'COMPANY_GROUP_LIST',
            'COMPANY_PRODUCT_RANGE_LIST',
            'COMPANY_IN_THE_BANK_LIST'
        ]),
        categoryOptions: () => CompanyCategories,
        formOfOrganizationOptions: () => CompanyFormOrganization,
        statusOptions: () => ActivePassive,
        activityGroupOptions: () => ActivityGroupList,
        activityProfileOptions: () => ActivityProfileList,
        passiveWhyOptions: () => PassiveWhy,
        ratingOptions: () => RatingList,
        formContactsWebsitesValidators() {
            return [{ func: validateUrl, message: 'Укажите корректную ссылку на сайт' }];
        },
        formContactsEmailsValidators() {
            return [{ func: validateEmail, message: 'Укажите корректный Email' }];
        }
    },
    validations() {
        return {
            form: {
                contacts: {
                    emails: {
                        everyHasCorrectEmail: everyProperty(validateEmail, 'email')
                    },
                    websites: {
                        everyHasCorrectUrl: everyProperty(validateUrl, 'website')
                    },
                    phones: {
                        everyHasCorrectPhone: everyProperty(validatePhone, 'phone')
                    }
                },
                nameEng: {
                    customRequiredName: helpers.withMessage(
                        'заполните поле',
                        this.customRequiredNameEng
                    ),
                    minLength: helpers.withMessage(
                        'название не может быть меньше 3 символов',
                        minLength(3)
                    ),
                    maxLength: helpers.withMessage(
                        'название не может быть больше 60 символов',
                        maxLength(60)
                    ),
                    onlyEnglish: helpers.withMessage(
                        'название должно быть на английском языке',
                        onlyEnglish
                    )
                },
                nameRu: {
                    customRequiredName: helpers.withMessage(
                        'заполните поле',
                        this.customRequiredNameRu
                    ),
                    minLength: helpers.withMessage(
                        'название не может быть меньше 3 символов',
                        minLength(3)
                    ),
                    maxLength: helpers.withMessage(
                        'название не может быть больше 60 символов',
                        maxLength(60)
                    ),
                    onlyRussian: helpers.withMessage(
                        'название должно быть на русском языке',
                        onlyRussian
                    )
                },
                nameBrand: {
                    minLength: helpers.withMessage(
                        'название не может быть меньше 3 символов',
                        minLength(3)
                    )
                },
                categories: {
                    required: helpers.withMessage('Выберите категорию', required)
                },
                status: {
                    required: helpers.withMessage('Выберите статус', required)
                },
                consultant_id: {
                    required: helpers.withMessage('Выберите консультанта', required)
                },
                ogrn: {
                    minLength: helpers.withMessage(
                        'огрн не может быть меньше 13 символов',
                        minLength(13)
                    )
                },
                inn: {
                    minLength: helpers.withMessage(
                        'инн не может быть меньше 10 символов',
                        minLength(10)
                    )
                },
                kpp: {
                    minLength: helpers.withMessage(
                        'кпп не может быть меньше 9 символов',
                        minLength(9)
                    )
                },
                checkingAccount: {
                    minLength: helpers.withMessage(
                        'расчетный счет не может быть меньше 20 символов',
                        minLength(20)
                    )
                },
                correspondentAccount: {
                    minLength: helpers.withMessage(
                        'корреспондентский счет не может быть меньше 20 символов',
                        minLength(20)
                    )
                },
                bik: {
                    minLength: helpers.withMessage(
                        'бик не может быть меньше 9 символов',
                        minLength(9)
                    )
                },
                okved: {
                    minLength: helpers.withMessage(
                        'оквэд не может быть меньше 4 символов',
                        minLength(4)
                    )
                },
                okpo: {
                    minLength: helpers.withMessage(
                        'окпо не может быть меньше 8 символов',
                        minLength(8)
                    )
                },
                activityGroup: {
                    required: helpers.withMessage('Выберите группу деятельности', required)
                },
                activityProfile: {
                    required: helpers.withMessage('Выберите профиль деятельности', required)
                },
                passive_why: {
                    customRequiredPassiveWhy: helpers.withMessage(
                        'Выберите причину',
                        this.customRequiredPassiveWhy
                    )
                }
            }
        };
    },
    methods: {
        ...mapActions([
            'FETCH_CONSULTANT_LIST',
            'FETCH_COMPANY_GROUP_LIST',
            'FETCH_COMPANY_PRODUCT_RANGE_LIST',
            'FETCH_COMPANY_IN_THE_BANK_LIST',
            'CREATE_COMPANY',
            'UPDATE_COMPANY'
        ]),
        onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.loader = true;
                if (this.formdata) {
                    this.updateCompany();
                } else {
                    this.createCompany();
                }
            }
        },
        async updateCompany() {
            if (await this.UPDATE_COMPANY(this.form)) {
                this.$emit('updated');
                this.clickCloseModal();
            }
            this.loader = false;
        },
        async createCompany() {
            let company_id = await this.CREATE_COMPANY(this.form);
            if (company_id) {
                this.$emit('created', company_id);
                this.clickCloseModal();
            }
            this.loader = false;
        },
        clickCloseModal() {
            this.$emit('closeCompanyForm');
        },
        async getAddress(query) {
            if (this.formdata) return await yandexmap.getAddress(query, this.formdata.officeAdress);
            return await yandexmap.getAddress(query);
        },
        customRequiredNameRu(value) {
            if (!this.form.noName) {
                if (
                    (value !== null && value !== '') ||
                    (this.form.nameEng != null && this.form.nameEng !== '')
                ) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        },
        customRequiredNameEng(value) {
            if (!this.form.noName) {
                if (
                    (value != null && value != '') ||
                    (this.form.nameRu != null && this.form.nameRu != '')
                ) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        },
        customRequiredPassiveWhy() {
            if (this.form.status) {
                return true;
            }
            if (!required.$validator(this.form.passive_why)) {
                return false;
            }
            return true;
        },
        async getProductRangeList() {
            return await api.companies.getCompanyProductRangeList();
        }
    },
    async created() {
        this.loader = true;

        await Promise.all([
            this.FETCH_CONSULTANT_LIST(),
            this.FETCH_COMPANY_GROUP_LIST(),
            this.FETCH_COMPANY_PRODUCT_RANGE_LIST(),
            this.FETCH_COMPANY_IN_THE_BANK_LIST()
        ]);

        if (this.formdata) {
            this.form = { ...this.form, ...cloneObject(this.formdata) };
            this.form = Utils.normalizeDataForCompanyForm(this.form);
        }

        this.loader = false;
    }
};
</script>

<style></style>
