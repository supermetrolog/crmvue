<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="1000"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
        has-tabs
        :title="isEditMode ? `Редактирование запроса #${formData?.id}` : 'Новый запрос'"
    >
        <Loader v-if="isLoading" />
        <UiForm>
            <Tabs always-render>
                <Tab name="Основное" required>
                    <UiFormGroup>
                        <UiInput v-model="form.name" label="Название" class="col-12" />
                        <CompanyPicker
                            v-model="form.company_id"
                            @change="onChangeCompany"
                            label="Компания"
                            :options="searchCompany"
                            placement="top"
                            class="col-6"
                            required
                            :disabled="isEditMode && !currentUserIsModeratorOrHigher"
                        />
                        <MultiSelect
                            v-model="form.contact_id"
                            :disabled="!form.company_id"
                            :v="v$.form.contact_id"
                            :options="contacts"
                            extra-classes="long-text"
                            label="Контакт"
                            class="col-6"
                        >
                            <template #after>
                                <AnimationTransition :speed="0.4">
                                    <UiButton
                                        v-if="
                                            form.company_id &&
                                            (contactsIsLoading || mainCompanyContact)
                                        "
                                        @click.prevent="selectMainCompanyContact"
                                        small
                                        color="light"
                                        icon="fa-solid fa-user-lock"
                                        :disabled="mainCompanyContactIsSelected"
                                        :loading="contactsIsLoading"
                                    >
                                        <span v-if="contactsIsLoading" class="fs-2 text-grey">
                                            Поиск контактов
                                        </span>
                                        <template v-else-if="mainCompanyContact">
                                            <span>
                                                {{ mainCompanyContact.label }}
                                            </span>
                                            <span class="ml-1 text-grey fs-2">(Осн. конт.) </span>
                                        </template>
                                    </UiButton>
                                </AnimationTransition>
                            </template>
                            <template #option="{ option }">
                                <div class="d-flex flex-column">
                                    <p class="font-weight-semi">
                                        <span>{{ option.label ?? '- Без измени' }}</span>
                                        <i v-if="option.isMain" class="fa-solid fa-crown ml-2" />
                                    </p>
                                    <p v-if="option.position" class="text-grey fs-2">
                                        {{ option.position }}
                                    </p>
                                    <p v-if="option.phone" class="fs-2">
                                        Телефон: {{ option.phone }}
                                    </p>
                                </div>
                            </template>
                        </MultiSelect>
                        <MultiSelect
                            v-model="form.dealType"
                            :v="v$.form.dealType"
                            required
                            label="Тип сделки"
                            class="col-6"
                            :options="DealTypeList"
                        >
                            <template #after>
                                <UiCheckbox
                                    v-model="form.expressRequest"
                                    :true-value="1"
                                    :false-value="null"
                                    label="Срочный запрос"
                                />
                            </template>
                        </MultiSelect>
                        <ConsultantPicker
                            v-model="form.consultant_id"
                            :v="v$.form.consultant_id"
                            class="col-6"
                            required
                            :options="getConsultantsOptions"
                            :disabled="isEditMode && !currentUserIsModeratorOrHigher"
                        >
                            <template #after>
                                <AnimationTransition :speed="0.4">
                                    <UiButton
                                        v-if="companyConsultantIsLoading || companyConsultant"
                                        @click.prevent="assignToCompanyConsultant"
                                        small
                                        color="light"
                                        icon="fa-solid fa-user-lock"
                                        :disabled="
                                            assignedToCompanyConsultant ||
                                            !currentUserIsModeratorOrHigher
                                        "
                                        :loading="companyConsultantIsLoading"
                                    >
                                        <span
                                            v-if="companyConsultantIsLoading"
                                            class="fs-2 text-grey"
                                        >
                                            Поиск консультанта
                                        </span>
                                        <template v-else-if="companyConsultant">
                                            <span>
                                                {{ companyConsultant.userProfile.medium_name }}
                                            </span>
                                            <span class="text-grey fs-2"> (Конс. компании) </span>
                                        </template>
                                    </UiButton>
                                </AnimationTransition>
                            </template>
                        </ConsultantPicker>
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <DoubleInput
                            v-model:first="form.minCeilingHeight"
                            v-model:second="form.maxCeilingHeight"
                            label="Высота потолков"
                            class="col-6"
                            unit="м"
                            type="number"
                            :validators="formCeilingHeightValidators"
                            :v-first="v$.form.minCeilingHeight"
                            :required="minCeilingHeightIsRequired"
                        />
                        <DoubleInput
                            v-model:first="form.minArea"
                            v-model:second="form.maxArea"
                            label="S пола"
                            class="col-6"
                            type="number"
                            unit="м<sup>2</sup>"
                            :validators="formAreaValidators"
                            :v-first="v$.form.minArea"
                            :v-second="v$.form.maxArea"
                            required
                        />
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <UiDateInput
                            v-model="form.movingDate"
                            @change="form.unknownMovingDate = null"
                            :v="v$.form.movingDate"
                            :disabled="Boolean(form.unknownMovingDate)"
                            label="Дата переезда"
                            placeholder="Укажите дату переезда.."
                            :required="isNullish(form.unknownMovingDate)"
                            :min-date="!isEditMode ? new Date() : undefined"
                            class="col-6"
                        >
                            <template #after>
                                <RadioOptions
                                    v-model="form.unknownMovingDate"
                                    @change="form.movingDate = null"
                                    :options="unknownMovingDate"
                                    item-class="px-2 py-1 fs-2"
                                    show-radio
                                    :rounded="false"
                                    unselect
                                />
                            </template>
                        </UiDateInput>
                        <UiInput
                            v-model="form.pricePerFloor"
                            label="Цена пола"
                            :unit="pricePerFloorUnit"
                            type="number"
                            class="col-6"
                        />
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <AnimationTransition :speed="0.4">
                            <div v-if="v$.form.object_type_general_ids.$error" class="col-12">
                                <DashboardChip class="dashboard-bg-danger-l w-100 text-center">
                                    {{ v$.form.object_type_general_ids.$errors[0].$message }}
                                </DashboardChip>
                            </div>
                        </AnimationTransition>
                        <ObjectTypePicker
                            v-model:value="form.object_type_ids"
                            v-model:extra="form.object_type_general_ids"
                            :extra-value="0"
                            :v="v$.form.object_type_general_ids"
                            label="Склад"
                            :options="objectPurposesWithSectionsOptions.warehouse"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.object_type_ids"
                            v-model:extra="form.object_type_general_ids"
                            :extra-value="1"
                            :v="v$.form.object_type_general_ids"
                            label="Производство"
                            :options="objectPurposesWithSectionsOptions.production"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.object_type_ids"
                            v-model:extra="form.object_type_general_ids"
                            :extra-value="2"
                            :v="v$.form.object_type_general_ids"
                            label="Участок"
                            :options="objectPurposesWithSectionsOptions.plot"
                            class="col-md-4"
                        />
                    </UiFormGroup>
                    <UiFormDivider v-if="isEditMode" />
                    <UiFormGroup v-if="isEditMode">
                        <MultiSelect
                            v-model="form.status"
                            :v="v$.form.status"
                            :transform="Number"
                            required
                            label="Статус"
                            class="col-6"
                            :options="entityOptions.request.status"
                            :disabled="!currentUserIsModeratorOrHigher"
                        />
                        <MultiSelect
                            v-model="form.passive_why"
                            :disabled="!isPassive"
                            :v="v$.form.passive_why"
                            required
                            label="Причина пассива"
                            class="col-6"
                            :options="PassiveWhyRequest"
                        />
                        <UiTextarea
                            v-model="form.passive_why_comment"
                            :disabled="!isPassive"
                            class="col-12"
                            label="Описание причины пассива"
                            :min-height="50"
                            auto-height
                            :max-height="140"
                        />
                    </UiFormGroup>
                </Tab>
                <Tab name="Локация" required>
                    <UiFormGroup>
                        <MultiSelect
                            v-model="form.region_ids"
                            @change="changeRegion"
                            :v="v$.form.region_ids"
                            :options="getClearedRegionsOptions"
                            :close-on-select="false"
                            :hide-selected="false"
                            multiple-property="label"
                            label="Регионы"
                            class="col-8"
                            mode="multiple"
                            searchable
                            multiple
                            required
                        />
                        <UiCol :cols="4">
                            <UiInput
                                v-model="form.distanceFromMKAD"
                                :disabled="!!form.distanceFromMKADnotApplicable"
                                :v="v$.form.distanceFromMKAD"
                                label="Удаленность от МКАД"
                                type="number"
                                unit="км"
                                required
                            />
                            <UiCheckbox
                                v-model="form.distanceFromMKADnotApplicable"
                                @change="onChangeDistanceFromMKADnotApplicable"
                                :true-value="1"
                                :false-value="null"
                                class="mt-1"
                            >
                                <div class="d-flex gap-1 align-items-end">
                                    <span>Не учитывать</span>
                                    <span class="text-grey fs-2">(Москва или регионы)</span>
                                </div>
                            </UiCheckbox>
                        </UiCol>
                        <AnimationTransition>
                            <CheckboxOptions
                                v-if="hasDistricts"
                                v-model="form.district_ids"
                                class="col-12"
                                label="Округа"
                                :options="DistrictList"
                            />
                        </AnimationTransition>
                        <AnimationTransition>
                            <RadioOptions
                                v-if="hasDistricts"
                                v-model="form.outside_mkad"
                                class="col-12"
                                label="МКАД"
                                show-radio
                                :rounded="false"
                                :options="OutsideMkad"
                                unselect
                            />
                        </AnimationTransition>
                        <AnimationTransition>
                            <UiCol v-if="hasDirections" :cols="12">
                                <span class="form__subtitle">Направления МО</span>
                                <div class="form__row mt-1">
                                    <CheckboxChip
                                        v-for="(directionItem, index) in DirectionList"
                                        :key="index"
                                        v-model="form.direction_ids"
                                        :value="Number(index)"
                                        :text="directionItem.full"
                                        show-checkbox
                                        :rounded="false"
                                    />
                                </div>
                                <Switch
                                    v-model="form.region_neardy"
                                    class="mt-3"
                                    true-title="Регионы рядом с МО"
                                    false-title="Только в пределах МО"
                                    :transform="Number"
                                />
                            </UiCol>
                        </AnimationTransition>
                    </UiFormGroup>
                </Tab>
                <Tab name="Коммуникации/инфраструктура">
                    <UiFormGroup>
                        <UiInput
                            v-model="form.electricity"
                            label="Электричество"
                            class="col-12"
                            unit="кВт"
                            type="number"
                        />
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <CheckboxOptions
                            v-model="form.gate_types"
                            class="col-8"
                            label="Тип ворот"
                            :options="GateTypeList"
                        />
                        <CheckboxOptions
                            v-model="form.object_classes"
                            class="col-4"
                            label="Классы объекта"
                            :options="ObjectClassList"
                        />
                    </UiFormGroup>
                    <UiFormDivider />
                    <UiFormGroup>
                        <SwitchSlider
                            v-model="form.heated"
                            class="col-12"
                            label="Отопление"
                            vertical
                        />
                        <UiCol :cols="12">
                            <span class="form__subtitle">
                                <span>Необходимые коммуникации</span>
                                <span class="text-grey fs-2 ml-1">(Выберите необходимое)</span>
                            </span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.water"
                                    :value="1"
                                    :rounded="false"
                                    label="Вода"
                                    unselect
                                    icon="fa-solid fa-droplet"
                                />
                                <RadioChip
                                    v-model="form.gaz"
                                    :value="1"
                                    :rounded="false"
                                    label="Газ"
                                    unselect
                                    icon="fa-solid fa-gas-pump"
                                />
                                <RadioChip
                                    v-model="form.steam"
                                    :value="1"
                                    :rounded="false"
                                    label="Пар"
                                    unselect
                                    icon="fa-solid fa-cloud"
                                />
                                <RadioChip
                                    v-model="form.sewerage"
                                    :value="1"
                                    :rounded="false"
                                    label="Канализация"
                                    unselect
                                    icon="fa-solid fa-faucet-drip"
                                />
                                <RadioChip
                                    v-model="form.shelving"
                                    :value="1"
                                    :rounded="false"
                                    label="Стеллажи"
                                    unselect
                                    icon="fa-solid fa-box-archive"
                                />
                                <RadioChip
                                    v-model="form.haveCranes"
                                    :value="1"
                                    :rounded="false"
                                    label="Краны"
                                    unselect
                                    icon="fa-solid fa-arrows-up-to-line"
                                />
                                <RadioChip
                                    v-model="form.trainLine"
                                    :value="1"
                                    :rounded="false"
                                    label="Ж/Д ветка"
                                    unselect
                                    icon="fa-solid fa-train"
                                />
                            </div>
                        </UiCol>
                        <AnimationTransition :speed="0.5">
                            <UiCol v-if="form.trainLine" :cols="12">
                                <div class="dashboard-bg-light p-2 br-1">
                                    <UiInput
                                        v-model="form.trainLineLength"
                                        :disabled="!form.trainLine"
                                        unit="м"
                                        type="number"
                                        label="Длина Ж/Д ветки"
                                        placeholder="Укажите необходимую длину Ж/Д ветки.."
                                        class="w-100"
                                    />
                                </div>
                            </UiCol>
                        </AnimationTransition>
                        <UiCol :cols="12">
                            <span class="form__subtitle">
                                <span>Дополнительные требования</span>
                                <span class="text-grey fs-2 ml-1">(Выберите необходимое)</span>
                            </span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.firstFloorOnly"
                                    :value="1"
                                    :rounded="false"
                                    label="Только 1 этаж"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.antiDustOnly"
                                    :value="1"
                                    :rounded="false"
                                    label="Только антипыль"
                                    unselect
                                />
                            </div>
                        </UiCol>
                    </UiFormGroup>
                </Tab>
                <Tab name="Описание">
                    <VueEditor v-model="form.description" class="col-12" />
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
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    OutsideMkad,
    PassiveWhyRequest,
    unknownMovingDate
} from '@/const/const.js';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import Loader from '@/components/common/Loader.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { areaRangeValidators, ceilingHeightValidators } from '@//validators/fields';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import { validationRulesForRequest } from '@/validators/rules/request.js';
import { computed, onBeforeMount, reactive, ref, shallowRef, watch } from 'vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import { useSearchContacts } from '@/composables/useSearchContacts.ts';
import Switch from '@/components/common/Forms/Switch.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import { entityOptions } from '@/const/options/options.js';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import api from '@/api/api.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { useRegionsOptions } from '@/composables/options/useRegionsOptions.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import { useAuth } from '@/composables/useAuth';
import { isString } from '@/utils/helpers/string/isString.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { useUserNotificationsPause } from '@/composables/useUserNotificationsPause';

