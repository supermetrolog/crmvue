<template>
    <Modal @close="$emit('close')" show width="1500" has-tabs>
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
        <Form @submit="onSubmit">
            <Loader v-if="isLoading" />
            <Tabs always-render>
                <Tab name="Основное">
                    <FormGroup>
                        <Input v-model="form.name" label="Название" class="col-4" />
                        <MultiSelect
                            v-model="form.company_id"
                            @change="onChangeCompany"
                            :v="v$.form.company_id"
                            extra-classes="long-text"
                            label="Компания"
                            required
                            class="col-4"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="true"
                            :delay="300"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await searchCompany(query);
                                }
                            "
                        />
                        <MultiSelect
                            v-model="form.contact_id"
                            extra-classes="long-text"
                            label="Контакт"
                            required
                            class="col-4"
                            :disabled="!form.company_id"
                            :v="v$.form.contact_id"
                            :options="contacts"
                        />
                        <MultiSelect
                            v-model="form.dealType"
                            :v="v$.form.dealType"
                            required
                            label="Тип сделки"
                            class="col-4"
                            :options="DealTypeList"
                        />
                        <MultiSelect
                            v-model="form.consultant_id"
                            :v="v$.form.consultant_id"
                            required
                            label="Консультант"
                            class="col-4"
                            :options="CONSULTANT_LIST"
                        />
                        <MultiSelect
                            v-model="form.regions"
                            @change="changeRegion"
                            :v="v$.form.regions"
                            label="Регионы"
                            class="col-4"
                            :close-on-select="false"
                            :hide-selected="false"
                            mode="multiple"
                            name="region"
                            multiple
                            required
                            multiple-property="label"
                            :options="
                                async () => {
                                    await FETCH_REGION_LIST();
                                    return REGION_LIST.filter(elem => Number.isInteger(elem.value));
                                }
                            "
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
                            <Input
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
                            <Input
                                v-model="form.movingDate"
                                @change="form.unknownMovingDate = null"
                                :v="v$.form.movingDate"
                                :disabled="form.unknownMovingDate"
                                label="Дата переезда"
                                type="date"
                                required
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
                        <Input
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
                        <Input
                            v-model="form.electricity"
                            maska="##########"
                            label="Электричество"
                            class="col-4"
                            unit="кВт"
                            type="number"
                        />
                    </FormGroup>
                    <FormGroup>
                        <ObjectTypePicker
                            v-model:value="form.objectTypes"
                            v-model:extra="form.objectTypesGeneral"
                            :extra-value="0"
                            label="Склад"
                            :options="objectPurposesWithSectionsOptions.warehouse"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.objectTypes"
                            v-model:extra="form.objectTypesGeneral"
                            :extra-value="1"
                            label="Производство"
                            :options="objectPurposesWithSectionsOptions.production"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.objectTypes"
                            v-model:extra="form.objectTypesGeneral"
                            :extra-value="2"
                            label="Участок"
                            :options="objectPurposesWithSectionsOptions.plot"
                            class="col-md-4"
                        />
                    </FormGroup>
                    <FormGroup v-if="formData">
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
                        <Textarea
                            v-model="form.passive_why_comment"
                            :disabled="!isPassive"
                            class="col-12"
                            label="Описание причины пассива"
                        />
                    </FormGroup>
                </Tab>
                <Tab name="Коммуникации/инфраструктура">
                    <FormGroup class="mb-4">
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
                    </FormGroup>
                    <FormGroup class="mb-4">
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
                            <Input
                                v-model="form.trainLineLength"
                                :disabled="!form.trainLine"
                                unit="м"
                                type="number"
                            />
                        </SwitchSlider>
                        <SwitchSlider v-model="form.haveCranes" class="col-6" label="Краны" />
                    </FormGroup>
                    <FormGroup>
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
                    </FormGroup>
                </Tab>
                <Tab name="Описание">
                    <VueEditor v-model="form.description" class="col-12" />
                </Tab>
            </Tabs>
            <FormGroup class="mt-4">
                <Submit class="col-4 mx-auto">
                    {{ formData ? 'Сохранить' : 'Создать' }}
                </Submit>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script setup>
import { useStore } from 'vuex';
import useVuelidate from '@vuelidate/core';
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
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { areaRangeValidators, ceilingHeightValidators } from '@//validators/fields';
import { cloneObject } from '@/utils/index.js';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import { validationRulesForRequest } from '@/validators/rules/request.js';
import { computed, onBeforeMount, reactive, shallowRef, toRef } from 'vue';
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

const store = useStore();

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

const form = reactive({
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
});

const isLoading = shallowRef(false);

const v$ = useVuelidate({ form: validationRulesForRequest }, { form });

const formCeilingHeightValidators = computed(() => ceilingHeightValidators(form.maxCeilingHeight));
const formAreaValidators = computed(() => areaRangeValidators(form.maxArea));

const CONSULTANT_LIST = computed(() => store.getters.CONSULTANT_LIST);
const REGION_LIST = computed(() => store.getters.REGION_LIST);
const pricePerFloorUnit = computed(() => {
    if (form.dealType === null || form.dealType === undefined || form.dealType === 1) return '₽';
    return '₽ за м<sup>2</sup>/год';
});
const hasDirections = computed(() => form.regions.some(item => item.region === 1));
const hasDistricts = computed(() => form.regions.some(item => item.region === 6));
const isPassive = computed(() => form.status === entityOptions.request.statusStatement.PASSIVE);

const FETCH_REGION_LIST = () => store.dispatch('FETCH_REGION_LIST');

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
    const updated = await store.dispatch('UPDATE_REQUEST', form);
    if (updated) {
        emit('updated');
        emit('close');
    }
};
const createRequest = async () => {
    const updated = await store.dispatch('CREATE_REQUEST', form);
    if (updated) {
        emit('created');
        emit('close');
    }
};

const onSubmit = async () => {
    v$.value.$validate();

    if (!v$.value.form.$error) {
        normalizeForm();
        isLoading.value = true;

        if (props.formData) await updateRequest();
        else await createRequest();

        isLoading.value = false;
    }
};

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
    console.log('CHANGE COMPANY');
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
    isLoading.value = true;

    store.dispatch('FETCH_CONSULTANT_LIST');
    if (props.companyId) {
        form.company_id = props.companyId;
        searchContacts();
    }
    if (props.formData) {
        Object.assign(form, cloneObject(props.formData));
        normalizeFormData();
        searchContacts();
    }

    isLoading.value = false;
});
</script>
