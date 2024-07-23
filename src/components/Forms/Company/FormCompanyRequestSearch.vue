<template>
    <Form>
        <FormGroup>
            <div class="col-12">
                <div class="d-flex align-items-end">
                    <Input
                        v-model="form.all"
                        label="Поиск"
                        class="w-100"
                        placeholder="ID запроса, название компании"
                    />
                    <div class="form-search__actions ml-4">
                        <Button
                            @click="extraIsVisible = !extraIsVisible"
                            :badge="filtersCount || false"
                        >
                            <span>Фильтры</span>
                        </Button>
                        <Button @click="resetForm" :disabled="!filtersCount" danger>
                            Сбросить фильтры
                        </Button>
                    </div>
                </div>
            </div>
        </FormGroup>
        <teleport to="body">
            <Modal v-if="extraIsVisible" @close="extraIsVisible = false" width="1400">
                <template #header>
                    <Switch
                        v-model="form.expressRequest"
                        :transform="Number"
                        false-title="Обычный запрос"
                        true-title="Срочный запрос"
                        only-true
                    />
                </template>
                <Form>
                    <div class="form-search__extra col-12">
                        <FormGroup>
                            <MultiSelect
                                v-model="form.consultant_id"
                                :disabled="withoutConsultant"
                                label="Консультант"
                                class="col-md-4 col-6"
                                :options="
                                    async () => {
                                        return await FETCH_CONSULTANT_LIST();
                                    }
                                "
                            />
                            <MultiSelect
                                v-model="form.dealType"
                                label="Тип сделки"
                                class="col-md-4 col-6"
                                :options="DealTypeList"
                            />
                            <Input
                                v-model="form.maxElectricity"
                                placeholder="не более"
                                :v="v$.form.maxElectricity"
                                maska="##########"
                                label="Электричество"
                                unit="кВт"
                                type="number"
                                class="col-md-4 col-6 mb-2"
                            />
                        </FormGroup>
                        <FormGroup>
                            <DoubleInput
                                v-model:first="form.rangeMinArea"
                                v-model:second="form.rangeMaxArea"
                                label="S пола"
                                class="col-md-3 col-6"
                                type="number"
                                unit="м<sup>2</sup>"
                                reactive
                                :validators="formAreaValidators"
                            />
                            <DoubleInput
                                v-model:first="form.rangeMinPricePerFloor"
                                v-model:second="form.rangeMaxPricePerFloor"
                                label="Цена за пол"
                                class="col-md-3 col-6"
                                type="number"
                                :unit="pricePerFloorUnit"
                                reactive
                                :validators="formPricePerFloorValidators"
                            />
                            <DoubleInput
                                v-model:first="form.rangeMinCeilingHeight"
                                v-model:second="form.rangeMaxCeilingHeight"
                                label="Высота потолков"
                                class="col-md-3 col-6"
                                unit="м"
                                type="number"
                                reactive
                                :validators="formCeilingHeightValidators"
                            />
                            <DoubleInput
                                v-model:first="form.dateStart"
                                v-model:second="form.dateEnd"
                                label="Дата"
                                class="col-md-3 col-6"
                                type="date"
                                reactive
                                :validators="formDateValidators"
                            />
                        </FormGroup>
                        <FormGroup>
                            <div class="col-8">
                                <div class="row">
                                    <MultiSelect
                                        v-model="form.regions"
                                        @change="changeRegion"
                                        label="Регионы"
                                        class="col-12"
                                        :close-on-select="false"
                                        mode="multiple"
                                        multiple
                                        multiple-property="label"
                                        :options="
                                            async () => {
                                                await FETCH_REGION_LIST();
                                                return REGION_LIST.filter(elem =>
                                                    Number.isInteger(elem.value)
                                                );
                                            }
                                        "
                                    />
                                    <Input
                                        v-model="form.maxDistanceFromMKAD"
                                        maska="###"
                                        :v="v$.form.maxDistanceFromMKAD"
                                        placeholder="не более"
                                        label="Удаленность от МКАД"
                                        unit="км"
                                        type="number"
                                        reactive
                                        class="col-6"
                                    />
                                    <MultiSelect
                                        v-model="form.status"
                                        label="Статус"
                                        class="col-6"
                                        :options="entityOptions.request.status"
                                    />
                                    <CheckboxOptions
                                        v-model="form.gateTypes"
                                        :options="GateTypeList"
                                        class="col-12"
                                        label="Тип ворот"
                                    />
                                    <CheckboxOptions
                                        v-model="form.objectClasses"
                                        :options="ObjectClassList"
                                        class="col-12"
                                        label="Классы"
                                    />
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="row">
                                    <AnimationTransition>
                                        <div
                                            v-if="form.regions.find(item => item == 1)"
                                            class="col-12 mb-2"
                                        >
                                            <span class="form__subtitle">Дополнительно</span>
                                            <div class="form__row mt-1">
                                                <CheckboxChip
                                                    v-model="form.region_neardy"
                                                    :value="form.region_neardy"
                                                    text="Регионы рядом с МО"
                                                    class="w-100"
                                                />
                                            </div>
                                        </div>
                                    </AnimationTransition>
                                    <AnimationTransition>
                                        <div
                                            v-if="form.regions.find(item => item == 1)"
                                            class="col-12 mb-2"
                                        >
                                            <span class="form__subtitle">Направления МО</span>
                                            <div class="form__row mt-1">
                                                <CheckboxChip
                                                    v-for="(directionItem, index) in DirectionList"
                                                    :key="index"
                                                    v-model="form.directions"
                                                    :value="index"
                                                    :text="directionItem.short"
                                                />
                                            </div>
                                        </div>
                                    </AnimationTransition>
                                    <AnimationTransition>
                                        <div
                                            v-if="form.regions.find(item => item == 6)"
                                            class="col-12 mb-2"
                                        >
                                            <span class="form__subtitle">Округа Москвы</span>
                                            <div class="form__row mt-1">
                                                <CheckboxChip
                                                    v-for="(districtItem, index) in DistrictList"
                                                    :key="index"
                                                    v-model="form.districts"
                                                    :value="index"
                                                    :text="districtItem"
                                                />
                                            </div>
                                        </div>
                                    </AnimationTransition>
                                    <AnimationTransition>
                                        <div
                                            v-if="form.regions.find(item => item == 6)"
                                            class="col-12"
                                        >
                                            <span class="form__subtitle">МКАД</span>
                                            <div class="form__row mt-1">
                                                <RadioChip
                                                    v-for="(mkadOption, index) in OutsideMkad"
                                                    :key="index"
                                                    v-model="form.outside_mkad"
                                                    :label="mkadOption"
                                                    :value="index"
                                                    unselect
                                                />
                                            </div>
                                        </div>
                                    </AnimationTransition>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup class="mt-2">
                            <SwitchSlider v-model="form.heated" class="col-6" label="Отопление" />
                            <SwitchSlider v-model="form.water" class="col-6" label="Вода" />
                            <SwitchSlider v-model="form.gaz" class="col-6" label="Газ" />
                            <SwitchSlider v-model="form.steam" class="col-6" label="Пар" />
                            <SwitchSlider
                                v-model="form.sewerage"
                                class="col-6"
                                label="Канализация"
                            />
                            <SwitchSlider v-model="form.shelving" class="col-6" label="Стелажи" />
                            <SwitchSlider
                                v-model="form.trainLine"
                                class="col-6"
                                label="Ж/Д ветка"
                            />
                            <SwitchSlider v-model="form.haveCranes" class="col-6" label="Краны" />
                        </FormGroup>
                        <FormGroup class="mt-3">
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
                        <FormGroup class="mt-3">
                            <ObjectTypePicker
                                v-model:value="form.objectTypes"
                                v-model:extra="form.objectTypesGeneral"
                                :extra-value="1"
                                label="Склад"
                                :options="objectPurposesWithSectionsOptions.warehouse"
                                class="col-md-4"
                            />
                            <ObjectTypePicker
                                v-model:value="form.objectTypes"
                                v-model:extra="form.objectTypesGeneral"
                                :extra-value="2"
                                label="Производство"
                                :options="objectPurposesWithSectionsOptions.production"
                                class="col-md-4"
                            />
                            <ObjectTypePicker
                                v-model:value="form.objectTypes"
                                v-model:extra="form.objectTypesGeneral"
                                :extra-value="3"
                                label="Участок"
                                :options="objectPurposesWithSectionsOptions.plot"
                                class="col-md-4"
                            />
                        </FormGroup>
                    </div>
                </Form>
            </Modal>
        </teleport>
    </Form>