const emit = defineEmits(['close', 'created', 'updated']);
const props = defineProps({
    formData: {
        type: Object,
        default: null
    },
    companyId: {
        type: Number,
        default: null
    }
});

useUserNotificationsPause('company-request-form');

const { getConsultantsOptions } = useConsultantsOptions();
const { getClearedRegionsOptions } = useRegionsOptions();

const { form, isEditMode } = useFormData(
    reactive({
        company_id: null,
        name: null,
        id: null,
        dealType: null,
        expressRequest: null,
        distanceFromMKAD: null,
        distanceFromMKADnotApplicable: null,
        minArea: null,
        maxArea: null,
        minCeilingHeight: null,
        maxCeilingHeight: null,
        firstFloorOnly: null,
        heated: null,
        antiDustOnly: null,
        electricity: null,
        haveCranes: null,
        trainLine: null,
        trainLineLength: null,
        status: 1,
        consultant_id: null,
        description: null,
        pricePerFloor: null,
        movingDate: null,
        unknownMovingDate: null,
        passive_why: null,
        passive_why_comment: null,
        water: null,
        gaz: null,
        steam: null,
        sewerage: null,
        shelving: null,
        outside_mkad: null,
        region_neardy: null,
        contact_id: null,
        gate_types: [],
        region_ids: [],
        object_type_ids: [],
        object_type_general_ids: [],
        direction_ids: [],
        district_ids: [],
        object_classes: []
    }),
    props.formData
);

