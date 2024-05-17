<template>
    <Form @submit="onSubmit">
        <FormGroup>
            <div class="col-12">
                <div class="d-flex align-items-end">
                    <Input
                        v-model="form.all"
                        @keydown.enter="onSubmit"
                        label="Поиск"
                        class="w-100"
                        placeholder="ID запроса, название компании"
                    />
                    <div class="form-search__actions ml-4">
                        <Button @click="extraVisible = !extraVisible" :badge="filterCount || false">
                            <span>Фильтры</span>
                        </Button>
                        <Button @click="resetForm" :disabled="!filterCount" danger>
                            Сбросить фильтры
                        </Button>
                    </div>
                </div>
            </div>
        </FormGroup>
        <teleport to="body">
            <Modal
                v-if="extraVisible"
                @close="extraVisible = false"
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
                                :options="dealTypeList"
                            />
                            <Input
                                v-model="form.maxDistanceFromMKAD"
                                maska="###"
                                :v="v$.form.maxDistanceFromMKAD"
                                placeholder="не более"
                                label="Удаленность от МКАД"
                                unit="км"
                                type="number"
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
                                    <div v-if="form.regions.length" class="col-12">
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
                                                v-for="(gateType, index) in gateTypeList"
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
                                                v-for="(classItem, index) in objectClassList"
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
                                                    v-for="(directionItem, index) in directionList"
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
                                                    v-for="(districtItem, index) in districtList"
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
                                                    v-for="(
                                                        mkadOption, index
                                                    ) in outsideMkadOptions"
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
                                :options="objectTypesGeneralList"
                            />
                        </FormGroup>
                        <FormGroup>
                            <CheckboxIcons
                                v-model="form.objectTypes"
                                class="col pr-1"
                                :options="objectTypeListWareHouse"
                            />
                            <CheckboxIcons
                                v-model="form.objectTypes"
                                class="col pr-1"
                                :options="objectTypeListProduction"
                            />
                            <CheckboxIcons
                                v-model="form.objectTypes"
                                class="col"
                                :options="objectTypeListPlot"
                            />
                        </FormGroup>
                    </div>
                </Form>
            </Modal>
        </teleport>
    </Form>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import {
    ActivePassive,
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    ObjectTypeList,
    ObjectTypesGeneralList,
    OutsideMkad,
    RegionList,
    YesNo
} from '@/const/const.js';
import { SearchFormMixin } from '@/components/common/mixins.js';
import { mapActions, mapGetters } from 'vuex';
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

export default {
    name: 'FormCompanyRequestSearch',
    components: {
        Modal,
        DoubleInput,
        RadioChip,
        CheckboxChip,
        Chip,
        AnimationTransition,
        Button,
        Form,
        FormGroup,
        Input,
        MultiSelect,
        CheckboxIcons,
        Checkbox
    },
    mixins: [SearchFormMixin],
    props: {
        withoutConsultant: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            v$: useVuelidate()
        };
    },
    computed: {
        ...mapGetters(['REGION_LIST']),
        activePassiveOptions: () => ActivePassive,
        objectTypeListWareHouse: () => ObjectTypeList.warehouse,
        objectTypeListProduction: () => ObjectTypeList.production,
        objectTypeListPlot: () => ObjectTypeList.plot,
        yesNoOptions: () => YesNo,
        outsideMkadOptions: () => OutsideMkad,
        objectClassList: () => ObjectClassList,
        gateTypeList: () => GateTypeList,
        dealTypeList: () => DealTypeList,
        regionList: () => RegionList,
        directionList: () => DirectionList,
        districtList: () => DistrictList,
        objectTypesGeneralList: () => ObjectTypesGeneralList,
        checkedRegions() {
            if (this.REGION_LIST) {
                return this.form.regions.map(element => ({
                    id: element,
                    label: this.REGION_LIST.find(region => region.value == element).label
                }));
            }

            return [];
        },
        formCeilingHeightValidators() {
            return ceilingHeightValidators(this.form.rangeMaxCeilingHeight);
        },
        formDateValidators() {
            return dateRangeValidators(this.form.dateEnd);
        },
        formPricePerFloorValidators() {
            return pricePerFloorValidators(this.form.rangeMaxPricePerFloor);
        },
        formAreaValidators() {
            return areaRangeValidators(this.form.rangeMaxArea);
        },
        pricePerFloorUnit() {
            if (
                this.form.dealType === null ||
                this.form.dealType === undefined ||
                this.form.dealType === 1
            )
                return '₽';
            return '₽ за м<sup>2</sup>/год';
        }
    },
    validations() {
        return {
            form: {
                maxDistanceFromMKAD: {
                    min: onlyPositiveNumber('Некорректная отрицательная удаленность')
                },
                maxElectricity: {
                    min: onlyPositiveNumber()
                }
            }
        };
    },
    defaultFormProperties: {
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
    },
    methods: {
        ...mapActions(['FETCH_REGION_LIST']),
        removeRegion(index) {
            this.form.regions.splice(index, 1);
            this.changeRegion();
        },
        changeRegion() {
            if (this.form.regions == null) {
                this.form.directions = [];
                this.form.districts = [];
            }
            if (!this.form.regions.find(item => item == 1)) {
                this.form.directions = [];
                this.form.region_neardy = null;
            }
            if (!this.form.regions.find(item => item == 6)) {
                this.form.districts = [];
                this.form.outside_mkad = null;
            }
        },
        async setQueryFields() {
            this.form = { ...this.form, ...this.$route.query };
            if (this.form.objectClasses && !Array.isArray(this.form.objectClasses)) {
                this.form.objectClasses = [this.form.objectClasses];
            }
            if (this.form.gateTypes && !Array.isArray(this.form.gateTypes)) {
                this.form.gateTypes = [this.form.gateTypes];
            }
            if (this.form.gateTypesGeneral && !Array.isArray(this.form.gateTypesGeneral)) {
                this.form.gateTypesGeneral = [this.form.gateTypesGeneral];
            }
            if (this.form.objectTypes && !Array.isArray(this.form.objectTypes)) {
                this.form.objectTypes = [this.form.objectTypes];
            }
            if (this.form.regions && !Array.isArray(this.form.regions)) {
                this.form.regions = [this.form.regions];
            }
            if (this.form.districts && !Array.isArray(this.form.districts)) {
                this.form.districts = [this.form.districts];
            }
            if (this.form.directions && !Array.isArray(this.form.directions)) {
                this.form.directions = [this.form.directions];
            }
            let array = [];
            this.form.objectTypes.forEach(item => {
                array.push(+item);
            });
            this.form.objectTypes = array;
            let query = { ...this.form };
            this.deleteEmptyFields(query);
            await this.$router.replace({ query });
        }
    },
    async mounted() {
        if (this.form.regions.length) {
            await this.FETCH_REGION_LIST();
        }
    }
};
</script>

<style></style>