</template>

<script setup>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { useStore } from 'vuex';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import {
    areaRangeValidators,
    ceilingHeightValidators,
    dateRangeValidators,
    pricePerFloorValidators
} from '@//validators/fields';
import useVuelidate from '@vuelidate/core';
import { onlyPositiveNumber } from '@//validators';
import Modal from '@/components/common/Modal.vue';
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';
import { useSearchForm } from '@/composables/useSearchForm.js';
import { useRoute, useRouter } from 'vue-router';
import { computed, onBeforeMount, reactive, shallowRef } from 'vue';
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    OutsideMkad
} from '@/const/const.js';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import { entityOptions } from '@/const/options/options.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

defineProps({
    withoutConsultant: {
        type: Boolean,
        default: false
    }
});

const formTemplate = {
    all: null,
    status: null,
    consultant_id: null,
    dateStart: null,
    dateEnd: null,
    objectTypes: [],
    objectTypesGeneral: [],
    rangeMinArea: null,
    rangeMaxArea: null,
    rangeMinPricePerFloor: null,
    rangeMaxPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    maxDistanceFromMKAD: null,
    water: null,
    gaz: null,
    steam: null,
    sewerage: null,
    shelving: null,
    objectClasses: [],
    haveCranes: null,
    heated: null,
    maxElectricity: null,
    antiDustOnly: null,
    expressRequest: null,
    firstFloorOnly: null,
    trainLine: null,
    gateTypes: [],
    dealType: null,
    regions: [],
    districts: [],
    directions: [],
    outside_mkad: null,
    region_neardy: null
};

