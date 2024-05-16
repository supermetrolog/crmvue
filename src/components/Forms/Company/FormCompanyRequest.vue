<template>
    <Modal
        @close="clickCloseModal"
        :title="!formdata ? 'Создание запроса' : 'Изменение запроса'"
        class="modal-form-company-request"
    >
        <Form @submit="onSubmit">
            <Loader v-if="loader" class="center" />
            <FormGroup class="mb-2">
                <Input v-model="form.name" label="Название" class="col-12" />
            </FormGroup>
            <FormGroup class="mb-2">
                <MultiSelect
                    v-model="form.company_id"
                    @change="onChangeCompany"
                    extra-classes="long-text"
                    label="Компания"
                    required
                    class="col-6"
                    :v="v$.form.company_id"
                    :filterResults="false"
                    :min-chars="1"
                    :resolve-on-load="true"
                    :delay="0"
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
                    class="col-6"
                    :disabled="!form.company_id"
                    :v="v$.form.contact_id"
                    :options="contactOptions"
                />
            </FormGroup>
            <FormGroup class="mb-2">
                <MultiSelect
                    v-model="form.dealType"
                    :v="v$.form.dealType"
                    required
                    label="Тип сделки"
                    class="col-4"
                    :options="dealTypeList"
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
                    :v="v$.form.regions"
                    label="Регионы"
                    class="col-4"
                    :close-on-select="false"
                    :hide-selected="false"
                    mode="multiple"
                    name="region"
                    required
                    :options="
                        async () => {
                            await FETCH_REGION_LIST();
                            return REGION_LIST.filter(elem => Number.isInteger(elem.value));
                        }
                    "
                />
                <div class="col-8 mt-2">
                    <div class="row">
                        <AnimationTransition>
                            <div
                                v-if="form.regions.find(item => item.region == 1)"
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
                                v-if="form.regions.find(item => item.region == 1)"
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
                                        property="direction"
                                    />
                                </div>
                            </div>
                        </AnimationTransition>
                        <AnimationTransition>
                            <div
                                v-if="form.regions.find(item => item.region == 6)"
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
                                        property="district"
                                    />
                                </div>
                            </div>
                        </AnimationTransition>
                        <AnimationTransition>
                            <div v-if="form.regions.find(item => item.region == 6)" class="col-12">
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
                <div v-if="form.regions.length" class="col-4">
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
            </FormGroup>
            <FormGroup class="mb-2">
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
                    <CheckboxChip
                        v-model="form.distanceFromMKADnotApplicable"
                        @change="changeDistanceFromMKADnotApplicable"
                        :value="form.distanceFromMKADnotApplicable"
                        text="Неприменимо - регион или Москва"
                        class="mt-1"
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
                        <RadioChip
                            v-for="(option, index) in unknownMovingDateOptions"
                            :key="index"
                            v-model="form.unknownMovingDate"
                            @change.stop="form.movingDate = null"
                            :label="option"
                            :value="index"
                            unselect
                        />
                    </div>
                </div>
                <Input
                    v-model="form.pricePerFloor"
                    maska="##########"
                    label="Цена"
                    unit="₽ за м<sup>2</sup>/год"
                    type="number"
                    class="col-4"
                />
            </FormGroup>
            <FormGroup class="mb-2">
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
            <FormGroup class="mb-2">
                <div class="col-4 mt-2">
                    <span class="form__subtitle">Тип ворот</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="(gateType, index) in gateTypeList"
                            :key="index"
                            v-model="form.gateTypes"
                            :value="index"
                            :text="gateType"
                            property="gate_type"
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
                <div class="col-2 mt-2">
                    <span class="form__subtitle">Классы</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-for="(classItem, index) in objectClassList"
                            :key="index"
                            v-model="form.objectClasses"
                            :value="index"
                            :text="classItem"
                            property="object_class"
                        />
                    </div>
                </div>
            </FormGroup>
            <FormGroup class="mb-2">
                <div class="col-8">
                    <span class="form__subtitle">Прочее</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-model="form.water"
                            :value="form.water"
                            text="Вода"
                            multiple
                        />
                        <CheckboxChip v-model="form.gaz" :value="form.gaz" text="Газ" multiple />
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
                <AnimationTransition>
                    <Input
                        v-if="form.trainLine"
                        v-model="form.trainLineLength"
                        label="Длина ветки"
                        maska="##########"
                        unit="м"
                        type="number"
                        class="col-2"
                    />
                </AnimationTransition>
            </FormGroup>
            <FormGroup class="mb-2">
                <MultiSelect
                    v-if="!form.status"
                    v-model="form.passive_why"
                    :v="v$.form.passive_why"
                    required
                    label="Причина пассива"
                    class="col-5"
                    :options="passiveWhyOptions"
                >
                    <Textarea v-model="form.passive_why_comment" class="col-12 p-0 pt-1" />
                </MultiSelect>
            </FormGroup>
            <FormGroup class="mb-2">
                <Checkbox
                    v-model="form.objectTypesGeneral"
                    @change="changeObjectTypesGeneral"
                    :v="v$.form.objectTypesGeneral"
                    class="col-12 large bg"
                    label="Тип объекта"
                    name="type"
                    required
                    :options="objectTypesGeneralList"
                />
            </FormGroup>

            <FormGroup>
                <CheckboxIcons
                    v-model="form.objectTypes"
                    @change="changeObjectTypes(0)"
                    class="col pr-1"
                    name="object_type"
                    :options="objectTypeListWareHouse"
                />
                <CheckboxIcons
                    v-model="form.objectTypes"
                    @change="changeObjectTypes(1)"
                    class="col pr-1"
                    name="object_type"
                    :options="objectTypeListProduction"
                />
                <CheckboxIcons
                    v-model="form.objectTypes"
                    @change="changeObjectTypes(2)"
                    class="col"
                    name="object_type"
                    :options="objectTypeListPlot"
                />
            </FormGroup>
            <Textarea v-model="form.description" class="col-12 px-0" label="Описание" />
            <FormGroup></FormGroup>
            <FormGroup class="mt-4">
                <Submit class="col-4 mx-auto">
                    {{ formdata ? 'Сохранить' : 'Создать' }}
                </Submit>
            </FormGroup>
        </Form>
    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    ObjectTypeList,
    ObjectTypesGeneralList,
    OutsideMkad,
    PassiveWhyRequest,
    RegionList,
    unknownMovingDate,
    YesNo
} from '@/const/const.js';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import Submit from '@/components/common/Forms/Submit.vue';
import api from '@//api/api.js';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import Chip from '@/components/common/Chip.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { areaRangeValidators, ceilingHeightValidators } from '@//validators/fields';
import dayjs from 'dayjs';
import { cloneObject } from '@/utils/index.js';