const isLoading = ref(false);

const { v$, validate } = useValidation({ form: validationRulesForRequest }, { form });

const formCeilingHeightValidators = computed(() => ceilingHeightValidators(form.maxCeilingHeight));
const formAreaValidators = computed(() => areaRangeValidators(form.maxArea));

const pricePerFloorUnit = computed(() => {
    if (form.dealType === null || form.dealType === undefined || form.dealType === 1) return '₽';
    return '₽ за м<sup>2</sup>/год';
});
const hasDirections = computed(() => form.region_ids.some(item => Number(item) === 1));
const hasDistricts = computed(() => form.region_ids.some(item => Number(item) === 6));
const isPassive = computed(() => form.status === entityOptions.request.statusStatement.PASSIVE);

const minCeilingHeightIsRequired = computed(() => !form.object_type_general_ids.includes(2));

const normalizeForm = () => {
    if (!form.region_ids.some(item => Number(item) === 6)) {
        form.district_ids = [];
        form.outside_mkad = null;
    }

    if (!form.region_ids.some(item => Number(item) === 1)) {
        form.direction_ids = [];
        form.region_neardy = null;
    }

    if (isNotNullish(form.electricity) && isString(form.electricity)) {
        form.electricity = Number(form.electricity);
    }

    if (isString(form.maxCeilingHeight) && form.maxCeilingHeight.length === 0) {
        form.maxCeilingHeight = null;
    }
};

