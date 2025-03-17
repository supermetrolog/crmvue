<template>
    <UiModal
        @close="$emit('close')"
        custom-close
        show
        :width="1500"
        :close-on-outside-click="false"
        :close-on-press-esc="false"
        has-tabs
        title="Создание запроса"
    >
        <template #header>
            <Switch
                v-model="form.expressRequest"
                :transform="Number"
                class="col-4"
                false-title="Обычный запрос"
                true-title="Срочный запрос"
                only-true
            />
        </template>
        <Loader v-if="isLoading" />
        <UiForm>
            <Tabs always-render>
                <Tab name="Основное">
                    <UiFormGroup>
                        <UiInput v-model="form.name" label="Название" class="col-4" />
                        <CompanyPicker
                            v-model="form.company_id"
                            @change="onChangeCompany"
                            label="Компания"
                            :options="searchCompany"
                            placement="top"
                            class="col-4"
                            required
                        />
                        <MultiSelect
                            v-model="form.contact_id"
                            :disabled="!form.company_id"
                            :v="v$.form.contact_id"
                            :options="contacts"
                            extra-classes="long-text"
                            label="Контакт"
                            required
                            class="col-4"
                        />
                        <MultiSelect
                            v-model="form.dealType"
                            :v="v$.form.dealType"
                            required
                            label="Тип сделки"
                            class="col-4"
                            :options="DealTypeList"
                        />
                        <ConsultantPicker
                            v-model="form.consultant_id"
                            :v="v$.form.consultant_id"
                            class="col-4"
                            required
                            :options="getConsultantsOptions"
                        />
                        <MultiSelect
                            v-model="form.regions"
                            @change="changeRegion"
                            :v="v$.form.regions"
                            :options="getClearedRegionsOptions"
                            :close-on-select="false"
                            :hide-selected="false"
                            multiple-property="label"
                            label="Регионы"
                            class="col-4"
                            mode="multiple"
                            name="region"
                            searchable
                            multiple
                            required
                        />
                        <AnimationTransition>
                            <CheckboxOptions
                                v-if="hasDistricts"
                                v-model="form.districts"
                                class="col-7 col-md-9"
                                label="Округа Москвы"
                                property="district"
                                :options="DistrictList"
                            />
                        </AnimationTransition>
                        <AnimationTransition>
                            <RadioOptions
                                v-if="hasDistricts"
                                v-model="form.outside_mkad"
                                class="col-5 col-md-3"
                                label="МКАД"
                                :options="OutsideMkad"
                                unselect
                            />
                        </AnimationTransition>
                        <AnimationTransition>
                            <div v-if="hasDirections" class="col-12 mb-2">
                                <span class="form__subtitle">Направления МО</span>
                                <div class="form__row mt-1">
                                    <CheckboxChip
                                        v-for="(directionItem, index) in DirectionList"
                                        :key="index"
                                        v-model="form.directions"
                                        :value="index"
                                        :text="directionItem.short"
                                        property="direction"
                                    />
                                </div>
                                <Switch
                                    v-model="form.region_neardy"
                                    class="mt-2"
                                    true-title="Регионы рядом с МО"
                                    false-title="Только в пределах МО"
                                    :transform="Number"
                                />
                            </div>
                        </AnimationTransition>
                        <div class="col-4">
                            <UiInput
                                v-model="form.distanceFromMKAD"
                                :disabled="!!form.distanceFromMKADnotApplicable"
                                :v="v$.form.distanceFromMKAD"
                                maska="###"
                                label="Удаленность от МКАД"
                                type="number"
                                unit="км"
                                required
                            />
                            <Switch
                                v-model="form.distanceFromMKADnotApplicable"
                                @change="onChangeDistanceFromMKADnotApplicable"
                                class="mt-1"
                                false-title="Учитывать удаленность"
                                true-title="Неприменимо"
                            />
                        </div>
                        <div class="col-4">
                            <UiDateInput
                                v-model="form.movingDate"
                                @change="form.unknownMovingDate = null"
                                :v="v$.form.movingDate"
                                :disabled="form.unknownMovingDate"
                                label="Дата переезда"
                                placeholder="Укажите дату переезда.."
                                :required="isNullish(form.unknownMovingDate)"
                                :min-date="!isEditMode ? new Date() : undefined"
                            />
                            <div class="form__row mt-1">
                                <RadioOptions
                                    v-model="form.unknownMovingDate"
                                    @change="form.movingDate = null"
                                    :options="unknownMovingDate"
                                    unselect
                                />
                            </div>
                        </div>
                        <UiInput
                            v-model="form.pricePerFloor"
                            maska="##########"
                            label="Цена"
                            :unit="pricePerFloorUnit"
                            type="number"
                            class="col-4"
                        />
                        <DoubleInput
                            v-model:first="form.minCeilingHeight"
                            v-model:second="form.maxCeilingHeight"
                            label="Высота потолков"
                            class="col-4"
                            unit="м"
                            type="number"
                            :validators="formCeilingHeightValidators"
                            :v-first="v$.form.minCeilingHeight"
                        />
                        <DoubleInput
                            v-model:first="form.minArea"
                            v-model:second="form.maxArea"
                            label="S пола"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                            :validators="formAreaValidators"
                            :v-first="v$.form.minArea"
                            :v-second="v$.form.maxArea"
                        />
                        <UiInput
                            v-model="form.electricity"
                            maska="##########"
                            label="Электричество"
                            class="col-4"
                            unit="кВт"
                            type="number"
                        />
                    </UiFormGroup>
                    <UiFormGroup>
                        <AnimationTransition :speed="0.4">
                            <div v-if="v$.form.objectTypesGeneral.$error" class="col-12">
                                <DashboardChip class="dashboard-bg-danger-l w-100 text-center">
                                    {{ v$.form.objectTypesGeneral.$errors[0].$message }}
                                </DashboardChip>
                            </div>
                        </AnimationTransition>
                        <ObjectTypePicker
                            v-model:value="form.objectTypes"
                            v-model:extra="form.objectTypesGeneral"
                            :extra-value="0"
                            :v="v$.form.objectTypesGeneral"
                            label="Склад"
                            :options="objectPurposesWithSectionsOptions.warehouse"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.objectTypes"
                            v-model:extra="form.objectTypesGeneral"
                            :extra-value="1"
                            :v="v$.form.objectTypesGeneral"
                            label="Производство"
                            :options="objectPurposesWithSectionsOptions.production"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.objectTypes"
                            v-model:extra="form.objectTypesGeneral"
                            :extra-value="2"
                            :v="v$.form.objectTypesGeneral"
                            label="Участок"
                            :options="objectPurposesWithSectionsOptions.plot"
                            class="col-md-4"
                        />
                    </UiFormGroup>
                    <UiFormGroup v-if="isEditMode">
                        <MultiSelect
                            v-model="form.status"
                            :v="v$.form.status"
                            :transform="Number"
                            required
                            label="Статус"
                            class="col-6"
                            :options="entityOptions.request.status"
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
                        />
                    </UiFormGroup>
                </Tab>
                <Tab name="Коммуникации/инфраструктура">
                    <UiFormGroup class="mb-4">
                        <CheckboxOptions
                            v-model="form.gateTypes"
                            class="col-6"
                            label="Тип ворот"
                            :options="GateTypeList"
                            property="gate_type"
                        />
                        <CheckboxOptions
                            v-model="form.objectClasses"
                            class="col-3"
                            label="Классы"
                            property="object_class"
                            :options="ObjectClassList"
                        />
                    </UiFormGroup>
                    <UiFormGroup class="mb-4">
                        <SwitchSlider v-model="form.heated" class="col-6" label="Отопление" />
                        <SwitchSlider v-model="form.water" class="col-6" label="Вода" />
                        <SwitchSlider v-model="form.gaz" class="col-6" label="Газ" />
                        <SwitchSlider v-model="form.steam" class="col-6" label="Пар" />
                        <SwitchSlider v-model="form.sewerage" class="col-6" label="Канализация" />
                        <SwitchSlider v-model="form.shelving" class="col-6" label="Стелажи" />
                        <SwitchSlider
                            v-model="form.trainLine"
                            :transform="Number"
                            class="col-6"
                            label="Ж/Д ветка"
                        >
                            <UiInput
                                v-model="form.trainLineLength"
                                :disabled="!form.trainLine"
                                unit="м"
                                type="number"
                            />
                        </SwitchSlider>
                        <SwitchSlider v-model="form.haveCranes" class="col-6" label="Краны" />
                    </UiFormGroup>
                    <UiFormGroup>
                        <Switch
                            v-model="form.firstFloorOnly"
                            :transform="Number"
                            class="col-6"
                            false-title="Любое количество этажей"
                            true-title="Только 1 этаж"
                            only-true
                        />
                        <Switch
                            v-model="form.antiDustOnly"
                            :transform="Number"
                            class="col-6"
                            false-title="Любое покрытие пола"
                            true-title="Только антипыль"
                            only-true
                        />
                    </UiFormGroup>
                </Tab>
                <Tab name="Описание">
                    <VueEditor v-model="form.description" class="col-12" />
                </Tab>
            </Tabs>
        </UiForm>
        <template #actions="{ close }">
            <UiButton @click="submit" color="success-light" small icon="fa-solid fa-check" bolder>
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" small icon="fa-solid fa-ban" bolder>
                Отмена
            </UiButton>
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
import { computed, onBeforeMount, reactive, ref, toRef } from 'vue';
import { useSearchCompany } from '@/composables/useSearchCompany.js';
import { useSearchContacts } from '@/composables/useSearchContacts.js';
import Switch from '@/components/common/Forms/Switch.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import { entityOptions } from '@/const/options/options.js';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import api from '@/api/api.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import CompanyPicker from '@/components/common/Forms/CompanyPicker/CompanyPicker.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions.js';
import { useRegionsOptions } from '@/composables/options/useRegionsOptions.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import { useValidation } from '@/composables/useValidation.js';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';

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

