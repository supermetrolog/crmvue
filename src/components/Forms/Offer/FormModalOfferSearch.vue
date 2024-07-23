<template>
    <Modal @close="$emit('close')" width="1400" title="Фильтры">
        <template #header>
            <span v-if="filterCount" class="badge badge-danger">
                {{ filterCount }}
            </span>
        </template>
        <Form @submit="onSubmit">
            <div class="row mb-2">
                <div class="col-12 col-md-8">
                    <Input
                        v-model="form.all"
                        @keydown.enter="onSubmit"
                        label="Поиск"
                        placeholder="ID, адрес, собственник, телефон, ФИО"
                    />
                </div>
                <div class="col-12 col-md-4 align-self-end">
                    <div class="offer-search__actions">
                        <Button
                            @click="clickFavorites"
                            warning
                            :active="form.favorites"
                            :badge="favoritesCount || false"
                        >
                            избранные
                        </Button>
                        <Button @click="resetForm" :disabled="!filterCount" danger>
                            Сбросить фильтры
                        </Button>
                    </div>
                </div>
            </div>
            <div class="row">
                <MultiSelect
                    v-model="form.agent_id"
                    label="Консультант"
                    class="col-12 col-md-4"
                    :options="
                        async () => {
                            return await FETCH_CONSULTANT_LIST();
                        }
                    "
                />
                <MultiSelect
                    v-model="form.deal_type"
                    label="Тип сделки"
                    class="col-md-2 col-12 mb-2"
                    :options="dealTypeList"
                />
                <Input
                    v-if="typeof form.approximateDistanceFromMKAD == 'undefined'"
                    v-model="form.rangeMaxDistanceFromMKAD"
                    maska="###"
                    placeholder="не более"
                    label="Удаленность от МКАД"
                    class="col-md-3 col-12"
                    unit="км"
                    type="number"
                    :v="v$.form.rangeMaxDistanceFromMKAD"
                    reactive
                />
                <Input
                    v-else
                    v-model="form.approximateDistanceFromMKAD"
                    maska="###"
                    placeholder="не более"
                    label="Удаленность от МКАД +30%"
                    class="col-md-3 col-12"
                    unit="км"
                    type="number"
                />
                <Input
                    v-model="form.rangeMinElectricity"
                    placeholder="не менее"
                    maska="##########"
                    label="Электричество"
                    class="col-md-3 col-12"
                    unit="кВт"
                    type="number"
                    :v="v$.form.rangeMinElectricity"
                    reactive
                />
                <DoubleInput
                    v-model:first="form.rangeMinArea"
                    v-model:second="form.rangeMaxArea"
                    label="S пола"
                    class="col-md-3 col-12"
                    unit="м<sup>2</sup>"
                    type="number"
                    :validators="formAreaValidators"
                    reactive
                />
                <DoubleInput
                    v-model:first="form.rangeMinPricePerFloor"
                    v-model:second="form.rangeMaxPricePerFloor"
                    label="Цена (продажи, аренды, о-х)"
                    class="col-md-3 col-12"
                    unit="₽"
                    type="number"
                    reactive
                    :validators="formPricePerFloorValidators"
                />
                <DoubleInput
                    v-model:first="form.rangeMinCeilingHeight"
                    v-model:second="form.rangeMaxCeilingHeight"
                    label="Высота потолков"
                    class="col-md-3 col-12"
                    unit="м"
                    type="number"
                    reactive
                    :validators="formCeilingHeightValidators"
                />
                <MultiSelect
                    v-model="form.fakeRegion"
                    @change="changeRegion"
                    label="Регионы"
                    class="col-md-3 col-sm-6 col-12"
                    mode="single"
                    :options="
                        async () => {
                            await FETCH_REGION_LIST();
                            return REGION_LIST;
                        }
                    "
                />
            </div>
            <div class="row mt-2">
                <AnimationTransition>
                    <div v-if="form.region.find(item => item == 6)" class="col-12 mb-2">
                        <span class="form__subtitle">Округа Москвы</span>
                        <div class="form__row mt-1">
                            <CheckboxChip
                                v-for="(districtItem, index) in districtList"
                                :key="index"
                                v-model="form.district_moscow"
                                :value="index"
                                :text="districtItem"
                            />
                        </div>
                    </div>
                </AnimationTransition>
                <AnimationTransition>
                    <div v-if="form.region.find(item => item == 1)" class="col-12 mb-2">
                        <span class="form__subtitle">Направления МО</span>
                        <div class="form__row mt-1">
                            <CheckboxChip
                                v-for="(directionItem, index) in directionList"
                                :key="index"
                                v-model="form.direction"
                                :value="index"
                                :text="directionItem.short"
                            />
                        </div>
                    </div>
                </AnimationTransition>
                <CheckboxOptions
                    v-model="form.class"
                    class="col-md-2 col-12"
                    label="Классы"
                    :options="objectClassList"
                />
                <CheckboxOptions
                    v-model="form.gates"
                    class="col-md-5 col-12"
                    label="Тип ворот"
                    :options="gateTypeList"
                />
                <CheckboxOptions
                    v-model="form.floor_types"
                    class="col-md-5 col-12"
                    label="Тип пола"
                    :options="floorTypesFUCKOptions"
                />
            </div>
            <div class="row mt-2">
                <div class="col-md-7 col-12">
                    <span class="form__subtitle">Прочее</span>
                    <div class="form__row mt-1">
                        <CheckboxChip
                            v-model="form.water"
                            :value="form.water"
                            text="Вода"
                            multiple
                            :disabled-value="2"
                        />
                        <CheckboxChip v-model="form.gas" :value="form.gas" text="Газ" multiple />
                        <CheckboxChip
                            v-model="form.steam"
                            :value="form.steam"
                            text="Пар"
                            multiple
                            :disabled-value="2"
                        />
                        <CheckboxChip
                            v-model="form.sewage_central"
                            :value="form.sewage_central"
                            text="Канализация"
                            multiple
                            :disabled-value="2"
                        />
                        <CheckboxChip
                            v-model="form.racks"
                            :value="form.racks"
                            text="Стелажи"
                            multiple
                            :disabled-value="2"
                        />
                        <CheckboxChip
                            v-model="form.railway"
                            :value="form.railway"
                            text="Ж/Д ветка"
                            multiple
                            :disabled-value="2"
                        />
                        <CheckboxChip
                            v-model="form.has_cranes"
                            :value="form.has_cranes"
                            text="Краны"
                            multiple
                            :disabled-value="2"
                        />
                        <CheckboxChip
                            v-model="form.firstFloorOnly"
                            :value="form.firstFloorOnly"
                            text="Только 1 этаж"
                            multiple
                            :disabled-value="2"
                        />
                    </div>
                </div>
                <RadioOptions
                    v-model="form.status"
                    class="col-md-2 col-12"
                    label="Статус"
                    :options="ActivePassiveFUCK"
                    unselect
                />
                <RadioOptions
                    v-model="form.heated"
                    class="col-md-2 col-12"
                    label="Отопление"
                    :options="entityOptions.defaults.booleanSimple"
                    unselect
                />
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <span class="form__subtitle">Тип объекта</span>
                    <div class="row mt-2">
                        <ObjectTypePicker
                            v-model:value="form.purposes"
                            v-model:extra="form.object_type"
                            :extra-value="1"
                            label="Склад"
                            :options="objectPurposesWithSectionsOptions.warehouse"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.purposes"
                            v-model:extra="form.object_type"
                            :extra-value="2"
                            label="Производство"
                            :options="objectPurposesWithSectionsOptions.production"
                            class="col-md-4"
                        />
                        <ObjectTypePicker
                            v-model:value="form.purposes"
                            v-model:extra="form.object_type"
                            :extra-value="3"
                            label="Участок"
                            :options="objectPurposesWithSectionsOptions.plot"
                            class="col-md-4"
                        />
                    </div>
                </div>
                <div class="col-12 mt-2">
                    <span class="form__subtitle">Реклама</span>
                    <div class="form__row justify-content-around">
                        <RadioGroup
                            v-model="form.ad_avito"
                            unselect
                            class="form__column"
                            label="Авито"
                        />
                        <RadioGroup
                            v-model="form.ad_realtor"
                            unselect
                            class="form__column"
                            label="Realtor.ru"
                        />
                        <RadioGroup
                            v-model="form.ad_cian"
                            unselect
                            class="form__column"
                            label="Циан"
                        />
                        <RadioGroup
                            v-model="form.ad_yandex"
                            unselect
                            class="form__column"
                            label="Яндекс"
                        />
                        <RadioGroup
                            v-model="form.ad_free"
                            unselect
                            class="form__column"
                            label="Бесплатные"
                        />
                    </div>
                </div>
            </div>
        </Form>
    </Modal>
