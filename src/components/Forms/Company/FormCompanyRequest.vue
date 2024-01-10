<template>
    <div class="fuck">
        <Modal @close="clickCloseModal" :title="!formdata ? 'Создание запроса' : 'Изменение запроса'" class="normal">
            <Form @submit="onSubmit" class="p-2">
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
                        class="col-6 pr-1"
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
                        v-model="form.regions"
                        :v="v$.form.regions"
                        label="Регионы"
                        class="col-4 pr-1"
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
                    >
                        <template v-if="REGION_LIST">
                            <small v-for="(region, index) in form.regions" :key="region.region" class="d-block px-3">
                                {{ index + 1 }}.
                                {{ REGION_LIST.find(item => item.value == region.region).label }}
                            </small>
                        </template>
                        <Checkbox
                            v-if="form.regions.find(item => item.region == 1)"
                            v-model="form.directions"
                            class="col-12 p-0 mt-2 text-center"
                            label="Направления МО"
                            name="direction"
                            :options="directionList"
                        />
                    </MultiSelect>
                    <MultiSelect
                        v-model="form.dealType"
                        :v="v$.form.dealType"
                        required
                        label="Тип сделки"
                        class="col-4 pr-1"
                        :options="dealTypeList"
                    >
                        <Checkbox
                            v-if="form.regions.find(item => item.region == 1)"
                            v-model="form.region_neardy"
                            label="Регионы рядом c МО"
                            class="col-12 large p-0 mt-2 text-center"
                        />
                        <Radio
                            v-if="form.regions.find(item => item.region == 6)"
                            v-model="form.outside_mkad"
                            :unselect-mode="true"
                            class="col large p-0 mt-2 text-center"
                            :options="outsideMkadOptions"
                        />
                    </MultiSelect>
                    <MultiSelect
                        v-model="form.consultant_id"
                        :v="v$.form.consultant_id"
                        required
                        label="Консультант"
                        class="col-4"
                        :options="CONSULTANT_LIST"
                    >
                        <Checkbox
                            v-if="form.regions.find(item => item.region == 6)"
                            v-model="form.districts"
                            class="col-12 p-0 mt-2 text-center"
                            label="Округа Москвы"
                            name="district"
                            :options="districtList"
                        />
                    </MultiSelect>
                </FormGroup>
                <FormGroup class="mb-2">
                    <Input
                        v-model="form.distanceFromMKAD"
                        :disabled="!!form.distanceFromMKADnotApplicable"
                        :v="v$.form.distanceFromMKAD"
                        maska="###"
                        label="Удаленность от МКАД"
                        class="col-4 pr-1"
                        required
                    >
                        <Checkbox
                            v-model="form.distanceFromMKADnotApplicable"
                            @change="changeDistanceFromMKADnotApplicable"
                            class="col-12 large p-0 pt-1"
                            label="Неприменимо - регион или Москва"
                            mode="inline"
                        />
                    </Input>

                    <Input
                        v-model="form.minCeilingHeight"
                        :v="v$.form.minCeilingHeight"
                        maska="##########"
                        label="Высота потолков"
                        placeholder="От:"
                        required
                        class="col-4 pr-1"
                    >
                        <Input
                            v-model="form.maxCeilingHeight"
                            maska="##########"
                            placeholder="До:"
                            required
                            class="col-12 p-0 pt-1"
                        />
                    </Input>
                    <Input
                        v-model="form.minArea"
                        :v="v$.form.minArea"
                        maska="##########"
                        label="S пола (м^2)"
                        placeholder="От:"
                        required
                        class="col-4 pr-1"
                    >
                        <Input
                            v-model="form.maxArea"
                            :v="v$.form.maxArea"
                            maska="##########"
                            placeholder="До:"
                            required
                            class="col-12 p-0 pt-1"
                        />
                    </Input>
                    <MultiSelect
                        v-if="!form.status"
                        v-model="form.passive_why"
                        :v="v$.form.passive_why"
                        required
                        label="Причина пассива"
                        class="col-5 ml-auto"
                        :options="passiveWhyOptions"
                    >
                        <Textarea v-model="form.passive_why_comment" class="col-12 p-0 pt-1" />
                    </MultiSelect>
                </FormGroup>
                <FormGroup class="mb-2">
                    <Checkbox
                        v-model="form.objectClasses"
                        class="col-3"
                        label="Классы"
                        name="object_class"
                        :options="objectClassList"
                    />

                    <Radio
                        v-model="form.heated"
                        label="Отапливаемый"
                        :unselect-mode="true"
                        class="col-3 text-center"
                        :options="yesNoOptions"
                    />
                    <Input
                        v-model="form.electricity"
                        maska="##########"
                        label="Электричесвто (квт)"
                        class="col-3 pr-1"
                    />
                    <Input v-model="form.pricePerFloor" maska="##########" label="Цена (м^2/год)" class="col-3" />
                </FormGroup>
                <FormGroup class="mb-2">
                    <Checkbox v-model="form.haveCranes" class="col large text-center" label="Краны" />
                    <Checkbox v-model="form.water" class="col large text-center" label="Вода" />
                    <Checkbox v-model="form.gaz" class="col large text-center" label="Газ" />
                    <Checkbox v-model="form.steam" class="col large text-center" label="Пар" />
                    <Checkbox v-model="form.sewerage" class="col large text-center" label="КНС" />
                    <Checkbox v-model="form.shelving" class="col large text-center" label="Стеллажи" />
                    <Checkbox v-model="form.trainLine" class="col large text-center" label="Ж/Д ветка">
                        <Input
                            v-if="form.trainLine"
                            v-model="form.trainLineLength"
                            label="Длина ветки"
                            maska="##########"
                            class="col-12 p-0"
                        />
                    </Checkbox>
                </FormGroup>
                <FormGroup class="mb-2">
                    <Checkbox
                        v-model="form.gateTypes"
                        class="col-12 text-center"
                        label="Тип ворот"
                        name="gate_type"
                        :options="gateTypeList"
                    />
                </FormGroup>
                <FormGroup class="mb-2">
                    <Input
                        v-model="form.movingDate"
                        @change="form.unknownMovingDate = null"
                        :v="v$.form.movingDate"
                        label="Дата переезда"
                        type="date"
                        required
                        class="col-4 pr-1"
                    >
                        <Radio
                            v-model="form.unknownMovingDate"
                            @change.stop="form.movingDate = null"
                            class="col-12 p-0 mt-2 small"
                            :options="unknownMovingDateOptions"
                        />
                    </Input>
                    <Checkbox v-model="form.antiDustOnly" class="col large text-center" label="Только антипыль" />
                    <Checkbox v-model="form.firstFloorOnly" class="col pr-1 large text-center" label="Только 1 этаж" />
                    <Checkbox v-model="form.expressRequest" class="col large text-center" label="Срочный запрос" />
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
    </div>
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
import Radio from '@/components/common/Forms/Radio.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import Submit from '@/components/common/Forms/Submit.vue';
import moment from 'moment';
import api from '@//api/api.js';
import Modal from '@/components/common/Modal.vue';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'FormCompanyRequest',
    components: {
        Loader,
        Modal,
        Form,
        FormGroup,
        Input,
        Checkbox,
        MultiSelect,
        Radio,
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
        dealTypeList: () => DealTypeList
    },
    watch: {
        form: {
            deep: true,
            handler() {}
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
                    customRequiredPassiveWhy: helpers.withMessage('Выберите причину', this.customRequiredPassiveWhy)
                }
            }
        };
    },
    methods: {
        ...mapActions(['FETCH_CONSULTANT_LIST', 'CREATE_REQUEST', 'UPDATE_REQUEST', 'FETCH_REGION_LIST']),
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

            let min = Date.parse(moment(new Date()).format('YYYY-MM-DD'));

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
            this.contactOptions = this.multiselectAdapter(contacts.data, 'id', 'first_and_last_name');
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

            if (production == null) this.form.objectTypes = this.diff(this.objectTypeListProduction);

            if (plot == null) this.form.objectTypes = this.diff(this.objectTypeListPlot);
        },

        changeObjectTypes(objectTypeGeneral) {
            this.form.objectTypesGeneral = this.form.objectTypesGeneral.filter(item => item.type != objectTypeGeneral);
            this.form.objectTypesGeneral.push({ type: objectTypeGeneral });
        },
        clickCloseModal() {
            this.$emit('closeCompanyForm');
        }
    },
    async created() {
        this.loader = true;
        await this.FETCH_CONSULTANT_LIST();
        this.form.company_id = this.company_id;
        if (this.formdata) {
            this.form = { ...this.form, ...this.formdata };
        }
        this.loader = false;
    }
};
</script>