export default {
    name: 'FormCompanyRequest',
    components: {
        DoubleInput,
        Chip,
        RadioChip,
        AnimationTransition,
        CheckboxChip,
        Loader,
        Modal,
        Form,
        FormGroup,
        Input,
        Checkbox,
        MultiSelect,
        Textarea,
        CheckboxIcons,
        Submit
    },
    emits: ['closeCompanyForm', 'created', 'updated'],
    props: {
        formdata: {
            type: Object,
            default: null
        },
        company_id: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            v$: useValidate(),
            productionTypeListVisible: true,
            warehouseTypeListVisible: true,
            plotTypeListVisible: true,
            isOpenDealTypeSelect: false,
            isOpenConsultantSelect: false,
            loader: false,
            contactOptions: [],
            form: {
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
                firstFloorOnly: null, ///
                objectClasses: [],
                heated: null,
                gateTypes: [],
                antiDustOnly: null,
                electricity: '',
                haveCranes: null,
                trainLine: null,
                trainLineLength: null,
                status: 1, //default
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
            }
        };
    },
    computed: {
        ...mapGetters(['CONSULTANT_LIST', 'REGION_LIST']),
        yesNoOptions: () => YesNo,
        outsideMkadOptions: () => OutsideMkad,
        unknownMovingDateOptions: () => unknownMovingDate,
        passiveWhyOptions: () => PassiveWhyRequest,
        objectClassList: () => ObjectClassList,
        gateTypeList: () => GateTypeList,
        objectTypesGeneralList: () => ObjectTypesGeneralList,
        objectTypeListWareHouse: () => ObjectTypeList.warehouse,
        objectTypeListProduction: () => ObjectTypeList.production,
        objectTypeListPlot: () => ObjectTypeList.plot,
        regionList: () => RegionList,
        directionList: () => DirectionList,
        districtList: () => DistrictList,
        dealTypeList: () => DealTypeList,
        checkedRegions() {
            if (this.REGION_LIST) {
                return this.form.regions.map(element => ({
                    id: element.region ?? element,
                    label:
                        this.REGION_LIST.find(region => region.value == (element.region ?? element))
                            .label || 'Некорректный регион'
                }));
            }
            return [];
        },
        formCeilingHeightValidators() {
            return ceilingHeightValidators(this.form.maxCeilingHeight);
        },
        formAreaValidators() {
            return areaRangeValidators(this.form.maxArea);
        }
    },
    validations() {
        return {
            form: {
                regions: {
                    required: helpers.withMessage('выберите регион', required)
                },
                dealType: {
                    required: helpers.withMessage('выберите тип сделки', required)
                },
                objectTypesGeneral: {
                    required: helpers.withMessage('выберите тип объекта', required)
                },
                distanceFromMKAD: {
                    customRequired: helpers.withMessage('Заполните поле', this.customRequired)
                },
                company_id: {
                    required: helpers.withMessage('Выберите компанию', required)
                },
                contact_id: {
                    required: helpers.withMessage('Выберите контакт', required)
                },
                minArea: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                maxArea: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                minCeilingHeight: {
                    required: helpers.withMessage('Заполните поле', required)
                },
                consultant_id: {
                    required: helpers.withMessage('Выберите вариант', required)
                },
                movingDate: {
                    customRequiredForMovingDate: helpers.withMessage(
                        'Заполните поле',
                        this.customRequiredForMovingDate
                    ),
                    maxValue: helpers.withMessage('Неверная дата', this.dateRangeValidator)
                },
                passive_why: {
                    customRequiredPassiveWhy: helpers.withMessage(
                        'Выберите причину',
                        this.customRequiredPassiveWhy
                    )
                }
            }
        };
    },
    methods: {
        ...mapActions([
            'FETCH_CONSULTANT_LIST',
            'CREATE_REQUEST',
            'UPDATE_REQUEST',
            'FETCH_REGION_LIST'
        ]),
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.regionNormalize();
                this.loader = true;
                if (this.formdata) {
                    this.updateRequest();
                } else {
                    this.createRequest();
                }
            }
        },
        changeDistanceFromMKADnotApplicable() {
            if (this.form.distanceFromMKADnotApplicable) {
                this.form.distanceFromMKAD = null;
            }
        },
        regionNormalize() {
            if (!this.form.regions.find(item => item.region == 6)) {
                this.form.districts = [];
                this.form.outside_mkad = null;
            }
            if (!this.form.regions.find(item => item.region == 1)) {
                this.form.directions = [];
                this.form.region_neardy = null;
            }
        },
        async updateRequest() {
            if (await this.UPDATE_REQUEST(this.form)) {
                this.$emit('updated');
                this.clickCloseModal();
            }
            this.loader = false;
        },
        async createRequest() {
            if (await this.CREATE_REQUEST(this.form)) {
                this.$emit('created');

                this.clickCloseModal();
            }
            this.loader = false;
        },
        dateRangeValidator(value) {
            if (value === null) return true;

            let min = Date.parse(dayjs(new Date()).format('YYYY-MM-DD'));

            const max = Date.parse(new Date('2030-12-29'));
            const current = Date.parse(new Date(value));
            if (this.formdata) {
                min = Date.parse(new Date(this.formdata.movingDate));
            }
            if (current >= min && current < max) {
                return true;
            }
            return false;
        },
        customRequired(value) {
            if (!this.form.distanceFromMKADnotApplicable) {
                if (value != null) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        },
        customRequiredPassiveWhy() {
            if (this.form.status) {
                return true;
            }
            if (!required.$validator(this.form.passive_why)) {
                return false;
            }
            return true;
        },
        customRequiredForMovingDate(value) {
            if (this.form.unknownMovingDate === null) {
                if (value != null) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        },
        diff(list) {
            let options = [];
            list.forEach(item => {
                options.push(item[0]);
            });
            let data = [];

            this.form.objectTypes.forEach(item => {
                if (!options.includes(item.object_type)) {
                    data.push(item);
                }
            });
            return data;
        },
        async searchCompany(query) {
            if (query == null) {
                query = {
                    id: this.formdata ? this.formdata.company_id : this.company_id
                };
                this.searchContact(query.id);
            } else {
                query = { all: query };
            }
            const companies = await api.companies.searchCompanies(query);
            return this.multiselectAdapter(companies.data, 'id', 'full_name');
        },
        multiselectAdapter(array, valueProp, labelProp) {
            return array.map(item => {
                return { value: item[valueProp], label: item[labelProp] };
            });
        },
        onChangeCompany() {
            this.form.contact_id = null;
            this.searchContact(this.form.company_id);
        },
        async searchContact(query) {
            if (query == null) {
                query = {
                    id: this.formdata ? this.formdata.company_id : this.company_id
                };
            } else {
                query = { company_id: query };
            }
            const contacts = await api.contacts.searchContacts(query);
            this.contactOptions = this.multiselectAdapter(
                contacts.data,
                'id',
                'first_and_last_name'
            );
        },
        changeObjectTypesGeneral(data) {
            let warehouse,
                production,
                plot = null;
            data.forEach(item => {
                if (item == 0) {
                    warehouse = 1;
                } else if (item == 1) {
                    production = 1;
                } else if (item == 2) {
                    plot = 1;
                }
            });
            if (warehouse == null) this.form.objectTypes = this.diff(this.objectTypeListWareHouse);

            if (production == null)
                this.form.objectTypes = this.diff(this.objectTypeListProduction);

            if (plot == null) this.form.objectTypes = this.diff(this.objectTypeListPlot);
        },
        changeObjectTypes(objectTypeGeneral) {
            this.form.objectTypesGeneral = this.form.objectTypesGeneral.filter(
                item => item.type != objectTypeGeneral
            );
            this.form.objectTypesGeneral.push({ type: objectTypeGeneral });
        },
        clickCloseModal() {
            this.$emit('closeCompanyForm');
        },
        removeRegion(index) {
            this.form.regions = this.form.regions.filter((element, _index) => _index !== index);
            this.changeRegion();
        },
        changeRegion() {
            if (this.form.regions == null) {
                this.form.directions = [];
                this.form.districts = [];
            }
            if (!this.form.regions.find(item => (item.region ?? item) == 1)) {
                this.form.directions = [];
                this.form.region_neardy = null;
            }
            if (!this.form.regions.find(item => (item.region ?? item) == 6)) {
                this.form.districts = [];
                this.form.outside_mkad = null;
            }
        }
    },
    created() {
        this.loader = true;
        this.FETCH_CONSULTANT_LIST();
        if (this.company_id) this.form.company_id = this.company_id;
        if (this.formdata) {
            Object.assign(this.form, cloneObject(this.formdata));
        }
        this.loader = false;
    }
};
</script>
