<template>
    <div class="building-info">
        <div class="building-info__table-list">
            <PropertyList class="building-info__table">
                <p class="building-info__heading">
                    {{ formattedAreaSum }}
                    <span> м<sup>2</sup> </span>
                </p>
                <PropertyListItem
                    v-for="(prop, idx) in area.properties"
                    :key="prop.label + idx"
                    :name="prop.label"
                    :value="prop.value"
                    :valueMin="prop.valueMin"
                    :valueMax="prop.valueMax"
                    :unitType="unitTypes.SQUARE_METERS"
                />
            </PropertyList>
            <PropertyList class="building-info__table">
                <p class="building-info__heading">
                    {{ formattedPriceSum }}
                    <span> ₽ </span>
                </p>
                <PropertyListItem
                    v-for="(prop, idx) in price.properties"
                    :key="prop.label + idx"
                    :value="prop.value"
                    :valueMin="prop.valueMin"
                    :valueMax="prop.valueMax"
                    :name="prop.label"
                    :unitType="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
                />
            </PropertyList>
        </div>
        <div class="building-info__line">
            <!--      <parameters-->
            <!--					-->
            <!--        :height="parameters.summary.parameters.characteristics.height"-->
            <!--        :floorType="parameters.summary.parameters.characteristics.floorType"-->
            <!--        :gatesNumber="parameters.summary.parameters.characteristics.gatesNumber"-->
            <!--        :electricity="parameters.summary.parameters.communications.electricity"-->
            <!--        :heating="parameters.summary.parameters.communications.heating"-->
            <!--        :sewage="parameters.summary.parameters.communications.sewage"-->
            <!--        :gasForProduction="-->
            <!--          parameters.summary.parameters.communications.gasForProduction-->
            <!--        "-->
            <!--        :liftingDevices="parameters.summary.parameters.liftingDevices.lifts"-->
            <!--        :shelving="parameters.summary.parameters.facilities.shelving"-->
            <!--      />-->
        </div>
        <div class="building-info__line">
            <ComplexTabs :parameters="parameters" class="building-info__tabs" />
            <ActionButton v-bind="actionButtons" class="building-info__buttons" />
        </div>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import PropertyList from '@/components/common/Property/PropertyList.vue';
import PropertyListItem from '@/components/common/Property/PropertyListItem.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import ComplexTabs from '@/components/Complex/ComplexTabs.vue';

export default {
    name: 'ComplexDealBuilding',
    components: { ComplexTabs, ActionButton, PropertyListItem, PropertyList },
    props: {
        area: {
            type: Object,
            required: true
        },
        price: {
            type: Object,
            required: true
        },
        parameters: {
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
        actionButtons() {
            return {
                advert: { value: true },
                dislike: { value: true },
                favorite: { value: true },
                notifications: { value: true },
                pdf: { value: true }
            };
        },
        formattedAreaSum() {
            const { valueMin, valueMax } = this.area.sum;
            return this.$formatter.numberOrRangeNew(valueMin, valueMax);
        },
        formattedPriceSum() {
            const { valueMin, valueMax } = this.price.sum;
            return this.$formatter.numberOrRangeNew(valueMin, valueMax);
        }
    },
    methods: {}
};
</script>