const { getConsultantsOptions } = useConsultantsOptions();
const { getClearedRegionsOptions } = useRegionsOptions();

const { form, isEditMode } = useFormData(
    reactive({
        company_id: null,
        name: null,
        id: null,
        dealType: null,
        regions: [],
        expressRequest: null,
        distanceFromMKAD: null,
        distanceFromMKADnotApplicable: null,
        minArea: null,
        maxArea: null,
        minCeilingHeight: null,
        maxCeilingHeight: null,
        firstFloorOnly: null,
        objectClasses: [],
        heated: null,
        gateTypes: [],
        antiDustOnly: null,
        electricity: '',
        haveCranes: null,
        trainLine: null,
        trainLineLength: null,
        status: 1,
        consultant_id: null,
        description: null,
        pricePerFloor: null,
        objectTypes: [],
        objectTypesGeneral: [],
        directions: [],
        districts: [],
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
        contact_id: null
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
const hasDirections = computed(() => form.regions.some(item => item.region === 1));
const hasDistricts = computed(() => form.regions.some(item => item.region === 6));
const isPassive = computed(() => form.status === entityOptions.request.statusStatement.PASSIVE);

const normalizeForm = () => {
    if (!form.regions.some(item => Number(item.region) === 6)) {
        form.districts = [];
        form.outside_mkad = null;
    }

    if (!form.regions.some(item => Number(item.region) === 1)) {
        form.directions = [];
        form.region_neardy = null;
    }

    form.objectTypes = form.objectTypes.map(element => ({ object_type: element }));
    form.objectTypesGeneral = form.objectTypesGeneral.map(element => ({ type: element }));
};

const normalizeFormData = () => {
    form.objectTypes = form.objectTypes.map(element => element.object_type);
    form.objectTypesGeneral = form.objectTypesGeneral.map(element => element.type);
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

const searchCompany = useSearchCompany(
    toRef(() => (props.formData ? props.formData.company_id : props.companyId))
);
const { searchContacts, contacts } = useSearchContacts(
    toRef(() => (props.formData ? props.formData.company_id : props.companyId))
);

const onChangeCompany = () => {
    form.contact_id = null;
    searchContacts(form.company_id);
};

const changeRegion = () => {
    if (form.regions === null) {
        form.directions = [];
        form.districts = [];
    }

    if (!form.regions.some(item => Number(item.region ?? item) === 1)) {
        form.directions = [];
        form.region_neardy = null;
    }

    if (!form.regions.some(item => Number(item.region ?? item) === 6)) {
        form.districts = [];
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
</script>