const normalizeFormData = () => {
    form.object_type_ids = props.formData.objectTypes.map(element => element.object_type);
    form.object_type_general_ids = props.formData.objectTypesGeneral.map(element => element.type);
    form.region_ids = props.formData.regions.map(element => element.region);
    form.district_ids = props.formData.districts.map(element => element.district);
    form.direction_ids = props.formData.directions.map(element => element.direction);
    form.object_classes = props.formData.objectClasses.map(element => element.object_class);
    form.gate_types = props.formData.gateTypes.map(element => element.gate_type);
};

const updateRequest = async () => {
    const updated = await api.request.update(props.formData.id, form);

    if (updated) {
        emit('updated', updated);
        emit('close');
    }
};

const createRequest = async () => {
    const created = await api.request.create(form);

    if (created) {
        emit('created', created);
        emit('close');
    }
};

async function submit() {
    const isValid = await validate();
    if (!isValid) return;

    normalizeForm();
    isLoading.value = true;

    try {
        if (isEditMode.value) await updateRequest();
        else await createRequest();
    } finally {
        isLoading.value = false;
    }
}

const onChangeDistanceFromMKADnotApplicable = () => {
    if (form.distanceFromMKADnotApplicable) form.distanceFromMKAD = null;
};

const currentCompanyId = computed(() => {
    if (props.formData) return props.formData.company_id;
    if (props.companyId) return props.companyId;
    return null;
});

