<template>
    <div class="company-request-search-form">
        <Form @submit="onSubmit">
            <FormGroup class="mb-2">
                <Input
                    v-model="form.all"
                    @keydown.enter="onSubmit"
                    label="Поиск"
                    placeholder="ID, адрес, собственник, телефон, ФИО"
                    class="col-12 main-input"
                />
            </FormGroup>
            <FormGroup>
                <div class="col-12">
                    <div class="offer-search__actions">
                        <Button
                            @click="extraVisible = !extraVisible"
                            icon
                            :badge="filterCount || false"
                        >
                            <span>Фильтры</span>
                            <i v-if="extraVisible" class="fas fa-angle-up"></i>
                            <i v-else class="fas fa-angle-down"></i>
                        </Button>
                        <Button
                            @click="clickFavorites"
                            warning
                            :active="form.favorites"
                            :badge="favoritesCount || false"
                        >
                            избранные
                        </Button>
                        <AnimationTransition>
                            <Button v-if="filterCount" @click="resetForm" danger>
                                Сбросить фильтры
                            </Button>
                        </AnimationTransition>
                        <AnimationTransition>
                            <Button
                                v-for="btn in additionalButtons"
                                :key="btn.label"
                                @click="$emit(btn.event)"
                                danger
                                class="ml-auto"
                            >
                                {{ btn.label }}
                            </Button>
                        </AnimationTransition>
                    </div>
                </div>
            </FormGroup>
            <div v-show="extraVisible">
                <FormGroup class="mb-2">
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
                        class="col-md-2 col-12"
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
                </FormGroup>
                <FormGroup class="mb-2">
                    <DoubleInput
                        v-model:first="form.rangeMinArea"
                        v-model:second="form.rangeMaxArea"
                        label="S пола"
                        class="col-4"
                        unit="м<sup>2</sup>"
                        type="number"
                        :validators="formAreaValidators"
                        reactive
                    />
                    <DoubleInput
                        v-model:first="form.rangeMinPricePerFloor"
                        v-model:second="form.rangeMaxPricePerFloor"
                        label="Цена (продажи, аренды, о-х)"
                        class="col-4"
                        unit="₽"
                        type="number"
                        reactive
                        :validators="formPricePerFloorValidators"
                    />
                    <DoubleInput
                        v-model:first="form.rangeMinCeilingHeight"
                        v-model:second="form.rangeMaxCeilingHeight"
                        label="Высота потолков"
                        class="col-4"
                        unit="м"
                        type="number"
                        reactive
                        :validators="formCeilingHeightValidators"
                    />
                </FormGroup>
                <FormGroup class="mb-2">
                    <MultiSelect
                        v-model="form.fakeRegion"
                        @change="changeRegion"
                        label="Регионы"
                        class="col-md-3 col-6"
                        mode="single"
                        :options="
                            async () => {
                                await FETCH_REGION_LIST();
                                return REGION_LIST;
                            }
                        "
                    />
                </FormGroup>
                <FormGroup class="mb-2">
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
                    <div class="col-2">
                        <span class="form__subtitle">Классы</span>
                        <div class="form__row mt-1">
                            <CheckboxChip
                                v-for="(objectClass, index) in objectClassList"
                                :key="index"
                                v-model="form.class"
                                :value="index"
                                :text="objectClass"
                            />
                        </div>
                    </div>
                    <div class="col-5">
                        <span class="form__subtitle">Тип ворот</span>
                        <div class="form__row mt-1">
                            <CheckboxChip
                                v-for="(gateType, index) in gateTypeList"
                                :key="index"
                                v-model="form.gates"
                                :value="index"
                                :text="gateType"
                            />
                        </div>
                    </div>
                    <div class="col-5">
                        <span class="form__subtitle">Тип пола</span>
                        <div class="form__row mt-1">
                            <CheckboxChip
                                v-for="(floorType, index) in floorTypesFUCKOptions"
                                :key="index"
                                v-model="form.floor_types"
                                :value="index"
                                :text="floorType"
                            />
                        </div>
                    </div>
                </FormGroup>
                <FormGroup class="mb-2">
                    <div class="col-7">
                        <span class="form__subtitle">Прочее</span>
                        <div class="form__row mt-1">
                            <CheckboxChip
                                v-model="form.water"
                                :value="form.water"
                                text="Вода"
                                multiple
                            />
                            <CheckboxChip
                                v-model="form.gas"
                                :value="form.gas"
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
                                v-model="form.sewage_central"
                                :value="form.sewage_central"
                                text="Канализация"
                                multiple
                            />
                            <CheckboxChip
                                v-model="form.racks"
                                :value="form.racks"
                                text="Стелажи"
                                multiple
                            />
                            <CheckboxChip
                                v-model="form.railway"
                                :value="form.railway"
                                text="Ж/Д ветка"
                                multiple
                            />
                            <CheckboxChip
                                v-model="form.has_cranes"
                                :value="form.has_cranes"
                                text="Краны"
                                multiple
                            />
                            <CheckboxChip
                                v-model="form.firstFloorOnly"
                                :value="form.firstFloorOnly"
                                text="Только 1 этаж"
                                multiple
                            />
                        </div>
                    </div>
                </FormGroup>
                <FormGroup class="mb-2">
                    <div class="col-2">
                        <span class="form__subtitle">Статус</span>
                        <div class="form__row mt-1">
                            <RadioChip v-model="form.status" label="Актив" :value="1" unselect />
                            <RadioChip v-model="form.status" label="Пассив" :value="2" unselect />
                        </div>
                    </div>
                    <div class="col-2">
                        <span class="form__subtitle">Отопление</span>
                        <div class="form__row mt-1">
                            <RadioChip v-model="form.heated" label="Да" :value="1" unselect />
                            <RadioChip v-model="form.heated" label="Нет" :value="2" unselect />
                        </div>
                    </div>
                </FormGroup>
                <FormGroup class="mb-2">
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
                                class="col-md-5 col-12"
                                :options="objectTypeListProduction"
                            />
                            <CheckboxIcons
                                v-model="form.purposes"
                                @extraSelect="selectObjectType"
                                extra-label="участок"
                                :no-all-select="true"
                                :extra-value="3"
                                :extra-options="form.object_type"
                                class="col-md-3 col-12"
                                :options="objectTypeListPlot"
                            />
                        </div>
                    </div>
                </FormGroup>
                <FormGroup class="mb-2">
                    <div class="col-12 mt-2">
                        <span class="form__subtitle">Реклама</span>
                        <div class="form__row justify-content-around">
                            <div class="form__column">
                                <span class="form__subtitle">Realtor.ru</span>
                                <div class="form__row">
                                    <RadioChip
                                        v-model="form.ad_realtor"
                                        label="Да"
                                        :value="1"
                                        unselect
                                    />
                                    <RadioChip
                                        v-model="form.ad_realtor"
                                        label="Нет"
                                        :value="0"
                                        unselect
                                    />
                                </div>
                            </div>
                            <div class="form__column">
                                <span class="form__subtitle">Циан</span>
                                <div class="form__row">
                                    <RadioChip
                                        v-model="form.ad_cian"
                                        label="Да"
                                        :value="1"
                                        unselect
                                    />
                                    <RadioChip
                                        v-model="form.ad_cian"
                                        label="Нет"
                                        :value="0"
                                        unselect
                                    />
                                </div>
                            </div>
                            <div class="form__column">
                                <span class="form__subtitle">Яндекс</span>
                                <div class="form__row">
                                    <RadioChip
                                        v-model="form.ad_yandex"
                                        label="Да"
                                        :value="1"
                                        unselect
                                    />
                                    <RadioChip
                                        v-model="form.ad_yandex"
                                        label="Нет"
                                        :value="0"
                                        unselect
                                    />
                                </div>
                            </div>
                            <div class="form__column">
                                <span class="form__subtitle">Бесплатные</span>
                                <div class="form__row">
                                    <RadioChip
                                        v-model="form.ad_free"
                                        label="Да"
                                        :value="1"
                                        unselect
                                    />
                                    <RadioChip
                                        v-model="form.ad_free"
                                        label="Нет"
                                        :value="0"
                                        unselect
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </FormGroup>
            </div>
        </Form>
    </div>
</template>

<script>
import { FormMixin } from '@/components/Forms/mixins.js';
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import DoubleInput from '@/components/common/Forms/DoubleInput.vue';
import {
    areaRangeValidators,
    ceilingHeightValidators,
    pricePerFloorValidators
} from '@//validators/fields';
import { onlyPositiveNumber } from '@//validators';
import useVuelidate from '@vuelidate/core';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';

export default {
    name: 'FormOfferSearch',
    components: { RadioChip, CheckboxChip, DoubleInput, AnimationTransition, Button },
    mixins: [FormMixin],
    data() {
        return {
            v$: useVuelidate()
        };
    },
    computed: {
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
    methods: {
        changeLocationToMap() {
            this.$router.push({ name: 'OffersMap', query: this.$route.query });
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

<style></style>
