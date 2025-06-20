<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        :title="isEditMode ? `Редактирование компании #${formData.id}` : 'Создание компании'"
        :close-on-outside-click="false"
        class="modal-form-company"
        :width="1200"
        has-tabs
        show
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <Tabs sticky>
                <Tab required name="Основное">
                    <UiFormGroup>
                        <div class="col-12">
                            <div class="row align-items-end">
                                <RadioStars
                                    v-model="form.rating"
                                    label="Величина компании"
                                    class="col-3"
                                />
                                <div class="col-8">
                                    <div class="d-flex gap-1">
                                        <DashboardChip
                                            @click="form.rating = 1"
                                            class="dashboard-bg-light px-2 py-1 text-danger c-pointer"
                                        >
                                            <i class="fas fa-star"></i>
                                            - маленькая
                                        </DashboardChip>
                                        <DashboardChip
                                            @click="form.rating = 3"
                                            class="dashboard-bg-light px-2 py-1 text-primary c-pointer"
                                        >
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            - средняя
                                        </DashboardChip>
                                        <DashboardChip
                                            @click="form.rating = 5"
                                            class="dashboard-bg-light px-2 py-1 text-warning c-pointer"
                                        >
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            - большая
                                        </DashboardChip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <div class="col-6">
                            <div class="row">
                                <UiInput
                                    v-model.trim="form.nameRu"
                                    :disabled="form.noName"
                                    :v="v$.form.nameRu"
                                    :required="!form.nameEng"
                                    label="Название Ru"
                                    class="col-12"
                                />
                                <div class="col-12">
                                    <div class="d-flex gap-3">
                                        <UiCheckbox v-model="form.noName" numeric>
                                            Без названия
                                        </UiCheckbox>
                                        <UiCheckbox v-model="form.is_individual" numeric>
                                            Физическое лицо
                                        </UiCheckbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <UiInput
                            v-model.trim="form.nameEng"
                            :disabled="form.noName"
                            :v="v$.form.nameEng"
                            :required="!form.nameRu"
                            label="Название Eng"
                            class="col-6"
                        />
                    </UiFormGroup>
                    <AnimationTransition :speed="0.6">
                        <UiFormGroup v-if="form.is_individual">
                            <UiInput
                                v-model.trim="form.individual_full_name"
                                :v="v$.form.individual_full_name"
                                required
                                label="ФИО физ.лица"
                                class="col-12"
                            />
                        </UiFormGroup>
                    </AnimationTransition>
                    <UiFormGroup>
                        <UiInput
                            v-model.trim="form.nameBrand"
                            :v="v$.form.nameBrand"
                            label="Название Brand"
                            class="col-4"
                        />
                        <MultiSelect
                            v-model="form.companyGroup_id"
                            label="Входит в ГК"
                            class="col-4"
                            searchable
                            :options="getCompanyGroupsOptions"
                        />
                        <MultiSelect
                            v-model="form.formOfOrganization"
                            :disabled="form.noName"
                            label="ФО"
                            title="Форма организации"
                            class="col-4"
                            :options="CompanyFormOrganization"
                        />
                    </UiFormGroup>
                    <UiFormGroup>
                        <MultiSelect
                            v-model="form.officeAdress"
                            :title="form.officeAdress"
                            extra-classes="long-text"
                            label="Адрес офиса"
                            class="col-12"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="isEditMode"
                            :delay="600"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await getAddress(query);
                                }
                            "
                        />
                    </UiFormGroup>
                    <UiFormGroup>
                        <ConsultantPicker
                            v-model="form.consultant_id"
                            :v="v$.form.consultant_id"
                            :options="getConsultantsOptions"
                            :disabled="isEditMode && !canEdit"
                            class="col-6"
                            required
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
                    </UiFormGroup>
                    <UiFormGroup>
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
                    </UiFormGroup>
                    <UiFormGroup>
                        <div class="col-3">
                            <span class="form__subtitle">Статус</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.status" label="Пассив" :value="0" />
                                <RadioChip v-model="form.status" label="Актив" :value="1" />
                            </div>
                        </div>
                        <CheckboxOptions
                            v-model="form.categories"
                            class="col-9"
                            :v="v$.form.categories"
                            label="Категория"
                            property="category"
                            :options="CompanyCategories"
                        />
                        <AnimationTransition :speed="0.6">
                            <div v-if="!form.status" class="col-12">
                                <MultiSelect
                                    v-model="form.passive_why"
                                    :v="v$.form.passive_why"
                                    required
                                    label="Причина пассива"
                                    :options="PassiveWhy"
                                />
                                <UiTextarea
                                    v-model="form.passive_why_comment"
                                    class="col-12 p-0 pt-1"
                                    placeholder="Комментарий"
                                />
                            </div>
                        </AnimationTransition>
                    </UiFormGroup>
                </Tab>
                <Tab required name="Деятельность">
                    <UiFormGroup>
                        <SearchableOptionsPicker
                            v-model="form.activity_group_ids"
                            :options="ActivityGroupList"
                            :v="v$.form.activity_group_ids"
                            :transform="Number"
                            :multiple-label="activityGroupMultipleLabelFn"
                            title="Группа деятельности"
                            label="Группа деятельности"
                            class="col-12 col-md-6"
                            mode="multiple"
                            multiple-property="label"
                            multiple
                            required
                        />
                        <SearchableOptionsPicker
                            v-model="form.activity_profile_ids"
                            :options="ActivityProfileList"
                            :v="v$.form.activity_profile_ids"
                            :transform="Number"
                            :multiple-label="activityProfileMultipleLabelFn"
                            title="Профиль деятельности"
                            label="Профиль деятельности"
                            class="col-12 col-md-6"
                            mode="multiple"
                            multiple-property="label"
                            multiple
                            required
                        />
                        <MultiSelect
                            v-model="form.productRanges"
                            option-label-prop="product"
                            option-value-prop="product"
                            mode="tags"
                            :close-on-select="false"
                            :loading="false"
                            searchable
                            create-tag
                            resolve-on-load
                            label="Номенклатура товара"
                            class="col-12 mt-1"
                            :options="getProductRangeOptions"
                            object
                            :disabled="!form.show_product_ranges"
                        >
                            <template #label="{ label }">
                                <div class="d-flex gap-2">
                                    <Switch
                                        v-model="form.show_product_ranges"
                                        :transform="Number"
                                    />
                                    {{ label }}
                                </div>
                            </template>
                        </MultiSelect>
                    </UiFormGroup>
                    <UiFormDivider />
                    <div class="row mt-2">
                        <UiTextarea v-model="form.description" label="Описание" class="col-12" />
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
                            :resolve-on-load="isEditMode"
                            :delay="600"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await getAddress(query);
                                }
                            "
                        />
                    </div>
                    <div class="row mt-2">
                        <UiInput
                            v-model="form.ogrn"
                            :v="v$.form.ogrn"
                            label="ОГРН"
                            class="col-4"
                            maska="#############"
                        />
                        <UiInput
                            v-model="form.inn"
                            :v="v$.form.inn"
                            label="ИНН"
                            class="col-4"
                            maska="############"
                        />
                        <UiInput
                            v-model="form.kpp"
                            :v="v$.form.kpp"
                            label="КПП"
                            class="col-4"
                            maska="#########"
                        />
                    </div>
                    <div class="row mt-2">
                        <UiInput
                            v-model="form.checkingAccount"
                            :v="v$.form.checkingAccount"
                            label="Расчетный счет"
                            class="col-4"
                            maska="####################"
                        />
                        <UiInput
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
                            searchable
                            :options="getBanksOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <UiInput
                            v-model="form.bik"
                            :v="v$.form.bik"
                            label="БИК"
                            class="col-4"
                            maska="#########"
                        />
                        <UiInput
                            v-model="form.okpo"
                            :v="v$.form.okpo"
                            label="ОКПО"
                            class="col-4"
                            maska="##########"
                        />
                        <UiInput
                            v-model="form.okved"
                            :v="v$.form.okved"
                            label="ОКВЭД"
                            class="col-4"
                            maska="##############################"
                        />
                    </div>
                    <div class="row mt-2">
                        <UiInput
                            v-model="form.signatoryName"
                            label="Имя подписанта"
                            class="col-4"
                        />
                        <UiInput
                            v-model="form.signatoryMiddleName"
                            label="Фамилия подписанта"
                            class="col-4"
                        />
                        <UiInput
                            v-model="form.signatoryLastName"
                            label="Отчество подписанта"
                            class="col-4"
                        />
                    </div>
                    <div class="row mt-2">
                        <UiInput
                            v-model="form.documentNumber"
                            label="№ документа"
                            maska="#####################"
                            class="col-6 pr-1"
                        />
                        <UiInput
                            v-model="form.basis"
                            label="Действует на основе"
                            class="col-6 pl-1"
                        />
                    </div>
                </Tab>
                <Tab name="Документы">
                    <div class="row">
                        <FileInput
                            v-model:native="newFiles"
                            v-model:data="oldFiles"
                            label="Документы"
                            class="col-12"
                            sortable
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
            </Tabs>
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
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import PropogationInput from '@/components/common/Forms/PropogationInput.vue';
import PropogationDoubleInput from '@/components/common/Forms/PropogationDoubleInput.vue';
import RadioStars from '@/components/common/Forms/RadioStars.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import {
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    CompanyFormOrganization,
    PassiveWhy
} from '@/const/const.js';
import { yandexmap } from '@/utils/yandexMap.js';
import Loader from '@/components/common/Loader.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { validateEmail, validateUrl } from '@//validators';
import { computed, reactive, shallowRef, toRef } from 'vue';
import { normalizeDataForCompanyForm } from '@/utils/normalizeForm.js';
import { validationRulesForCompany } from '@/validators/rules.js';
import api from '@/api/api.js';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useCompanyGroupsOptions } from '@/composables/options/useCompanyGroupsOptions.js';
import { useBanksOptions } from '@/composables/options/useBanksOptions.js';
import { useProductRangesOptions } from '@/composables/options/useProductRangesOptions.js';
import { useFormData } from '@/utils/use/useFormData.js';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import SearchableOptionsPicker from '@/components/common/Forms/SearchableOptionsPicker.vue';
import { plural } from '@/utils/plural.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useValidation } from '@/composables/useValidation.js';
import Switch from '@/components/common/Forms/Switch.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useCompanyPermissions } from '@/components/Company/useCompanyPermissions.js';

