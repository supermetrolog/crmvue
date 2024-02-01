<template>
    <Modal
        @close="$emit('close')"
        class="modal-form-complex-building"
        :title="false ? 'Редактирование строения' : 'Создание строения'"
    >
        <template #header>
            <CheckboxChip v-model="form.test_only" :value="form.test_only" text="Тестовый лот" />
        </template>
        <Loader v-if="loader" class="center" />
        <Form @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <div class="row">
                        <MultiSelect
                            v-model="form.address"
                            @change="onChangeAddress"
                            extra-classes="long-text"
                            label="Адрес строения"
                            required
                            class="col-6"
                            :filterResults="false"
                            :min-chars="1"
                            :resolve-on-load="true"
                            :delay="500"
                            :searchable="true"
                            :v="v$.form.address"
                            :options="
                                async query => {
                                    return await searchAddress(query);
                                }
                            "
                        />
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
                            :delay="500"
                            :searchable="true"
                            :options="
                                async query => {
                                    return await searchCompany(query);
                                }
                            "
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-12">
                            <span class="form__subtitle">Тип объекта</span>
                            <div class="row mt-2">
                                <CheckboxIcons
                                    v-model="form.purposes"
                                    @extraSelect="selectObjectType"
                                    extra-label="склад"
                                    :no-all-select="true"
                                    :extra-value="1"
                                    :extra-options="form.object_type"
                                    class="col-md-4 col-12"
                                    :options="objectTypeListWareHouse"
                                />
                                <CheckboxIcons
                                    v-model="form.purposes"
                                    @extraSelect="selectObjectType"
                                    extra-label="производство"
                                    :no-all-select="true"
                                    :extra-value="2"
                                    :extra-options="form.object_type"
                                    class="col-md-4 col-12"
                                    :options="objectTypeListProduction"
                                />
                                <CheckboxIcons
                                    v-model="form.purposes"
                                    @extraSelect="selectObjectType"
                                    extra-label="участок"
                                    :no-all-select="true"
                                    :extra-value="3"
                                    :extra-options="form.object_type"
                                    class="col-md-4 col-12"
                                    :options="objectTypeListPlot"
                                />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab name="Характериcтики">
                    <div class="row">
                        <Input
                            v-model="form.area_building"
                            :v="v$.form.area_building"
                            label="S - здания"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                            required
                        />
                        <Input
                            v-model="form.area_floor_full"
                            label="S - пола общая"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                        <Input
                            v-model="form.area_mezzanine_full"
                            label="S - мезанина общая"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.area_office_full"
                            label="S - офисов общая"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                        <Input
                            v-model="form.area_tech_full"
                            label="S - техническая"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                        />
                        <div class="col-4">
                            <span class="form__subtitle">Ограничения</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.land_use_restrictions"
                                    label="Нет"
                                    :value="0"
                                />
                                <RadioChip
                                    v-model="form.land_use_restrictions"
                                    label="Да"
                                    :value="1"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <MultiSelect
                            v-model="form.object_class"
                            :v="v$.form.object_class"
                            required
                            title="Класс объекта"
                            label="Класс объекта"
                            class="col-4"
                            :options="objectClassOptions"
                        />
                        <MultiSelect
                            v-model="form.facing_type"
                            title="Внешняя отделка"
                            label="Внешняя отделка"
                            class="col-4"
                            :options="facingTypeOptions"
                        />
                        <MultiSelect
                            v-model="form.own_type"
                            title="Право на строение"
                            label="Право на строение"
                            class="col-4"
                            :options="ownTypeOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.year_build"
                            :v="v$.form.year_build"
                            label="Год постройки"
                            class="col-4"
                            type="number"
                            maska="####"
                        />
                        <Input
                            v-model="form.year_repair"
                            :v="v$.form.year_repair"
                            label="Год последнего ремонта"
                            class="col-4"
                            type="number"
                            maska="####"
                        />
                        <Input
                            v-model="form.cadastral_number"
                            :v="v$.form.cadastral_number"
                            label="Кадастровый № строения"
                            class="col-4"
                            required
                        />
                    </div>
                    <div class="row mt-2">
                        <Textarea v-model="form.description" label="Описание" class="col-12" />
                    </div>
                </Tab>
                <Tab name="Фотографии">
                    <div class="row">
                        <FileInput
                            v-model:native="form.photosList"
                            v-model:data="form.photo"
                            label="Фотографии"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
                <Tab name="Документы">
                    <div class="row">
                        <FileInput
                            v-model:native="form.layoutsList"
                            v-model:data="form.layouts"
                            label="Планировки"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.presentationsList"
                            v-model:data="form.presentations"
                            label="Презентации"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.ownerShipDocumentsList"
                            v-model:data="form.ownerShipDocuments"
                            label="Документы на собственность"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
            </Tabs>
            <div class="row">
                <Submit class="col-3 mx-auto" small success>Сохранить</Submit>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { helpers, maxValue, minValue, required } from '@vuelidate/validators';
