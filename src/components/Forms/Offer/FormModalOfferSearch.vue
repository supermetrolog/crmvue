<template>
    <Modal @close="$emit('close')" title="Фильтры">
        <template #header>
            <span v-if="filterCount" class="badge badge-danger">
                {{ filterCount }}
            </span>
        </template>
        <Form @submit="onSubmit">
            <div class="row mb-2">
                <div class="col-8">
                    <Input
                        v-model="form.all"
                        @keydown.enter="onSubmit"
                        label="Поиск"
                        placeholder="ID, адрес, собственник, телефон, ФИО"
                    />
                </div>
                <div class="col-4 align-self-end">
                    <div class="offer-search__actions">
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
                />
                <Input
                    v-else
                    v-model="form.approximateDistanceFromMKAD"
                    maska="###"
                    placeholder="не более"
                    label="Удаленность от МКАД +30%"
                    class="col-md-3 col-12"
                />
                <Input
                    v-model="form.rangeMinElectricity"
                    placeholder="не менее"
                    maska="##########"
                    label="Электричесвто (квт)"
                    class="col-md-3 col-12"
                />
                <div class="col-md-3 col-6">
                    <div class="row">
                        <Input
                            v-model="form.rangeMinArea"
                            maska="##########"
                            label="S пола (м^2)"
                            placeholder="От:"
                            class="col-12 mb-1"
                            type="number"
                        />
                        <Input
                            v-model="form.rangeMaxArea"
                            maska="##########"
                            placeholder="До:"
                            class="col-12"
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
                            label="Цена (продажи, аренды, о-х)"
                            class="col-12 mb-1"
                            type="number"
                        />
                        <Input
                            v-if="typeof form.approximateMaxPricePerFloor == 'undefined'"
                            v-model="form.rangeMaxPricePerFloor"
                            maska="##########"
                            placeholder="До:"
                            class="col-12"
                            type="number"
                        />
                        <Input
                            v-else
                            v-model="form.approximateMaxPricePerFloor"
                            maska="##########"
                            placeholder="До:"
                            class="col-12"
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
                            class="col-12 mb-1"
                            type="number"
                        />
                        <Input
                            v-model="form.rangeMaxCeilingHeight"
                            maska="##########"
                            placeholder="До:"
                            class="col-12"
                            type="number"
                        />
                    </div>
                </div>
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
            </div>
            <div class="row mt-2">
                <div class="col-7">
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
                    </div>
                </div>
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
                                <RadioChip v-model="form.ad_cian" label="Да" :value="1" unselect />
                                <RadioChip v-model="form.ad_cian" label="Нет" :value="0" unselect />
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
                                <RadioChip v-model="form.ad_free" label="Да" :value="1" unselect />
                                <RadioChip v-model="form.ad_free" label="Нет" :value="0" unselect />
                            </div>
                        </div>
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

export default {
    name: 'FormModalOfferSearch',
    components: { RadioChip, CheckboxChip, AnimationTransition, Button, Modal },
    mixins: [FormMixin],
    emits: ['close']
};
</script>
