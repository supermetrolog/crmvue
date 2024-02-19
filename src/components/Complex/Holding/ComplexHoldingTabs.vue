<template>
    <div class="ObjectHoldingsTabs">
        <ComplexActions simple class="ObjectHoldingsTabs-buttons" :buttons="actionButtons" />
        <Tabs ref="tabs" closed :options="{ useUrlFragment: false }">
            <Tab name="Характеристики">
                <div v-if="!isPlot" class="ObjectHoldingsTabs-content-properties">
                    <PropertyList>
                        <PropertyListItem name="Общая площадь">
                            <with-unit-type
                                v-if="object.area_building !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.SQUARE_METERS"
                            >
                                {{ $formatter.number(object.area_building) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="S - пола">
                            <with-unit-type
                                v-if="object.area_floor_full !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.SQUARE_METERS"
                            >
                                {{ $formatter.number(object.area_floor_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="S - мезонина">
                            <with-unit-type
                                v-if="object.area_mezzanine_full !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.SQUARE_METERS"
                            >
                                {{ $formatter.number(object.area_mezzanine_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                    </PropertyList>
                    <PropertyList>
                        <PropertyListItem name="S - офисов">
                            <with-unit-type
                                v-if="object.area_office_full !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.SQUARE_METERS"
                            >
                                {{ $formatter.number(object.area_office_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="S - техническая">
                            <with-unit-type
                                v-if="object.area_tech_full !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.SQUARE_METERS"
                            >
                                {{ $formatter.number(object.area_tech_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="Этажность склада">
                            <with-unit-type
                                v-if="object.floors !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.FLOORS"
                            >
                                {{ $formatter.number(object.floors) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="Класс объекта">
                            <p
                                v-if="object.object_class !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ object.object_class_text }}
                            </p>
                        </PropertyListItem>
                    </PropertyList>
                    <PropertyList>
                        <PropertyListItem name="Внешняя отделка">
                            <p
                                v-if="object.facing_type !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :title="object.facing_type"
                            >
                                {{ facingTypes[object.facing_type] }}
                            </p>
                        </PropertyListItem>
                        <PropertyListItem name="Год постройки">
                            <with-unit-type
                                v-if="object.yearBuild !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.YEAR"
                            >
                                {{ object.year_build }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="Год последнего ремонта">
                            <with-unit-type
                                v-if="object.year_repair !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.YEAR"
                            >
                                {{ object.year_repair }}
                            </with-unit-type>
                        </PropertyListItem>
                    </PropertyList>
                    <PropertyList>
                        <PropertyListItem name="Кадастровый №">
                            <p
                                v-if="object.cadastral_number !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :title="object.cadastral_number"
                            >
                                {{ object.cadastral_number }}
                            </p>
                        </PropertyListItem>
                        <PropertyListItem name="Правовой статус строения">
                            <p
                                v-if="object.own_type !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ ownTypes[object.own_type] }}
                            </p>
                        </PropertyListItem>
                        <PropertyListItem name="Ограничения">
                            <p
                                v-if="object.land_use_restrictions !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ object.land_use_restrictions ? 'Есть' : '-' }}
                            </p>
                        </PropertyListItem>
                    </PropertyList>
                </div>
                <div v-else class="ObjectHoldingsTabs-content-properties">
                    <PropertyList>
                        <PropertyListItem name="Площадь участка">
                            <with-unit-type
                                v-if="object.area_field_full !== null"
                                class="ObjectHoldingsTabs-content-property"
                                :unit-type="unitTypes.SQUARE_METERS"
                                :value="$formatter.number(object.area_field_full)"
                            />
                        </PropertyListItem>
                        <PropertyListItem name="Кадастровый № участка">
                            <p
                                v-if="object.cadastral_number_land !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ object.cadastral_number_land }}
                            </p>
                        </PropertyListItem>
                        <PropertyListItem name="Правовой статус зем. уч.">
                            <p
                                v-if="object.own_type_land !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ ownTypesLand[object.own_type_land] }}
                            </p>
                        </PropertyListItem>
                        <PropertyListItem name="Категория земли">
                            <p
                                v-if="object.land_category !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ landCategoryTypes[object.land_category] }}
                            </p>
                        </PropertyListItem>
                        <PropertyListItem name="Рельеф участка">
                            <p
                                v-if="object.object.landscape_type !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ landscapeTypes[object.landscape_type] }}
                            </p>
                        </PropertyListItem>
                        <PropertyListItem name="Ограничения">
                            <p
                                v-if="object.land_use_restrictions !== null"
                                class="ObjectHoldingsTabs-content-property"
                            >
                                {{ object.land_use_restrictions ? 'Есть' : '-' }}
                            </p>
                        </PropertyListItem>
                    </PropertyList>
                </div>
            </Tab>
            <Tab :id="`deals-${object.id}`" :name="`Сделки (${object.commercialOffers.length})`">
                <div class="ObjectHoldingsTabs-content">
                    <ComplexDeals
                        :object="object"
                        :deals="object.commercialOffers"
                        :floors="object.floorsRecords"
                    />
                </div>
            </Tab>
            <Tab name="Карта сделок"></Tab>
            <Tab name="Планировки"></Tab>
            <Tab name="Презентации">
                <template v-if="object.building_presentations.length">
                    <div
                        v-for="(presentation, index) in object.building_presentations"
                        :key="index"
                        class="complex-document"
                    >
                        <a href="#" class="complex-document__link">
                            <i class="fa-regular fa-file-powerpoint complex-document__preview" />
                            <p class="complex-document__name">Название презентации</p>
                        </a>
                    </div>
                </template>
                <div v-else class="complex-document complex-document--green">
                    <a href="#" class="complex-document__link">
                        <i class="fa-regular fa-file-powerpoint complex-document__preview" />
                        <p class="complex-document__name">Добавить презентацию</p>
                    </a>
                </div>
            </Tab>
            <Tab name="Договоры"></Tab>
            <Tab name="Описание"></Tab>
            <Tab name="Задачи"></Tab>
        </Tabs>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import PropertyListItem from '@/components/common/Property/PropertyListItem.vue';
import PropertyList from '@/components/common/Property/PropertyList.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import {
    facingTypes,
    landCategoryTypes,
    landscapeTypes,
    ownTypes,
    ownTypesLand
} from '@/const/types';
import ComplexDeals from '@/components/Complex/Deal/ComplexDeals.vue';
import ComplexActions from '@/components/Complex/ComplexActions.vue';

export default {
    name: 'ComplexHoldingTabs',
    components: {
        ComplexActions,
        ComplexDeals,
        WithUnitType,
        PropertyList,
        PropertyListItem
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            unitTypes
        };
    },
    computed: {
        landscapeTypes() {
            return landscapeTypes;
        },
        landCategoryTypes() {
            return landCategoryTypes;
        },
        ownTypesLand() {
            return ownTypesLand;
        },
        ownTypes() {
            return ownTypes;
        },
        facingTypes() {
            return facingTypes;
        },
        actionButtons() {
            return {
                edit: {},
                advert: { value: true },
                dislike: { value: false },
                notifications: { value: false },
                pdf: { value: false }
            };
        },
        isPlot() {
            return 0;
            // TODO: Проверить различие типов объекта и вывода этого блока на других объектах
            //return this.object.objectType.includes(ObjectTypes.PLOT)
        }
    },
    methods: {},
    mounted() {
        if (this.$route.query.offer_id) {
            const offerId = this.$route.query.offer_id;

            const objectHasTargetDeal = this.object.commercialOffers.some(
                offer => offer.id == offerId
            );

            if (objectHasTargetDeal) this.$refs.tabs.selectTab('#deals-' + this.object.id);
        }
    }
};
</script>