const searchCompany = useSearchCompany(currentCompanyId);
const {
    searchContacts,
    contacts,
    isLoading: contactsIsLoading
} = useSearchContacts(currentCompanyId);

const onChangeCompany = () => {
    form.contact_id = null;
    searchContacts(form.company_id);
};

const changeRegion = () => {
    if (form.region_ids === null) {
        form.direction_ids = [];
        form.district_ids = [];
    }

    if (!form.region_ids.some(item => Number(item) === 1)) {
        form.direction_ids = [];
        form.region_neardy = null;
    }

    if (!form.region_ids.some(item => Number(item) === 6)) {
        form.district_ids = [];
        form.outside_mkad = null;
    }
};

onBeforeMount(() => {
    if (props.companyId) {
        form.company_id = props.companyId;
        searchContacts();
    }

    if (props.formData) {
        normalizeFormData();
        searchContacts();
    }
});

// company consultant

const companyConsultant = shallowRef(null);
const companyConsultantIsLoading = ref(false);

async function fetchCompanyConsultant() {
    try {
        companyConsultantIsLoading.value = true;

        const company = await api.companies.getCompany(form.company_id);
        companyConsultant.value = company.consultant;
    } catch (e) {
        companyConsultant.value = null;
    } finally {
        companyConsultantIsLoading.value = false;
    }
}

watch(
    () => form.company_id,
    value => {
        if (value) {
            fetchCompanyConsultant();
        } else {
            companyConsultant.value = null;
        }
    },
    { immediate: true }
);

function assignToCompanyConsultant() {
    if (companyConsultant.value) {
        form.consultant_id = companyConsultant.value.id;
    }
}

const assignedToCompanyConsultant = computed(
    () => form.consultant_id === companyConsultant.value?.id
);

// main contact

const mainCompanyContact = computed(() => {
    return contacts.value.find(contact => contact.isMain);
});

function selectMainCompanyContact() {
    form.contact_id = mainCompanyContact.value.value;
}

const mainCompanyContactIsSelected = computed(
    () => form.contact_id === mainCompanyContact.value?.value
);

// auth

const { currentUserIsModeratorOrHigher } = useAuth();
</script>