const form = reactive({ ...formTemplate });
const extraIsVisible = shallowRef(false);

const REGION_LIST = computed(() => store.getters.REGION_LIST);

const formCeilingHeightValidators = computed(() =>
    ceilingHeightValidators(form.rangeMaxCeilingHeight)
);
const formDateValidators = computed(() => dateRangeValidators(form.dateEnd));
const formPricePerFloorValidators = computed(() =>
    pricePerFloorValidators(form.rangeMaxPricePerFloor)
);
const formAreaValidators = computed(() => areaRangeValidators(form.rangeMaxArea));
const pricePerFloorUnit = computed(() => {
    if (form.dealType === null || form.dealType === undefined || form.dealType === 1) return '₽';
    return '₽ за м<sup>2</sup>/год';
});

const FETCH_REGION_LIST = () => store.dispatch('FETCH_REGION_LIST');
const FETCH_CONSULTANT_LIST = () => store.dispatch('FETCH_CONSULTANT_LIST');

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

const setQueryFields = async () => {
    Object.assign(form, route.query);

    if (form.objectClasses && !Array.isArray(form.objectClasses)) {
        form.objectClasses = [form.objectClasses];
    }
    if (form.gateTypes && !Array.isArray(form.gateTypes)) {
        form.gateTypes = [form.gateTypes];
    }
    if (form.gateTypesGeneral && !Array.isArray(form.gateTypesGeneral)) {
        form.gateTypesGeneral = [form.gateTypesGeneral];
    }
    if (form.objectTypes && !Array.isArray(form.objectTypes)) {
        form.objectTypes = [form.objectTypes];
    }
    if (form.objectTypesGeneral && !Array.isArray(form.objectTypesGeneral)) {
        form.objectTypesGeneral = [form.objectTypesGeneral];
    }
    if (form.regions && !Array.isArray(form.regions)) {
        form.regions = [form.regions];
    }
    if (form.districts && !Array.isArray(form.districts)) {
        form.districts = [form.districts];
    }
    if (form.directions && !Array.isArray(form.directions)) {
        form.directions = [form.directions];
    }

    if (form.objectTypes) {
        form.objectTypes = form.objectTypes.map(Number);
    }
    if (form.objectTypesGeneral) {
        form.objectTypesGeneral = form.objectTypesGeneral.map(Number);
    }

    let query = { ...form };
    deleteEmptyFields(query);
    await router.replace({ query });
};

const rules = {
    form: {
        maxDistanceFromMKAD: {
            min: onlyPositiveNumber('Некорректная отрицательная удаленность')
        },
        maxElectricity: {
            min: onlyPositiveNumber()
        }
    }
};

const v$ = useVuelidate(rules, { form });
const { filtersCount, resetForm } = useSearchForm(form, {
    template: formTemplate,
    syncWithQuery: true,
    setQuery: setQueryFields
});

onBeforeMount(() => {
    if (form.regions?.length) FETCH_REGION_LIST();
});
</script>
