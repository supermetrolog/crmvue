<template>
    <Modal @close="$emit('close')" show width="1300" has-tabs>
        <template #header>
            <Switch v-model="form.test_only" false-title="Обычный лот" true-title="Тестовый лот" />
        </template>
        <Loader v-if="isLoading" />
        <UiForm @submit="onSubmit">
            <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'main' }">
                <Tab id="main" name="Основное">
                    <div class="row">
                        <!--                        <MultiSelect-->
                        <!--                            v-model="form.address"-->
                        <!--                            @change="onChangeAddress"-->
                        <!--                            extra-classes="long-text"-->
                        <!--                            placeholder="Введите адрес.."-->
                        <!--                            label="Адрес строения"-->
                        <!--                            required-->
                        <!--                            class="col-6"-->
                        <!--                            :filterResults="false"-->
                        <!--                            :min-chars="1"-->
                        <!--                            :resolve-on-load="true"-->
                        <!--                            :delay="600"-->
                        <!--                            :searchable="true"-->
                        <!--                            :v="v$.form.address"-->
                        <!--                            :options="-->
                        <!--                                async query => {-->
                        <!--                                    return await searchAddress(query);-->
                        <!--                                }-->
                        <!--                            "-->
                        <!--                        />-->
                        <!--                        <MultiSelect-->
                        <!--                            v-model="form.company_id"-->
                        <!--                            @change="onChangeCompany"-->
                        <!--                            placeholder="Введите название компании или ID"-->
                        <!--                            extra-classes="long-text"-->
                        <!--                            label="Компания"-->
                        <!--                            required-->
                        <!--                            class="col-6"-->
                        <!--                            :v="v$.form.company_id"-->
                        <!--                            :filterResults="false"-->
                        <!--                            :min-chars="1"-->
                        <!--                            :resolve-on-load="true"-->
                        <!--                            :delay="500"-->
                        <!--                            :searchable="true"-->
                        <!--                            :options="-->
                        <!--                                async query => {-->
                        <!--                                    return await searchCompany(query);-->
                        <!--                                }-->
                        <!--                            "-->
                        <!--                        />-->
                    </div>
                    <div class="row mt-2">
                        <div class="col-12">
                            <span class="form__subtitle">Тип объекта</span>
                            <div class="row mt-2">
                                <ObjectTypePicker
                                    v-model:value="form.purposes"
                                    v-model:extra="form.object_type"
                                    :extra-value="0"
                                    label="Склад"
                                    :options="objectPurposesWithSectionsOptions.warehouse"
                                    class="col-md-6"
                                />
                                <ObjectTypePicker
                                    v-model:value="form.purposes"
                                    v-model:extra="form.object_type"
                                    :extra-value="1"
                                    label="Производство"
                                    :options="objectPurposesWithSectionsOptions.production"
                                    class="col-md-6"
                                />
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab name="Характериcтики">
                    <div class="row">
                        <div class="col-9">
                            <div class="row">
                                <UiInput
                                    v-model="form.area_building"
                                    :v="v$.form.area_building"
                                    label="S - здания"
                                    class="col-4"
                                    type="number"
                                    unit="м<sup>2</sup>"
                                    required
                                />
                                <UiInput
                                    v-model="form.area_floor_full"
                                    :v="v$.form.area_floor_full"
                                    label="S - пола общая"
                                    class="col-4"
                                    type="number"
                                    unit="м<sup>2</sup>"
                                />
                                <UiInput
                                    v-model="form.area_mezzanine_full"
                                    :v="v$.form.area_mezzanine_full"
                                    label="S - мезанина общая"
                                    class="col-4"
                                    type="number"
                                    unit="м<sup>2</sup>"
                                />
                            </div>
                            <div class="row mt-2">
                                <UiInput
                                    v-model="form.area_office_full"
                                    :v="v$.form.area_office_full"
                                    label="S - офисов общая"
                                    class="col-4"
                                    type="number"
                                    unit="м<sup>2</sup>"
                                />
                                <UiInput
                                    v-model="form.area_tech_full"
                                    :v="v$.form.area_tech_full"
                                    label="S - техническая"
                                    class="col-4"
                                    type="number"
                                    unit="м<sup>2</sup>"
                                />
                                <RadioOptions
                                    v-model="form.land_use_restrictions"
                                    class="col-4"
                                    label="Ограничения"
                                    unselect
                                    :options="entityOptions.defaults.booleanSimple"
                                />
                            </div>
                            <div class="row mt-2">
                                <MultiSelect
                                    v-model="form.object_class"
                                    :v="v$.form.object_class"
                                    required
                                    title="Класс объекта"
                                    label="Класс объекта"
                                    class="col-4"
                                    :options="entityOptions.object.class"
                                />
                                <MultiSelect
                                    v-model="form.facing_type"
                                    title="Внешняя отделка"
                                    label="Внешняя отделка"
                                    class="col-4"
                                    :options="entityOptions.object.facing"
                                />
                                <MultiSelect
                                    v-model="form.own_type"
                                    title="Право на строение"
                                    label="Право на строение"
                                    class="col-4"
                                    :options="entityOptions.object.ownType"
                                />
                            </div>
                            <div class="row mt-2">
                                <UiInput
                                    v-model="form.year_build"
                                    :v="v$.form.year_build"
                                    label="Год постройки"
                                    class="col-4"
                                    type="number"
                                    maska="####"
                                />
                                <UiInput
                                    v-model="form.year_repair"
                                    :v="v$.form.year_repair"
                                    label="Год последнего ремонта"
                                    class="col-4"
                                    type="number"
                                    maska="####"
                                />
                                <UiInput
                                    v-model="form.cadastral_number"
                                    :v="v$.form.cadastral_number"
                                    label="Кадастровый № строения"
                                    class="col-4"
                                    required
                                />
                            </div>
                            <DescriptionEditor
                                v-model:description="form.description"
                                v-model:description-auto="form.description_auto"
                                v-model:manual-use="form.description_manual_use"
                                class="mt-3"
                            />
                        </div>
                        <div class="col-3">
                            <FloorPicker v-model="form.floors_building" />
                        </div>
                    </div>
                </Tab>
                <Tab name="Фотографии">
                    <div class="row">
                        <FileInput
                            v-model:native="form.photosList"
                            v-model:data="form.photo"
                            sortable
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
                            v-model:native="form.building_layouts_list"
                            v-model:data="form.building_layouts"
                            sortable
                            label="Планировки"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.building_presentations_list"
                            v-model:data="form.building_presentations"
                            sortable
                            label="Презентации"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                    <div class="row mt-2">
                        <FileInput
                            v-model:native="form.building_property_documents_list"
                            v-model:data="form.building_property_documents"
                            sortable
                            label="Документы на собственность"
                            class="col-12"
                        >
                            Выбрать файлы
                        </FileInput>
                    </div>
                </Tab>
            </Tabs>
            <div class="row">
                <FormSubmit class="col-3 mx-auto" small success>Сохранить</FormSubmit>
            </div>
        </UiForm>
    </Modal>
</template>

<script setup>
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import { entityOptions } from '@/const/options/options';
import { onBeforeMount, reactive, shallowRef } from 'vue';
import { cloneObject } from '@/utils/helpers/object/cloneObject.js';
import UiInput from '@/components/common/Forms/UiInput.vue';
import FileInput from '@/components/common/Forms/FileInput.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import useVuelidate from '@vuelidate/core';
import { validationRulesForComplexHolding } from '@/validators/rules/complex-holding.js';
import Switch from '@/components/common/Forms/Switch.vue';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import DescriptionEditor from '@/components/common/Forms/DescriptionEditor.vue';
import FloorPicker from '@/components/common/Forms/FloorPicker.vue';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import FormSubmit from '@/components/common/Forms/FormSubmit.vue';

const props = defineProps({
    holding: {
        type: Object,
        default: null
    }
});

// const selectedCompany = ref(null);
const isLoading = shallowRef(false);

const form = reactive({
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
    photo: [],
    photosList: []
});

const v$ = useVuelidate({ form: validationRulesForComplexHolding }, { form });

const onSubmit = () => {};

onBeforeMount(() => {
    if (props.holding) Object.assign(form, cloneObject(props.holding));
});
</script>
