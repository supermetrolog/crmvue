<template>
    <Form @submit="onSubmit" class="row">
        <div class="col-8">
            <Input
                v-model="form.all"
                @keydown.enter="onSubmit"
                label="Поиск"
                placeholder="ID запроса, название компании"
            />
        </div>
        <div class="col-4 align-self-end">
            <div class="form-search__actions">
                <Button @click="extraVisible = !extraVisible" icon :badge="filterCount || false">
                    <span>Фильтры</span>
                    <i v-if="extraVisible" class="fas fa-angle-up"></i>
                    <i v-else class="fas fa-angle-down"></i>
                </Button>
                <AnimationTransition>
                    <Button v-if="filterCount" @click="resetForm" danger>Сбросить фильтры</Button>
                </AnimationTransition>
            </div>
        </div>
        <div v-show="extraVisible" class="form-search__extra col-12">
            <div class="row">
                <MultiSelect
                    v-model="form.consultant_id"
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
                    placeholder="не более"
                    label="Удаленность от МКАД"
                    unit="км"
                    class="col-md-3 col-6 mb-2"
                />
                <Input
                    v-model="form.maxElectricity"
                    placeholder="не более"
                    maska="##########"
                    label="Электричесвто"
                    unit="кВт"
                    class="col-md-3 col-6 mb-2"
                />
                <div class="col-md-3 col-6">
                    <div class="row">
                        <Input
                            v-model="form.rangeMinArea"
                            maska="##########"
                            label="S пола (м^2)"
                            placeholder="От:"
                            class="col-12"
                            unit="м<sup>2</sup>"
                            type="number"
                        />
                        <Input
                            v-model="form.rangeMaxArea"
                            maska="##########"
                            placeholder="До:"
                            class="col-12 mt-1"
                            unit="м<sup>2</sup>"
                            type="number"
                        />
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="row">
                        <Input
                            v-model="form.rangeMinPricePerFloor"
                            maska="##########"
                            placeholder="От:"
                            label="Цена за пол (м^2/год)"
                            unit="м<sup>2</sup>/год"
                            class="col-12"
                            type="number"
                        />
                        <Input
                            v-model="form.rangeMaxPricePerFloor"
                            maska="##########"
                            placeholder="До:"
                            class="col-12 mt-1"
                            unit="м<sup>2</sup>/год"
                            type="number"
                        />
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="row">
                        <Input
                            v-model="form.rangeMinCeilingHeight"
                            maska="##########"
                            label="Высота потолков"
                            placeholder="От:"
                            unit="м"
                            class="col-12"
                            type="number"
                        />
                        <Input
                            v-model="form.rangeMaxCeilingHeight"
                            maska="##########"
                            placeholder="До:"
                            unit="м"
                            class="col-12 mt-1"
                            type="number"
                        />
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="row">
                        <Input
                            v-model="form.dateStart"
                            label="Дата От и До"
                            class="col-12"
                            type="date"
                        />
                        <Input v-model="form.dateEnd" class="col-12 mt-1" type="date" />
                    </div>
                </div>
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
                                    return REGION_LIST.filter(elem => Number.isInteger(elem.value));
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
                                <RadioChip v-model="form.heated" label="Нет" :value="0" unselect />
                                <RadioChip v-model="form.heated" label="Да" :value="1" unselect />
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
                            <div v-if="form.regions.find(item => item == 1)" class="col-12 mb-2">
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
                            <div v-if="form.regions.find(item => item == 1)" class="col-12 mb-2">
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
                            <div v-if="form.regions.find(item => item == 6)" class="col-12 mb-2">
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
                            <div v-if="form.regions.find(item => item == 6)" class="col-12">
                                <span class="form__subtitle">МКАД</span>
                                <div class="form__row mt-1">
                                    <RadioChip
                                        v-for="(mkadOption, index) in outsideMkadOptions"
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
                        <CheckboxChip v-model="form.water" :value="form.water" text="Вода" />
                        <CheckboxChip v-model="form.gas" :value="form.gas" text="Газ" />
                        <CheckboxChip v-model="form.steam" :value="form.steam" text="Пар" />
                        <CheckboxChip
                            v-model="form.sewage_central"
                            :value="form.sewage_central"
                            text="Канализация"
                        />
                        <CheckboxChip v-model="form.racks" :value="form.racks" text="Стелажи" />
                        <CheckboxChip
                            v-model="form.railway"
                            :value="form.railway"
                            text="Ж/Д ветка"
                        />
                        <CheckboxChip
                            v-model="form.has_cranes"
                            :value="form.has_cranes"
                            text="Краны"
                        />
                        <CheckboxChip
                            v-model="form.firstFloorOnly"
                            :value="form.firstFloorOnly"
                            text="Только 1 этаж"
                        />
                        <CheckboxChip
                            v-model="form.antiDustOnly"
                            :value="form.antiDustOnly"
                            text="Только антипыль"
                        />
                        <CheckboxChip
                            v-model="form.expressRequest"
                            :value="form.expressRequest"
                            text="Срочный запрос"
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

export default {
    name: 'FormCompanyRequestSearch',
    components: {
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
        }
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
