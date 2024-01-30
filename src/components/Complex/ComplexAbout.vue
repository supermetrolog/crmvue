<template>
    <div id="ComplexAbout" class="ComplexAbout">
        <Tabs :options="{ useUrlFragment: false }">
            <Tab v-if="complex" name="О комплексе">
                <div class="ComplexAbout-content">
                    <template v-if="complex">
                        <PropertyList title="Площади">
                            <PropertyListItem name="S - участка общая">
                                <with-unit-type
                                    v-if="complex.area_field_full !== null"
                                    class="ComplexAbout-property"
                                    :unit-type="unitTypes.SQUARE_METERS"
                                >
                                    {{ $formatter.number(complex.area_field_full) }}
                                </with-unit-type>
                            </PropertyListItem>
                            <PropertyListItem name="S - строений в комплексе">
                                <with-unit-type
                                    v-if="complex.area_building !== null"
                                    class="ComplexAbout-property"
                                    :unit-type="unitTypes.SQUARE_METERS"
                                >
                                    {{ $formatter.number(complex.area_building) }}
                                </with-unit-type>
                            </PropertyListItem>
                            <PropertyListItem name="S - этажей общая">
                                <with-unit-type
                                    v-if="complex.area_floor_full !== null"
                                    class="ComplexAbout-property"
                                    :unit-type="unitTypes.SQUARE_METERS"
                                >
                                    {{ $formatter.number(complex.area_floor_full) }}
                                </with-unit-type>
                            </PropertyListItem>
                            <PropertyListItem name="S - оффисов общая">
                                <with-unit-type
                                    v-if="complex.area_office_full !== null"
                                    class="ComplexAbout-property"
                                    :unit-type="unitTypes.SQUARE_METERS"
                                >
                                    {{ $formatter.number(complex.area_office_full) }}
                                </with-unit-type>
                            </PropertyListItem>
                            <PropertyListItem name="S - техническая общая">
                                <with-unit-type
                                    v-if="complex.area_tech_full !== null"
                                    class="ComplexAbout-property"
                                    :unit-type="unitTypes.SQUARE_METERS"
                                >
                                    {{ $formatter.number(complex.area_tech_full) }}
                                </with-unit-type>
                            </PropertyListItem>
                            <PropertyListItem name="Управляющая компания">
                                <p
                                    v-if="complex.managment_company_id"
                                    class="ComplexAbout-property"
                                >
                                    {{ managmentCompany }}
                                </p>
                            </PropertyListItem>
                        </PropertyList>
                        <PropertyList title="Коммуникации">
                            <PropertyListItem name="Электричество">
                                <template v-if="complex.power !== null">
                                    <with-unit-type
                                        v-if="complex.power"
                                        class="ComplexAbout-property"
                                        :unit-type="unitTypes.KILOWATT"
                                    >
                                        {{ $formatter.number(complex.power_value) }}
                                    </with-unit-type>
                                    <p v-else class="ComplexAbout-property">нет</p>
                                </template>
                            </PropertyListItem>
                            <PropertyListItem name="Отопление центральное">
                                <p v-if="complex.heating !== null" class="ComplexAbout-property">
                                    {{ isExists(complex.heating) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Отопление автономное">
                                <template v-if="complex.heating_autonomous !== null">
                                    <p
                                        v-if="complex.heating_autonomous"
                                        class="ComplexAbout-property"
                                        :title="
                                            complex.heating_autonomous_type
                                                ? 'есть, ' + heatingAutonomousType
                                                : 'есть'
                                        "
                                    >
                                        есть{{ complex.heating_autonomous_type ? ',' : null }}
                                        <span class="ComplexAbout-property-grey">{{
                                            heatingAutonomousType
                                        }}</span>
                                    </p>
                                    <p v-else class="ComplexAbout-property">нет</p>
                                </template>
                            </PropertyListItem>
                            <PropertyListItem name="Водоснабжение">
                                <template v-if="complex.water !== null">
                                    <p
                                        v-if="complex.water"
                                        class="ComplexAbout-property"
                                        :title="
                                            complex.water_type.length > 0
                                                ? 'есть, ' + joinedWaterType
                                                : 'есть'
                                        "
                                    >
                                        есть{{ complex.water_type.length > 0 ? ',' : null }}
                                        <with-unit-type
                                            v-if="complex.water_value"
                                            :unit-type="unitTypes.CUBE_METERS_PER_HOUR"
                                        >
                                            {{ $formatter.number(complex.water_value) }}
                                        </with-unit-type>
                                        <span class="ComplexAbout-property-grey">{{
                                            joinedWaterType
                                        }}</span>
                                    </p>
                                    <p v-else class="ComplexAbout-property">нет</p>
                                </template>
                            </PropertyListItem>
                            <PropertyListItem name="Канализация">
                                <p v-if="complex.sewage !== null" class="ComplexAbout-property">
                                    {{ isExists(complex.sewage) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Ливневая канал.">
                                <p
                                    v-if="complex.sewage_rain !== null"
                                    class="ComplexAbout-property"
                                >
                                    {{ isExists(complex.sewage_rain) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Газ">
                                <template v-if="complex.gas !== null">
                                    <p
                                        v-if="complex.gas"
                                        class="ComplexAbout-property"
                                        :title="complex.gas_type ? 'есть, ' + gasType : 'есть'"
                                    >
                                        есть{{ complex.gas_type ? ',' : null }}
                                        <with-unit-type
                                            v-if="complex.gas_value"
                                            :unit-type="unitTypes.CUBE_METERS_PER_HOUR"
                                        >
                                            {{ $formatter.number(complex.gas_value) }}
                                        </with-unit-type>
                                        <span class="ComplexAbout-property-grey">{{
                                            gasType
                                        }}</span>
                                    </p>
                                    <p v-else class="ComplexAbout-property">нет</p>
                                </template>
                            </PropertyListItem>
                            <PropertyListItem name="Пар">
                                <template v-if="complex.steam !== null">
                                    <p v-if="complex.steam" class="ComplexAbout-property">
                                        есть{{ complex.steam_value ? ',' : '' }}
                                        <with-unit-type
                                            v-if="complex.steam_value"
                                            :unit-type="unitTypes.CUBE_METERS_PER_HOUR"
                                        >
                                            {{ $formatter.number(complex.steam_value) }}
                                        </with-unit-type>
                                    </p>
                                    <p v-else class="ComplexAbout-property">нет</p>
                                </template>
                            </PropertyListItem>
                            <PropertyListItem name="Телефония">
                                <p v-if="complex.phone_line !== null" class="ComplexAbout-property">
                                    {{ isExists(complex.phone_line) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Интернет">
                                <template v-if="complex.internet !== null">
                                    <p
                                        v-if="complex.internet"
                                        class="ComplexAbout-property"
                                        :title="
                                            complex.internet_type.length > 0
                                                ? 'есть, ' + joinedInternetType
                                                : 'есть'
                                        "
                                    >
                                        есть{{ complex.internet_type.length > 0 ? ',' : null }}
                                        <span class="ComplexAbout-property-grey">{{
                                            joinedInternetType
                                        }}</span>
                                    </p>
                                    <p v-else class="ComplexAbout-property">нет</p>
                                </template>
                            </PropertyListItem>
                        </PropertyList>
                        <PropertyList title="Безопасность">
                            <PropertyListItem name="Охрана объекта">
                                <template v-if="complex.guard !== null">
                                    <p
                                        v-if="complex.guard"
                                        class="ComplexAbout-property"
                                        :title="
                                            complex.guard_type.length > 0
                                                ? 'есть, ' + joinedGuardType
                                                : 'есть'
                                        "
                                    >
                                        есть{{ complex.guard_type.length > 0 ? ',' : null }}
                                        <span class="ComplexAbout-property-grey">{{
                                            joinedGuardType
                                        }}</span>
                                    </p>
                                    <p v-else class="ComplexAbout-property">нет</p>
                                </template>
                            </PropertyListItem>
                            <PropertyListItem name="Видеонабл. наруж.">
                                <p
                                    v-if="complex.video_control !== null"
                                    class="ComplexAbout-property"
                                >
                                    {{ isExists(complex.video_control) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Контр. дост. наруж.">
                                <p
                                    v-if="complex.access_control !== null"
                                    class="ComplexAbout-property"
                                >
                                    {{ isExists(complex.access_control) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Охран. сигнал. наруж.">
                                <p
                                    v-if="complex.security_alert !== null"
                                    class="ComplexAbout-property"
                                >
                                    {{ isExists(complex.security_alert) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Шлагбаум">
                                <p v-if="complex.barrier !== null" class="ComplexAbout-property">
                                    {{ isExists(complex.barrier) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Забор по периметру">
                                <p
                                    v-if="complex.fence_around_perimeter !== null"
                                    class="ComplexAbout-property"
                                >
                                    {{ isExists(complex.fence_around_perimeter) }}
                                </p>
                            </PropertyListItem>
                            <PropertyListItem name="Пожарная сигнализация">
                                <p v-if="complex.fire_alert !== null" class="ComplexAbout-property">
                                    {{ isExists(complex.fire_alert) }}
                                </p>
                            </PropertyListItem>
                        </PropertyList>
                        <PropertyList :title="['Ж/Д на территории', 'Инфраструктура']">
                            <template #0>
                                <PropertyListItem name="Ж/Д ветка">
                                    <p
                                        v-if="complex.railway !== null"
                                        class="ComplexAbout-property"
                                    >
                                        {{ isExists(complex.railway) }}
                                        <span v-if="complex.railway_value">
                                            {{ complex.railway_value }} м
                                        </span>
                                    </p>
                                </PropertyListItem>
                            </template>
                            <template #1>
                                <PropertyListItem name="Въезд на территорию">
                                    <template v-if="complex.entry_territory !== null">
                                        <p
                                            v-if="
                                                complex.entry_territory &&
                                                complex.entry_territory_type
                                            "
                                            class="ComplexAbout-property"
                                        >
                                            {{ entryTerritoryType }}
                                        </p>
                                        <p
                                            v-else-if="complex.entry_territory"
                                            class="ComplexAbout-property"
                                        >
                                            есть
                                        </p>
                                        <p v-else class="ComplexAbout-property">нет</p>
                                    </template>
                                </PropertyListItem>
                                <PropertyListItem name="Плата за въезд">
                                    <p
                                        v-if="
                                            complex.entrance_type !== null && complex.entrance_type
                                        "
                                        class="ComplexAbout-property"
                                    >
                                        {{ entryFee }}
                                    </p>
                                </PropertyListItem>
                                <PropertyListItem name="«P» легковая">
                                    <template v-if="complex.parking_car !== null">
                                        <p
                                            v-if="complex.parking_car"
                                            class="ComplexAbout-property"
                                            :title="'есть, ' + parkingCarType"
                                        >
                                            есть, {{ parkingCarType }}
                                        </p>
                                        <p v-else class="ComplexAbout-property">нет</p>
                                    </template>
                                </PropertyListItem>
                                <PropertyListItem name="«P» 3-10 тонн">
                                    <template v-if="complex.parking_lorry !== null">
                                        <p
                                            v-if="complex.parking_lorry"
                                            class="ComplexAbout-property"
                                            :title="'есть, ' + parkingLorryType"
                                        >
                                            есть, {{ parkingLorryType }}
                                        </p>
                                        <p v-else class="ComplexAbout-property">нет</p>
                                    </template>
                                </PropertyListItem>
                                <PropertyListItem name="«P» от 10 тонн">
                                    <template v-if="complex.parking_truck !== null">
                                        <p
                                            v-if="complex.parking_truck"
                                            class="ComplexAbout-property"
                                            :title="'есть, ' + parkingTruckType"
                                        >
                                            есть, {{ parkingTruckType }}
                                        </p>
                                        <p v-else class="ComplexAbout-property">нет</p>
                                    </template>
                                </PropertyListItem>
                                <PropertyListItem name="Столовая/кафе">
                                    <p
                                        v-if="complex.canteen !== null"
                                        class="ComplexAbout-property"
                                    >
                                        {{ isExists(complex.canteen) }}
                                    </p>
                                </PropertyListItem>
                                <PropertyListItem name="Общежитие">
                                    <p v-if="complex.hostel !== null" class="ComplexAbout-property">
                                        {{ isExists(complex.hostel) }}
                                    </p>
                                </PropertyListItem>
                            </template>
                        </PropertyList>
                    </template>
                    <template v-else>Нет данных</template>
                </div>
            </Tab>
            <Tab name="План Территории">
                <div class="ComplexAbout-content">План не загружен</div>
            </Tab>
            <Tab name="Презентации">
                <div class="row">
                    <div class="col-12">
                        <div class="complex__list">
                            <template v-if="complex.building_presentations.length">
                                <div
                                    v-for="(presentation, index) in complex.building_presentations"
                                    :key="index"
                                    class="complex-document"
                                >
                                    <a href="#" class="complex-document__link">
                                        <i
                                            class="fa-regular fa-file-powerpoint complex-document__preview"
                                        />
                                        <p class="complex-document__name">Название презентации</p>
                                    </a>
                                </div>
                            </template>
                            <div v-else class="complex-document complex-document--green">
                                <a href="#" class="complex-document__link">
                                    <i
                                        class="fa-regular fa-file-powerpoint complex-document__preview"
                                    />
                                    <p class="complex-document__name">Добавить презентацию</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
            <Tab name="Документы">
                <div class="row">
                    <div class="col-12">
                        <div class="complex__list">
                            <div class="complex-document complex-document--green">
                                <a href="#" class="complex-document__link">
                                    <i class="fa-regular fa-file-word complex-document__preview" />
                                    <p class="complex-document__name">Добавить документ</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
        </Tabs>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';
import PropertyListItem from '@/components/common/Property/PropertyListItem.vue';
import PropertyList from '@/components/common/Property/PropertyList.vue';
import {
    entryTerritoryTypes,
    feeTypes,
    gasTypes,
    guardTypes,
    heatingAutonomousTypes,
    internetTypes,
    waterTypes
} from '@/const/types';

export default {
    name: 'ComplexAbout',
    components: { PropertyList, PropertyListItem, WithUnitType },
    inject: {
        injectedIsMobile: {
            from: 'isMobile'
        }
    },
    props: {
        complex: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            unitTypes,
            isMobile: this.injectedIsMobile
        };
    },
    computed: {
        heatingAutonomousType() {
            return heatingAutonomousTypes[Number(this.complex.heating_autonomous_type[2])];
        },
        managmentCompany() {
            return this.complex.managment_company_id ? this.complex.managment_company_value : 'нет';
        },
        joinedGuardType() {
            return this.complex.guard_type
                ? this.complex.guard_type.map(guardType => guardTypes[guardType]).join(', ')
                : '';
        },
        joinedInternetType() {
            return this.complex.internet_type
                ? this.complex.internet_type
                      .map(internetType => internetTypes[internetType])
                      .join(', ')
                : '';
        },
        joinedWaterType() {
            return this.complex.water_type
                ? this.complex.water_type.map(waterType => waterTypes[waterType]).join(', ')
                : '';
        },
        gasType() {
            return this.complex.gas ? gasTypes[this.complex.gas] : 'нет';
        },
        entryTerritoryType() {
            return entryTerritoryTypes[this.complex.entry_territory_type];
        },
        entryFee() {
            return feeTypes[this.complex.entry_territory];
        },
        parkingCarType() {
            return feeTypes[this.complex.parking_car_type];
        },
        parkingLorryType() {
            return feeTypes[this.complex.parking_lorry_type];
        },
        parkingTruckType() {
            return feeTypes[this.complex.parking_truck_type];
        }
    },
    methods: {
        isExists(value) {
            return value ? 'есть' : 'нет';
        }
    },
    mounted() {
        if (this.isMobile) {
            return;
        } else {
            requestAnimationFrame(() => {
                // const listElement = document.getElementById("ComplexAbout");
                // const listHeight = listElement.clientHeight;
            });
        }

        console.log(this.complex);
    }
};
</script>
