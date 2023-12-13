<template>
    <div class="ObjectHoldingsTabs">
        <ActionButton v-bind="actionButtons" class="ObjectHoldingsTabs-buttons"/>
        <Tabs :options="{ useUrlFragment: false }">
            <Tab name="Характеристики">
                <div class="ObjectHoldingsTabs-content-properties" v-if="!isPlot">
                    <PropertyList>
                        <PropertyListItem name="Общая площадь">
                            <with-unit-type class="ObjectHoldingsTabs-content-property"
                                            v-if="object.area_building !== null"
                                            :unit-type="unitTypes.SQUARE_METERS">
                                {{ $formatter.number(object.area_building) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="S - пола">
                            <with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.area_floor_full !== null"
                                            :unit-type="unitTypes.SQUARE_METERS">
                                {{ $formatter.number(object.area_floor_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="S - мезонина">
                            <with-unit-type class="ObjectHoldingsTabs-content-property"
                                            v-if="object.area_mezzanine_full !== null"
                                            :unit-type="unitTypes.SQUARE_METERS">
                                {{ $formatter.number(object.area_mezzanine_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                    </PropertyList>
                    <PropertyList>
                        <PropertyListItem name="S - офисов">
                            <with-unit-type class="ObjectHoldingsTabs-content-property"
                                            v-if="object.area_office_full !== null"
                                            :unit-type="unitTypes.SQUARE_METERS">
                                {{ $formatter.number(object.area_office_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="S - техническая">
                            <with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.area_tech_full !== null"
                                            :unit-type="unitTypes.SQUARE_METERS">
                                {{ $formatter.number(object.area_tech_full) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="Этажность склада">
                            <with-unit-type class="ObjectHoldingsTabs-content-property"
                                            v-if="object.floors !== null"
                                            :unit-type="unitTypes.FLOORS">
                                {{ $formatter.number(object.floors) }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="Класс объекта">
                            <p class="ObjectHoldingsTabs-content-property" v-if="object.object_class !== null">{{
                                    object.object_class_text
                                }}</p>
                        </PropertyListItem>
                    </PropertyList>
                    <PropertyList>
                        <PropertyListItem name="Внешняя отделка">
                            <p class="ObjectHoldingsTabs-content-property" :title="object.facing_type"
                               v-if="object.facing_type !== null">{{
                                    facingTypes[object.facing_type]
                                }}</p>
                        </PropertyListItem>
                        <PropertyListItem name="Год постройки">
                            <with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.yearBuild !== null"
                                            :unit-type="unitTypes.YEAR">
                                {{ object.year_build }}
                            </with-unit-type>
                        </PropertyListItem>
                        <PropertyListItem name="Год последнего ремонта">
                            <with-unit-type class="ObjectHoldingsTabs-content-property"
                                            v-if="object.year_repair !== null"
                                            :unit-type="unitTypes.YEAR">
                                {{ object.year_repair }}
                            </with-unit-type>
                        </PropertyListItem>
                    </PropertyList>
                    <PropertyList>
                        <PropertyListItem name="Кадастровый №">
                            <p class="ObjectHoldingsTabs-content-property"
                               :title="object.cadastral_number"
                               v-if="object.cadastral_number !== null">
                                {{ object.cadastral_number }}</p>
                        </PropertyListItem>
                        <PropertyListItem name="Правовой статус строения">
                            <p class="ObjectHoldingsTabs-content-property" v-if="object.own_type !== null">
                                {{ ownTypes[object.own_type] }}</p>
                        </PropertyListItem>
                        <PropertyListItem name="Ограничения">
                            <p class="ObjectHoldingsTabs-content-property" v-if="object.land_use_restrictions !== null">{{
                                    object.land_use_restrictions
                                }}</p>
                        </PropertyListItem>
                    </PropertyList>
                </div>
                <div class="ObjectHoldingsTabs-content-properties" v-else>
                    <PropertyList>
                        <PropertyListItem name="Площадь участка">
                            <with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.area_field_full !== null"
                                            :unit-type="unitTypes.SQUARE_METERS"
                                            :value="$formatter.number(object.area_field_full)"/>
                        </PropertyListItem>
                        <PropertyListItem name="Кадастровый № участка">
                            <p class="ObjectHoldingsTabs-content-property"
                               v-if="object.cadastral_number_land !== null">
                                {{ object.cadastral_number_land }}</p>
                        </PropertyListItem>
                        <PropertyListItem name="Правовой статус зем. уч.">
                            <p class="ObjectHoldingsTabs-content-property"
                               v-if="object.own_type_land !== null">{{ ownTypesLand[object.own_type_land] }}</p>
                        </PropertyListItem>
                        <PropertyListItem name="Категория земли">
                            <p class="ObjectHoldingsTabs-content-property"
                               v-if="object.land_category !== null">{{ landCategoryTypes[object.land_category] }}</p>
                        </PropertyListItem>
                        <PropertyListItem name="Рельеф участка">
                            <p class="ObjectHoldingsTabs-content-property"
                               v-if="object.object.landscape_type !== null">{{ landscapeTypes[object.landscape_type] }}</p>
                        </PropertyListItem>
                        <PropertyListItem name="Ограничения">
                            <p class="ObjectHoldingsTabs-content-property" v-if="object.land_use_restrictions !== null">{{
                                    object.land_use_restrictions
                                }}</p>
                        </PropertyListItem>
                    </PropertyList>
                </div>
            </Tab>
            <Tab name="Сделки">
<!--                <div class="ObjectHoldingsTabs-content">-->
<!--                    <ObjectDeals :object="object"/>-->
<!--                </div>-->
            </Tab>
            <Tab name="Карта сделок"></Tab>
            <Tab name="Планировки"></Tab>
            <Tab name="Презентации"></Tab>
            <Tab name="Договоры"></Tab>
            <Tab name="Панорамы"></Tab>
            <Tab name="Описание"></Tab>
            <Tab name="Задачи"></Tab>
        </Tabs>
    </div>
</template>

<script>
import {unitTypes} from "@/const/unitTypes";
import PropertyListItem from "@/components/Property/PropertyListItem.vue";
import PropertyList from "@/components/Property/PropertyList.vue";
import WithUnitType from "@/components/common/WithUnitType.vue";
import ActionButton from "@/components/common/ActionButton.vue";
import {facingTypes, landCategoryTypes, landscapeTypes, ownTypes, ownTypesLand} from "../../../const/types";

export default {
    name: "ComplexHoldingTabs",
    components: {
        ActionButton,
        WithUnitType,
        PropertyList,
        PropertyListItem

    },
    props: {
        object: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            unitTypes
        };
    },
    computed: {
        landscapeTypes() {
            return landscapeTypes
        },
        landCategoryTypes() {
            return landCategoryTypes
        },
        ownTypesLand() {
            return ownTypesLand
        },
        ownTypes() {
            return ownTypes
        },
        facingTypes() {
            return facingTypes
        },
        actionButtons() {
            return {
                edit: {value: true},
                advert: {value: true},
                dislike: {value: true},
                notifications: {value: true},
                pdf: {value: true},
            };
        },
        isPlot() {
            return 0;
            // TODO: Проверить различие типов объекта и вывода этого блока на других объектах
            //return this.object.objectType.includes(ObjectTypes.PLOT)
        }
    },
    methods: {},
};
</script>
