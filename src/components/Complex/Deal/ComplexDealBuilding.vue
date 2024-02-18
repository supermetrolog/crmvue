<template>
    <div class="building-info">
        <div class="building-info__table-list">
            <PropertyList class="building-info__table">
                <p class="building-info__heading">
                    {{ formattedAreaSum }}
                    <span> м<sup>2</sup> </span>
                </p>
                <!--                <PropertyListItem-->
                <!--                    v-for="(prop, idx) in area.properties"-->
                <!--                    :key="prop.label + idx"-->
                <!--                    :name="prop.label"-->
                <!--                    :value="prop.value"-->
                <!--                    :value-min="prop.valueMin"-->
                <!--                    :value-max="prop.valueMax"-->
                <!--                    :unit-type="unitTypes.SQUARE_METERS"-->
                <!--                />-->
            </PropertyList>
            <PropertyList class="building-info__table">
                <p class="building-info__heading">
                    {{ formattedPriceSum }}
                    <span> ₽ </span>
                </p>
                <!--                <PropertyListItem-->
                <!--                    v-for="(prop, idx) in price.properties"-->
                <!--                    :key="prop.label + idx"-->
                <!--                    :value="prop.value"-->
                <!--                    :value-min="prop.valueMin"-->
                <!--                    :value-max="prop.valueMax"-->
                <!--                    :name="prop.label"-->
                <!--                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"-->
                <!--                />-->
            </PropertyList>
        </div>
        <div class="building-info__line">
            <ComplexParameters :parameters="parameters" />
        </div>
        <div class="building-info__line">
            <!--            <ComplexTabs :parameters="parameters" class="building-info__tabs" />-->
            <ActionButton v-bind="actionButtons" class="building-info__buttons" />
        </div>
    </div>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import PropertyList from '@/components/common/Property/PropertyList.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import ComplexParameters from '@/components/Complex/ComplexParameters.vue';

export default {
    name: 'ComplexDealBuilding',
    components: { ComplexParameters, ActionButton, PropertyList },
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
            const { min, max } = this.area;
            return this.$formatter.numberOrRangeNew(min, max);
        },
        formattedPriceSum() {
            const { min, max } = this.price;
            return this.$formatter.numberOrRangeNew(min, max);
        }
    },
    methods: {}
};
</script>