</template>

<script>
import { FormMixin } from '@/components/Forms/mixins.js';
import Modal from '@/components/common/Modal.vue';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import { onlyPositiveNumber } from '@//validators';
import useValidate from '@vuelidate/core';
import {
    areaRangeValidators,
    ceilingHeightValidators,
    pricePerFloorValidators
} from '@//validators/fields';
import RadioGroup from '@/components/common/Forms/RadioGroup.vue';
import ObjectTypePicker from '@/components/common/Forms/ObjectTypePicker.vue';
import { objectPurposesWithSectionsOptions } from '@/const/options/object.options.js';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import { entityOptions } from '@/const/options/options.js';
import RadioOptions from '@/components/common/Forms/RadioOptions.vue';
import { ActivePassive, ActivePassiveFUCK } from '@/const/const.js';

export default {
    name: 'FormModalOfferSearch',
    components: {
        RadioOptions,
        CheckboxOptions,
        ObjectTypePicker,
        RadioGroup,
        DoubleInput,
        RadioChip,
        CheckboxChip,
        AnimationTransition,
        Button,
        Modal
    },
    mixins: [FormMixin],
    emits: ['close'],
    data() {
        return {
            v$: useValidate()
        };
    },
    computed: {
        ActivePassiveFUCK() {
            return ActivePassiveFUCK;
        },
        ActivePassive() {
            return ActivePassive;
        },
        entityOptions() {
            return entityOptions;
        },
        objectPurposesWithSectionsOptions() {
            return objectPurposesWithSectionsOptions;
        },
        formCeilingHeightValidators() {
            return ceilingHeightValidators(this.form.rangeMaxCeilingHeight);
        },
        formPricePerFloorValidators() {
            return pricePerFloorValidators(this.form.rangeMaxPricePerFloor);
        },
        formAreaValidators() {
            return areaRangeValidators(this.form.rangeMaxArea);
        }
    },
    validations() {
        return {
            form: {
                rangeMaxDistanceFromMKAD: {
                    min: onlyPositiveNumber('Некорректная отрицательная удаленность')
                },
                rangeMinElectricity: {
                    min: onlyPositiveNumber()
                }
            }
        };
    }
};
</script>
