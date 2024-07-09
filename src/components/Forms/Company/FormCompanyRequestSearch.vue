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
            <Modal
                v-if="extraIsVisible"
                @close="extraIsVisible = false"
                title="Фильтры по сделкам"
                width="1400"
            >
                <Form>
                    <div class="form-search__extra col-12">
                        <div class="row">
                            <MultiSelect
                                v-model="form.consultant_id"
                                :disabled="withoutConsultant"
                                label="Консультант"
                                class="col-md-4 col-6 mb-2"
                                :options="
                                    async () => {
                                        return await FETCH_CONSULTANT_LIST();
                                    }
                                "
                            />
                            <MultiSelect
                                v-model="form.dealType"
                                label="Тип сделки"
                                class="col-md-2 col-6 mb-2"
                                :options="DealTypeList"
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
                                class="col-md-3 col-6 mb-2"
                            />
                            <Input
                                v-model="form.maxElectricity"
                                placeholder="не более"
                                :v="v$.form.maxElectricity"
                                maska="##########"
                                label="Электричество"
                                unit="кВт"
                                type="number"
                                class="col-md-3 col-6 mb-2"
                            />
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
                        </div>
                        <div class="row mt-2">
                            <div class="col-8">
                                <div class="row">
                                    <MultiSelect
                                        v-model="form.regions"
                                        @change="changeRegion"
                                        label="Регионы"
                                        class="col-12"
                                        mode="multiple"
                                        :close-on-select="false"
                                        :options="
                                            async () => {
                                                await FETCH_REGION_LIST();
                                                return REGION_LIST.filter(elem =>
                                                    Number.isInteger(elem.value)
                                                );
                                            }
                                        "
                                    />
                                    <div v-if="form.regions?.length" class="col-12">
                                        <div class="form__row mt-1">
                                            <Chip
                                                v-for="(region, index) in checkedRegions"
                                                :key="index"
                                                @click="removeRegion"
                                                :value="index"
                                                :html="region.label"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-7 mt-2">
                                        <span class="form__subtitle">Тип ворот</span>
                                        <div class="form__row mt-1">
                                            <CheckboxChip
                                                v-for="(gateType, index) in GateTypeList"
                                                :key="index"
                                                v-model="form.gateTypes"
                                                :value="index"
                                                :text="gateType"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-2 mt-2">
                                        <span class="form__subtitle">Отапливаемый</span>
                                        <div class="form__row mt-1">
                                            <RadioChip
                                                v-model="form.heated"
                                                label="Нет"
                                                :value="0"
                                                unselect
                                            />
                                            <RadioChip
                                                v-model="form.heated"
                                                label="Да"
                                                :value="1"
                                                unselect
                                            />
                                        </div>
                                    </div>
                                    <div class="col-3 mt-2">
                                        <span class="form__subtitle">Статус</span>
                                        <div class="form__row mt-1">
                                            <RadioChip
                                                v-model="form.status"
                                                label="Пассив"
                                                :value="0"
                                                unselect
                                            />
                                            <RadioChip
                                                v-model="form.status"
                                                label="Актив"
                                                :value="1"
                                                unselect
                                            />
                                        </div>
                                    </div>
                                    <div class="col-7 mt-2">
                                        <span class="form__subtitle">Классы</span>
                                        <div class="form__row mt-1">
                                            <CheckboxChip
                                                v-for="(classItem, index) in ObjectClassList"
                                                :key="index"
                                                v-model="form.objectClasses"
                                                :value="index"
                                                :text="classItem"
                                            />
                                        </div>
                                    </div>
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
                            <div class="col-12 mt-2">
                                <span class="form__subtitle">Прочее</span>
                                <div class="form__row mt-1">
                                    <CheckboxChip
                                        v-model="form.water"
                                        :value="form.water"
                                        text="Вода"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.gaz"
                                        :value="form.gaz"
                                        text="Газ"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.steam"
                                        :value="form.steam"
                                        text="Пар"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.sewerage"
                                        :value="form.sewerage"
                                        text="Канализация"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.shelving"
                                        :value="form.shelving"
                                        text="Стелажи"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.trainLine"
                                        :value="form.trainLine"
                                        text="Ж/Д ветка"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.haveCranes"
                                        :value="form.haveCranes"
                                        text="Краны"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.firstFloorOnly"
                                        :value="form.firstFloorOnly"
                                        text="Только 1 этаж"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.antiDustOnly"
                                        :value="form.antiDustOnly"
                                        text="Только антипыль"
                                        multiple
                                    />
                                    <CheckboxChip
                                        v-model="form.expressRequest"
                                        :value="form.expressRequest"
                                        text="Срочный запрос"
                                        multiple
                                    />
                                </div>
                            </div>
                        </div>
                        <FormGroup class="my-2">
                            <Checkbox
                                v-model="form.objectTypesGeneral"
                                class="col-12 large bg"
                                label="Тип объекта"
                                :options="ObjectTypesGeneralList"
                            />
                        </FormGroup>
                        <FormGroup>
                            <CheckboxIcons
                                v-model="form.objectTypes"
                                class="col pr-1"
                                :options="ObjectTypeList.warehouse"
                            />
                            <CheckboxIcons
                                v-model="form.objectTypes"
                                class="col pr-1"
                                :options="ObjectTypeList.production"
                            />
                            <CheckboxIcons
                                v-model="form.objectTypes"
                                class="col"
                                :options="ObjectTypeList.plot"
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
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import { useStore } from 'vuex';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Chip from '@/components/common/Chip.vue';
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
import { computed, onBeforeMount, onMounted, reactive, shallowRef } from 'vue';
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    ObjectTypeList,
    ObjectTypesGeneralList,
    OutsideMkad
} from '@/const/const.js';

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
const checkedRegions = computed(() => {
    if (REGION_LIST.value) {
        return form.regions.map(element => ({
            id: element,
            label: REGION_LIST.value.find(region => region.value == element).label
        }));
    }

    return [];
});

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
    if (form.regions == null) {
        form.directions = [];
        form.districts = [];
    }
    if (!form.regions.some(item => item == 1)) {
        form.directions = [];
        form.region_neardy = null;
    }
    if (!form.regions.some(item => item == 6)) {
        form.districts = [];
        form.outside_mkad = null;
    }
};

const removeRegion = index => {
    form.regions.splice(index, 1);
    changeRegion();
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
        form.objectTypes = form.objectTypes.map(element => +element);
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
const { filtersCount, resetForm } = useSearchForm(form, () => {}, {
    url: true,
    setQuery: setQueryFields,
    template: formTemplate
});

onBeforeMount(() => {
    if (form.regions?.length) FETCH_REGION_LIST();
});
</script>