const emit = defineEmits(['updated', 'created', 'close']);
const props = defineProps({
    formData: {
        type: Object,
        default: null
    }
});

const { currentUserIsModeratorOrHigher } = useAuth();

const { getConsultantsOptions } = useConsultantsOptions();
const { getCompanyGroupsOptions } = useCompanyGroupsOptions();
const { getBanksOptions } = useBanksOptions();
const { getProductRangeOptions } = useProductRangesOptions();

const isLoading = shallowRef(false);

const { form, isEditMode } = useFormData(
    reactive({
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
        is_individual: 0,
        individual_full_name: null,
        productRanges: [],
        signatoryLastName: null,
        signatoryMiddleName: null,
        signatoryName: null,
        status: 1,
        rating: 5,
        passive_why: null,
        passive_why_comment: null,
        files: [],
        new_files: [],
        show_product_ranges: 0,

        activity_group_ids: [],
        activity_profile_ids: []
    }),
    props.formData
);

const { v$, validate } = useValidation({ form: validationRulesForCompany }, { form });

const formContactsWebsitesValidators = computed(() => [
    { func: validateUrl, message: 'Укажите корректную ссылку на сайт' }
]);
const formContactsEmailsValidators = computed(() => [
    { func: validateEmail, message: 'Укажите корректный Email' }
]);

