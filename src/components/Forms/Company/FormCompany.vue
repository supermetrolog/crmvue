<template>
    <Modal
        @close="$emit('close')"
        :title="formData ? 'Редактирование компании' : 'Создание компании'"
        class="modal-form-company"
        width="1000"
        has-tabs
        show
    >
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false }">
                <Loader v-if="isLoading" />
                <Tab name="Основное">
                    <div class="row mb-2">
                        <div class="col-6">
                            <div class="row">
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
                                    class="col-12"
                                />
                                <Switch
                                    v-model="form.noName"
                                    false-title="С названием"
                                    true-title="Без названия"
                                    class="col-12"
                                />
                            </div>
                        </div>
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
                            :options="CompanyFormOrganization"
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
                            :resolve-on-load="Boolean(formData)"
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
                                    v-for="(category, index) in CompanyCategories"
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
                                />
                                <div class="col-12 mt-1">
                                    <span>
                                        <i class="fas fa-star"></i>
                                        - не важно,
                                    </span>
                                    <span>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        - важно,
                                    </span>
                                    <span>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
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
                                    :options="PassiveWhy"
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
                            :options="ActivityGroupList"
                        />
                        <MultiSelect
                            v-model="form.activityProfile"
                            :v="v$.form.activityProfile"
                            required
                            title="Профиль деятельности"
                            label="Профиль дея-ти"
                            class="col-6"
                            :options="ActivityProfileList"
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
                            :resolve-on-load="Boolean(formData)"
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
                        {{ formData ? 'Сохранить' : 'Создать' }}
                    </Submit>
                </div>
            </Tabs>
        </Form>
    </Modal>
</template>

<script setup>
import Form from '@/components/common/Forms/Form.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import PropogationDoubleInput from '@/components/common/Forms/PropogationDoubleInput.vue';
import RadioStars from '@/components/common/Forms/RadioStars.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import useVuelidate from '@vuelidate/core';
import { useStore } from 'vuex';
import {
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    CompanyFormOrganization,
    PassiveWhy
} from '@/const/const.js';
import { cloneObject } from '@/utils';
import { yandexmap } from '@/utils/yandexMap.js';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { validateEmail, validateUrl } from '@//validators';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import { computed, onBeforeMount, reactive, shallowRef } from 'vue';
import { normalizeDataForCompanyForm } from '@/utils/normalizeForm.js';
import { validationRulesForCompany } from '@/validators/rules.js';
import Switch from '@/components/common/Forms/Switch.vue';

const emit = defineEmits(['updated', 'created', 'close']);
const props = defineProps({
    formData: {
        type: Object,
        default: null
    }
});

const store = useStore();

const isLoading = shallowRef(false);
const form = reactive({
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
});

const v$ = useVuelidate({ form: validationRulesForCompany }, { form });

const formContactsWebsitesValidators = computed(() => [
    { func: validateUrl, message: 'Укажите корректную ссылку на сайт' }
]);
const formContactsEmailsValidators = computed(() => [
    { func: validateEmail, message: 'Укажите корректный Email' }
]);

const COMPANY_GROUP_LIST = computed(() => store.getters.COMPANY_GROUP_LIST);
const CONSULTANT_LIST = computed(() => store.getters.CONSULTANT_LIST);
const COMPANY_PRODUCT_RANGE_LIST = computed(() => store.getters.COMPANY_PRODUCT_RANGE_LIST);
const COMPANY_IN_THE_BANK_LIST = computed(() => store.getters.COMPANY_IN_THE_BANK_LIST);

const updateCompany = async () => {
    if (await store.dispatch('UPDATE_COMPANY', form)) {
        emit('updated');
        emit('close');
    }

    isLoading.value = false;
};
const createCompany = async () => {
    let company_id = await store.dispatch('CREATE_COMPANY', form);

    if (company_id) {
        emit('created', company_id);
        emit('close');
    }

    isLoading.value = false;
};

const onSubmit = () => {
    v$.value.$validate();

    if (!v$.value.form.$error) {
        isLoading.value = true;
        if (props.formData) updateCompany();
        else createCompany();
    }
};

const getAddress = async query => {
    if (props.formData) return await yandexmap.getAddress(query, props.formData.officeAdress);
    return await yandexmap.getAddress(query);
};

onBeforeMount(async () => {
    isLoading.value = true;

    if (props.formData) {
        Object.assign(form, cloneObject(props.formData));
        Object.assign(form, normalizeDataForCompanyForm(form));
    }

    await Promise.all([
        store.dispatch('FETCH_CONSULTANT_LIST'),
        store.dispatch('FETCH_COMPANY_GROUP_LIST'),
        store.dispatch('FETCH_COMPANY_PRODUCT_RANGE_LIST'),
        store.dispatch('FETCH_COMPANY_IN_THE_BANK_LIST')
    ]);

    isLoading.value = false;
});
</script>
