<template>
    <Modal
        @close="$emit('close')"
        :title="false ? 'Редактирование участка' : 'Создание участка'"
        width="1000"
        has-tabs
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
                    <div class="row">
                        <Textarea v-model="form.description" label="Описание" class="col-12" />
                    </div>
                </Tab>
                <Tab name="Характериcтики">
                    <div class="row">
                        <Input
                            v-model="form.area_field_full"
                            :v="v$.form.area_field_full"
                            label="S - участка общая"
                            class="col-4"
                            type="number"
                            unit="м<sup>2</sup>"
                            required
                        />
                        <Input
                            v-model="form.land_length"
                            label="Длина участка"
                            class="col-4"
                            unit="м"
                            type="number"
                        />
                        <Input
                            v-model="form.land_width"
                            label="Ширина участка"
                            class="col-4"
                            unit="м"
                            type="number"
                        />
                    </div>
                    <div class="row mt-2">
                        <MultiSelect
                            v-model="form.own_type_land"
                            :v="v$.form.own_type_land"
                            required
                            title="Право на участок"
                            label="Право на участок"
                            class="col-4"
                            :options="ownTypeLandOptions"
                        />
                        <MultiSelect
                            v-model="form.land_category"
                            title="Категория земли"
                            label="Категория земли"
                            class="col-4"
                            :options="landCategoryOptions"
                        />
                        <MultiSelect
                            v-model="form.landscape_type"
                            :v="v$.form.landscape_type"
                            title="Рельеф участка"
                            label="Рельеф участка"
                            class="col-4"
                            required
                            :options="landscapeTypeOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <Input
                            v-model="form.cadastral_number_land"
                            :v="v$.form.cadastral_number_land"
                            label="Кадастровый № строения"
                            class="col-4"
                            required
                        />
                        <div class="col-3">
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
                        <div class="col-3">
                            <span class="form__subtitle">Первая линия</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.first_line" label="Нет" :value="0" />
                                <RadioChip v-model="form.first_line" label="Да" :value="1" />
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <Textarea v-model="form.field_allow_usage" label="В.Р.И" class="col-12" />
                    </div>
                </Tab>
                <Tab name="Коммуникации">
                    <div class="row">
                        <div class="col-4">
                            <span class="form__subtitle">Центральное отопление</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.heating_central" label="Нет" :value="0" />
                                <RadioChip v-model="form.heating_central" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Электроснабжение</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.power" label="Нет" :value="0" />
                                <RadioChip v-model="form.power" label="Да" :value="1" />
                            </div>
                        </div>
                        <Input
                            v-model="form.power_value"
                            :disabled="!form.power"
                            label="Значение"
                            :v="v$.form.power_value"
                            class="offset-1 col-4"
                            type="number"
                            unit="кВт"
                            required
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-4">
                            <span class="form__subtitle">Водоснабжение</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.water" label="Нет" :value="0" />
                                <RadioChip v-model="form.water" label="Да" :value="1" />
                            </div>
                        </div>
                        <Input
                            v-model="form.water_value"
                            label="Значение"
                            :v="v$.form.water_value"
                            :disabled="!form.water"
                            class="col-4"
                            type="number"
                            unit="м<sup>3</sup>/сут"
                            required
                        />
                        <MultiSelect
                            v-model="form.water_type"
                            :v="v$.form.water_type"
                            :disabled="!form.water"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            :options="waterTypeOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-4">
                            <span class="form__subtitle">Канализация ливн.</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.sewage_rain" label="Нет" :value="0" />
                                <RadioChip v-model="form.sewage_rain" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-4">
                            <span class="form__subtitle">Канализация центр.</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.sewage_central" label="Нет" :value="0" />
                                <RadioChip v-model="form.sewage_central" label="Да" :value="1" />
                            </div>
                        </div>
                        <Input
                            v-model="form.sewage_central_value"
                            :disabled="!form.sewage_central"
                            label="Значение"
                            :v="v$.form.sewage_central_value"
                            class="col-4"
                            type="number"
                            unit="м<sup>3</sup>/сут"
                            required
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-4">
                            <span class="form__subtitle">Газ</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.gas" label="Нет" :value="0" />
                                <RadioChip v-model="form.gas" label="Да" :value="1" />
                            </div>
                        </div>
                        <Input
                            v-model="form.gas_value"
                            label="Значение"
                            :v="v$.form.water_value"
                            :disabled="!form.gas"
                            class="col-4"
                            type="number"
                            unit="м<sup>3</sup>/час"
                            required
                        />
                        <MultiSelect
                            v-model="form.gas_type"
                            :disabled="!form.gas"
                            :v="v$.form.gas_type"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            :options="gasTypeOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-4">
                            <span class="form__subtitle">Телефония</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.phone_line" label="Нет" :value="0" />
                                <RadioChip v-model="form.phone_line" label="Да" :value="1" />
                            </div>
                        </div>
                        <div class="col-4">
                            <span class="form__subtitle">Пар</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.steam" label="Нет" :value="0" />
                                <RadioChip v-model="form.steam" label="Да" :value="1" />
                            </div>
                        </div>
                        <Input
                            v-model="form.steam_value"
                            :disabled="!form.steam"
                            label="Значение"
                            :v="v$.form.steam_value"
                            class="col-4"
                            type="number"
                            unit="бар"
                            required
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-4">
                            <span class="form__subtitle">Интернет</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.internet" label="Нет" :value="0" />
                                <RadioChip v-model="form.internet" label="Да" :value="1" />
                            </div>
                        </div>
                        <MultiSelect
                            v-model="form.internet_type"
                            :disabled="!form.internet"
                            :v="v$.form.internet_type"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            :options="internetTypeOptions"
                        />
                    </div>
                </Tab>
                <Tab name="Безопасность/Инфраструктура">
                    <p class="form__block">Безопасность</p>
                    <div class="row">
                        <div class="col-3">
                            <span class="form__subtitle">Видеонаблюдение</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.video_control"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.video_control"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Охрана объекта</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.guard" label="Нет" :value="0" unselect />
                                <RadioChip v-model="form.guard" label="Да" :value="1" unselect />
                            </div>
                        </div>
                        <MultiSelect
                            v-model="form.guard_type"
                            :disabled="!form.guard"
                            title="Тип"
                            label="Тип"
                            class="col-4"
                            required
                            :options="guardTypeOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-3">
                            <span class="form__subtitle">Контроль доступа</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.access_control"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.access_control"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Охран. сигнализ.</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.security_alert"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.security_alert"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Шлагбаум</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.barrier" label="Нет" :value="0" unselect />
                                <RadioChip v-model="form.barrier" label="Да" :value="1" unselect />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Забор по перим.</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.fence_around_perimeter"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.fence_around_perimeter"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                    </div>
                    <p class="form__block">Железнодорожное сообщение</p>
                    <div class="row mt-2">
                        <div class="col-3">
                            <span class="form__subtitle">Ж/Д ветка</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.railway" label="Нет" :value="0" unselect />
                                <RadioChip v-model="form.railway" label="Да" :value="1" unselect />
                            </div>
                        </div>
                        <Input
                            v-model="form.railway_value"
                            :disabled="!form.railway"
                            label="Значение"
                            :v="v$.form.railway_value"
                            class="col-4"
                            type="number"
                            unit="м"
                            required
                        />
                    </div>
                    <p class="form__block">Инфраструктура</p>
                    <div class="row mt-2">
                        <div class="col-3">
                            <span class="form__subtitle">P легковая</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.parking_car"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.parking_car"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <MultiSelect
                            v-model="form.parking_car_value"
                            :disabled="!form.parking_car"
                            :v="v$.form.parking_car_value"
                            title="Тип"
                            label="Тип"
                            class="col-3"
                            required
                            :options="feeTypeOptions"
                        />
                        <MultiSelect
                            v-model="form.entry_territory_type"
                            title="Въезд на территорию"
                            label="Въезд на террит."
                            class="col-4"
                            :options="entryTerritoryTypeOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-3">
                            <span class="form__subtitle">P 3-10 тонн</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.parking_lorry"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.parking_lorry"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <MultiSelect
                            v-model="form.parking_lorry_value"
                            :disabled="!form.parking_lorry"
                            :v="v$.form.parking_lorry_value"
                            title="Тип"
                            label="Тип"
                            class="col-3"
                            required
                            :options="feeTypeOptions"
                        />
                        <MultiSelect
                            v-model="form.entrance_type"
                            title="Плата за въезд"
                            label="Плата за въезд"
                            class="col-4"
                            :options="feeTypeOptions"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="col-3">
                            <span class="form__subtitle">P грузовая</span>
                            <div class="form__row mt-1">
                                <RadioChip
                                    v-model="form.parking_truck"
                                    label="Нет"
                                    :value="0"
                                    unselect
                                />
                                <RadioChip
                                    v-model="form.parking_truck"
                                    label="Да"
                                    :value="1"
                                    unselect
                                />
                            </div>
                        </div>
                        <MultiSelect
                            v-model="form.parking_truck_value"
                            :disabled="!form.parking_truck"
                            :v="v$.form.parking_truck_value"
                            title="Тип"
                            label="Тип"
                            class="col-3"
                            required
                            :options="feeTypeOptions"
                        />
                        <div class="col-3">
                            <span class="form__subtitle">Столовая/Кафе</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.canteen" label="Нет" :value="0" unselect />
                                <RadioChip v-model="form.canteen" label="Да" :value="1" unselect />
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="form__subtitle">Общежитие</span>
                            <div class="form__row mt-1">
                                <RadioChip v-model="form.hostel" label="Нет" :value="0" unselect />
                                <RadioChip v-model="form.hostel" label="Да" :value="1" unselect />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab name="Фотографии">
                    <div class="row">
                        <FileInput
                            v-model:native="form.photosList"
                            v-model:data="form.photos"
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
                <Submit class="col-3 mx-auto" success>Сохранить</Submit>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { helpers, minValue, required } from '@vuelidate/validators';