const prepareFormBeforeUpdate = () => {
    form.logo_id = props.formData.logo?.id;
};

const newFiles = computed({
    get() {
        if (props.formData) return form.new_files;
        return form.files;
    },
    set(value) {
        if (props.formData) form.new_files = value;
        else form.files = value;
    }
});

const oldFiles = computed({
    get() {
        if (props.formData) return form.files;
        return [];
    },
    set(value) {
        if (props.formData) form.files = value;
    }
});

const updateCompany = async () => {
    prepareFormBeforeUpdate();

    const updated = await api.companies.update(props.formData.id, form);

    if (updated) {
        emit('updated');
        emit('close');
    }
};
const createCompany = async () => {
    const company = await api.companies.create(form);

    if (company) {
        emit('created', company.id);
        emit('close');
    }
};

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    try {
        isLoading.value = true;

        if (props.formData) await updateCompany();
        else await createCompany();
    } finally {
        isLoading.value = false;
    }
}

const getAddress = async query => {
    if (props.formData) return await yandexmap.getAddress(query, props.formData.officeAdress);
    return await yandexmap.getAddress(query);
};

if (props.formData) {
    normalizeDataForCompanyForm(form, props.formData);
}

// options

function activityProfileMultipleLabelFn(elements) {
    return plural(
        elements.length,
        'Выбран %d профиль',
        'Выбраны %d профиля',
        'Выбрано %d профилей'
    );
}

function activityGroupMultipleLabelFn(elements) {
    return plural(elements.length, 'Выбрана %d группа', 'Выбрано %d группы', 'Выбрано %d групп');
}

// permissions

const { canEdit } = useCompanyPermissions(toRef(props, 'formData'));
</script>
