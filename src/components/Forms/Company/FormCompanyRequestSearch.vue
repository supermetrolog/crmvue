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
            <FormGroup>
                <MultiSelect
                    v-model="form.consultant_id"
                    label="Консультант"
                    class="col-md-4 col-6 pr-1"
                    :options="
                        async () => {
                            return await FETCH_CONSULTANT_LIST();
                        }
                    "
                />

                <MultiSelect
                    v-model="form.dealType"
                    label="Тип сделки"
                    class="col-md-2 col-6 pr-1"
                    :options="dealTypeList"
                />
                <Input
                    v-model="form.maxDistanceFromMKAD"
                    maska="###"
                    placeholder="не более"
                    label="Удаленность от МКАД"
                    class="col-md-3 col-6 pr-1"
                />
                <Input
                    v-model="form.maxElectricity"
                    placeholder="не более"
                    maska="##########"
                    label="Электричесвто (квт)"
                    class="col-md-3 col-6"
                />
            </FormGroup>
            <FormGroup class="mb-2">
                <Input
                    v-model="form.rangeMinArea"
                    maska="##########"
                    label="S пола (м^2)"
                    placeholder="От:"
                    class="col-md-3 col-12 pr-1"
                >
                    <Input v-model="form.rangeMaxArea" maska="##########" placeholder="До:" class="col-12 p-0 pt-1" />
                </Input>
                <Input
                    v-model="form.rangeMinPricePerFloor"
                    maska="##########"
                    placeholder="От:"
                    label="Цена за пол (м^2/год)"
                    class="col-md-3 col-12 pr-1"
                >
                    <Input
                        v-model="form.rangeMaxPricePerFloor"
                        maska="##########"
                        placeholder="До:"
                        class="col-12 p-0 pt-1"
                    />
                </Input>
                <Input
                    v-model="form.rangeMinCeilingHeight"
                    maska="##########"
                    label="Высота потолков"
                    placeholder="От:"
                    class="col-md-3 col-12 pr-1"
                >
                    <Input
                        v-model="form.rangeMaxCeilingHeight"
                        maska="##########"
                        placeholder="До:"
                        class="col-12 p-0 pt-1"
                    />
                </Input>
                <Input v-model="form.dateStart" label="Дата От и До" class="col-md-3 col-12" type="date">
                    <Input v-model="form.dateEnd" class="col-12 p-0 pt-1" type="date" />
                </Input>
            </FormGroup>
            <FormGroup class="mb-2">
                <MultiSelect
                    v-model="form.regions"
                    @change="changeRegion"
                    label="Регионы"
                    class="col-md-4 col-12 pr-1"
                    mode="multiple"
                    :close-on-select="false"
                    :options="
                        async () => {
                            await FETCH_REGION_LIST();
                            return REGION_LIST.filter(elem => Number.isInteger(elem.value));
                        }
                    "
                >
                    <template v-if="REGION_LIST">
                        <small v-for="(region, index) in form.regions" :key="region" class="d-block px-3">
                            {{ index + 1 }}.
                            {{ REGION_LIST.find(item => item.value == region).label }}
                        </small>
                    </template>
                    <Checkbox
                        v-if="form.regions.find(item => item == 1)"
                        v-model="form.region_neardy"
                        label="Регионы рядом с МО"
                        class="col-12 large p-0 mt-2"
                    />
                    <Radio
                        v-if="form.regions.find(item => item == 6)"
                        v-model="form.outside_mkad"
                        :unselect-mode="true"
                        class="col-12 large p-0"
                        :options="outsideMkadOptions"
                    />
                </MultiSelect>

                <Checkbox
                    v-if="form.regions.find(item => item == 1)"
                    v-model="form.directions"
                    class="col-md-2 col-12 pr-1"
                    label="Направления МО"
                    :options="directionList"
                />

                <Checkbox
                    v-if="form.regions.find(item => item == 6)"
                    v-model="form.districts"
                    class="col-4 pr-1"
                    label="Округа Москвы"
                    :options="districtList"
                />
            </FormGroup>
            <FormGroup class="mb-2">
                <Checkbox
                    v-model="form.gateTypes"
                    class="col-md-4 col-12 pr-1"
                    label="Тип ворот"
                    :options="gateTypeList"
                />
                <Checkbox
                    v-model="form.objectClasses"
                    class="col-md col-12"
                    label="Классы"
                    :options="objectClassList"
                />
                <!-- <Radio
                  v-model="form.haveCranes"
                  :unselectMode="true"
                  label="Наличие кранов"
                  class="col-2 text-center pr-1"
                  :options="yesNoOptions"
                /> -->

                <Radio
                    v-model="form.heated"
                    :unselect-mode="true"
                    label="Отапливаемый"
                    class="col text-center"
                    :options="yesNoOptions"
                />
                <Radio
                    v-model="form.status"
                    :options="activePassiveOptions"
                    :unselect-mode="true"
                    label="Статус"
                    class="col text-center"
                />
                <!-- <Radio
                  v-model="form.trainLine"
                  :unselectMode="true"
                  label="Ж/Д ветка"
                  class="col-2 text-center"
                  :options="yesNoOptions"
                /> -->
            </FormGroup>
            <FormGroup class="mb-2">
                <Checkbox v-model="form.haveCranes" class="col large text-center" label="Краны" />
                <Checkbox v-model="form.water" class="col large text-center" label="Вода" />
                <Checkbox v-model="form.gaz" class="col large text-center" label="Газ" />
                <Checkbox v-model="form.steam" class="col large text-center" label="Пар" />
                <Checkbox v-model="form.sewerage" class="col large text-center" label="КНС" />
                <Checkbox v-model="form.shelving" class="col large text-center" label="Стеллажи" />
                <Checkbox v-model="form.trainLine" class="col large text-center" label="Ж/Д ветка" />
            </FormGroup>
            <FormGroup class="mb-2">
                <Checkbox v-model="form.antiDustOnly" class="col large text-center" label="Только антипыль" />
                <Checkbox v-model="form.firstFloorOnly" class="col large text-center" label="Только 1 этаж" />
                <Checkbox v-model="form.expressRequest" class="col large text-center" label="Срочный запрос" />
            </FormGroup>

            <FormGroup class="mb-2">
                <Checkbox
                    v-model="form.objectTypesGeneral"
                    class="col-12 large bg"
                    label="Тип объекта"
                    :options="objectTypesGeneralList"
                />
            </FormGroup>

            <FormGroup>
                <CheckboxIcons v-model="form.objectTypes" class="col pr-1" :options="objectTypeListWareHouse" />
                <CheckboxIcons v-model="form.objectTypes" class="col pr-1" :options="objectTypeListProduction" />
                <CheckboxIcons v-model="form.objectTypes" class="col" :options="objectTypeListPlot" />
            </FormGroup>
            <!-- <FormGroup class="mb-2">
              <CheckboxIcons
                v-model="form.objectTypes"
                label="Тип объекта"
                extraLabel="склад"
                class="col-4 pr-2 mx-auto"
                :options="objectTypeListWareHouse"
              />
              <CheckboxIcons
                v-model="form.objectTypes"
                extraLabel="производство"
                class="col-4 mt-4 pr-2 mx-auto"
                :options="objectTypeListProduction"
              />
              <CheckboxIcons
                v-model="form.objectTypes"
                extraLabel="участок"
                class="col-4 mt-4 mx-auto"
                :options="objectTypeListPlot"
              />
            </FormGroup> -->
        </div>
    </Form>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import Radio from '@/components/common/Forms/Radio.vue';
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

export default {
    name: 'FormCompanyRequestSearch',
    components: {
        AnimationTransition,
        Button,
        Form,
        FormGroup,
        Input,
        Radio,
        MultiSelect,
        CheckboxIcons,
        Checkbox
    },
    mixins: [SearchFormMixin],
    data() {
        return {
            activePassiveOptions: ActivePassive.get('param'),
            objectTypeListWareHouse: ObjectTypeList.get('warehouse'),
            objectTypeListProduction: ObjectTypeList.get('production'),
            objectTypeListPlot: ObjectTypeList.get('plot'),
            yesNoOptions: YesNo.get('param'),
            outsideMkadOptions: OutsideMkad.get('param'),
            objectClassList: ObjectClassList.get('param'),
            gateTypeList: GateTypeList.get('param'),
            dealTypeList: DealTypeList.get('param'),
            regionList: RegionList.get('param'),
            directionList: DirectionList.get('param'),
            districtList: DistrictList.get('param'),
            objectTypesGeneralList: ObjectTypesGeneralList.get('param')
        };
    },
    computed: {
        ...mapGetters(['REGION_LIST'])
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
    }
};
</script>

<style></style>