import { ComplexFormMixin } from '@/components/Forms/Complex/mixin';
import { mapActions } from 'vuex';
import { yandexmap } from '@/utils/yandexMap.js';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import { entityOptions } from '@/const/options/options';

export default {
    name: 'FormComplexPlotCreate',
    components: { RadioChip, CheckboxChip, Modal, Loader },
    mixins: [ComplexFormMixin],
    data() {
        return {
            form: {
                address: null,
                company_id: null,
                object_type: [],
                purposes: [],
                test_only: null,
                area_field_full: null,
                land_length: null,
                land_width: null,
                own_type_land: null,
                land_category: null,
                landscape_type: null,
                cadastral_number_land: null,
                first_line: null,
                field_allow_usage: null,
                power: null,
                power_value: null,
                sewage_central: null,
                sewage_central_value: null,
                sewage_rain: null,
                water: null,
                water_value: null,
                water_type: null,
                gas: null,
                gas_value: null,
                gas_type: null,
                steam: null,
                steam_value: null,
                phone_line: null,
                internet: null,
                internet_type: null,
                guard: null,
                guard_type: null,
                video_control: null,
                access_control: null,
                security_alert: null,
                barrier: null,
                fence_around_perimeter: null,
                railway: null,
                railway_value: null,
                entry_territory: null,
                entry_territory_type: null,
                entrance_type: null,
                parking_car: null,
                parking_car_value: null,
                parking_lorry: null,
                parking_lorry_value: null,
                parking_truck: null,
                parking_truck_value: null,
                canteen: null,
                hostel: null,
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
                cadastral_number_land: {
                    required: helpers.withMessage('заполните поле', required)
                },
                first_line: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                area_field_full: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                own_type_land: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                landscape_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                power: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                power_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                heating_central: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                water: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                water_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                water_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                sewage_central: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                sewage_central_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                gas: {},
                gas_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                gas_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                steam_value: {
                    required: helpers.withMessage('заполните поле', required),
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                },
                internet_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                guard_type: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                parking_car_value: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                parking_lorry_value: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                parking_truck_value: {
                    required: helpers.withMessage('выберите один из вариантов', required)
                },
                railway_value: {
                    minValue: helpers.withMessage('значение должно быть больше 0', minValue(1))
                }
            }
        };
    },
    computed: {
        objectTypeListWareHouse: () => entityOptions.object.purposesWithSections.warehouse,
        objectTypeListProduction: () => entityOptions.object.purposesWithSections.production,
        objectTypeListPlot: () => entityOptions.object.purposesWithSections.plot,
        ownTypeLandOptions() {
            return Object.values(entityOptions.object.ownTypeLand);
        },
        landCategoryOptions() {
            return Object.values(entityOptions.object.landCategory);
        },
        landscapeTypeOptions() {
            return Object.values(entityOptions.object.landscape);
        },
        waterTypeOptions() {
            return Object.values(entityOptions.complex.water);
        },
        gasTypeOptions() {
            return Object.values(entityOptions.complex.water);
        },
        internetTypeOptions() {
            return Object.values(entityOptions.complex.internet);
        },
        guardTypeOptions() {
            return Object.values(entityOptions.complex.guard);
        },
        feeTypeOptions() {
            return Object.values(entityOptions.complex.fee);
        },
        entryTerritoryTypeOptions() {
            return Object.values(entityOptions.complex.entryTerritory);
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