import { mapActions } from 'vuex';
import { yandexmap } from '@/utils';
import Loader from '@/components/common/Loader.vue';
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import Modal from '@/components/common/Modal.vue';
import { facingTypes, objectClassTypes, ownTypes } from '@/const/types';
import { ObjectTypeList } from '@/const/const';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

export default {
    name: 'FormComplexBuildingCreate',
    components: { RadioChip, CheckboxChip, Modal, Loader },
    mixins: [ComplexFormMixin],
    data() {
        return {
            selectedCompany: null,
            form: {
                address: null,
                company_id: null,
                object_type: [],
                purposes: [],
                area_building: null,
                area_floor_full: null,
                area_mezzanine_full: null,
                area_office_full: null,
                area_tech_full: null,
                object_class: null,
                facing_type: null,
                own_type: null,
                year_build: null,
                year_repair: null,
                cadastral_number: null,
                test_only: null,
                land_use_restrictions: null,
                description: null,
                layouts: [],
                layoutsList: [],
                panoramas: [],
                panoramasList: [],
                presentations: [],
                presentationsList: [],
                ownerShipDocuments: [],
                ownerShipDocumentsList: [],
                photos: [],
                photosList: []
            }
        };
    },
    validations() {
        return {
            form: {
                address: {
                    required: helpers.withMessage('заполните поле', required)
                },
                company_id: {
                    required: helpers.withMessage('заполните поле', required)
                },
                area_building: {
                    required: helpers.withMessage('заполните поле', required)
                },
                object_class: {
                    required: helpers.withMessage('выберите класс объекта', required)
                },
                year_build: {
                    minValue: helpers.withMessage('минимальное значение - 1800', minValue(1800)),
                    maxValue: helpers.withMessage(
                        `максимальное значение - ${new Date().getFullYear()}`,
                        maxValue(new Date().getFullYear())
                    )
                },
                year_repair: {
                    minValue: helpers.withMessage('минимальное значение - 1800', minValue(1800)),
                    maxValue: helpers.withMessage(
                        `максимальное значение - ${new Date().getFullYear()}`,
                        maxValue(new Date().getFullYear())
                    )
                },
                cadastral_number: {
                    required: helpers.withMessage('заполните поле', required)
                }
            }
        };
    },
    computed: {
        objectTypeListWareHouse: () => ObjectTypeList.warehouse,
        objectTypeListProduction: () => ObjectTypeList.production,
        objectTypeListPlot: () => ObjectTypeList.plot,
        objectClassOptions() {
            return Object.values(objectClassTypes);
        },
        facingTypeOptions() {
            return Object.values(facingTypes);
        },
        ownTypeOptions() {
            return Object.values(ownTypes);
        }
    },
    methods: {
        ...mapActions(['SEARCH_COMPANIES']),
        onChangeAddress() {
            console.log('CHANGE ADDRESS');
        },
        async onChangeCompany() {
            console.log('CHANGE COMPANY');
        },
        async searchCompany() {
            return ['ОАО Тореадор', 'ЗАО ИнкЛомМет'];
        },
        async searchAddress(query) {
            return await yandexmap.getAddress(query);
        },
        selectObjectType(isSelected, type) {
            this.form.object_type = this.form.object_type.filter(item => item !== type);
            if (isSelected) {
                this.form.object_type.push(type);
            }
        }
    }
};
</script>
