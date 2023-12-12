<template>
    <p class="with-unit-type">
        <slot/>
        <component :is="unitComponentName"/>
    </p>
</template>

<script>
import {unitTypes} from "@/const/unitTypes.js";
import UnitTypeCelcius from "@/components/unit-types/UnitTypeCelcius.vue";
import UnitTypeCubicMetersPerHour from "@/components/unit-types/UnitTypeCubicMetersPerHour.vue";
import UnitTypeTonPerSquareMeters from "@/components/unit-types/UnitTypeTonPerSquareMeters.vue";
import UnitTypeFloors from "@/components/unit-types/UnitTypeFloors.vue";
import UnitTypeKilowatts from "@/components/unit-types/UnitTypeKilowatts.vue";
import UnitTypePalletPlace from "@/components/unit-types/UnitTypePalletPlace.vue";
import UnitTypePercents from "@/components/unit-types/UnitTypePercents.vue";
import UnitTypePerYear from "@/components/unit-types/UnitTypePerYear.vue";
import UnitTypeRubles from "@/components/unit-types/UnitTypeRubles.vue";
import UnitTypeRubPerMonth from "@/components/unit-types/UnitTypeRubPerMonth.vue";
import UnitTypeRubPerSquareMetersPerMonth from "@/components/unit-types/UnitTypeRubPerSquareMetersPerMonth.vue";
import UnitTypeRubPerSquareMetersPerYear from "@/components/unit-types/UnitTypeRubPerSquareMetersPerYear.vue";
import UnitTypeRubPerYear from "@/components/unit-types/UnitTypeRubPerYear.vue";
import UnitTypeSquareMeters from "@/components/unit-types/UnitTypeSquareMeters.vue";
import UnitTypeSquareMetersPerYear from "@/components/unit-types/UnitTypeSquareMetersPerYear.vue";

export default {
    name: "WithUnitType",
    components: {
        UnitTypeSquareMetersPerYear,
        UnitTypePalletPlace,
        UnitTypeRubPerSquareMetersPerYear,
        UnitTypeRubPerMonth,
        UnitTypeCelcius,
        UnitTypeCubicMetersPerHour,
        UnitTypeTonPerSquareMeters,
        UnitTypeFloors,
        UnitTypeKilowatts,
        UnitTypePercents,
        UnitTypePerYear,
        UnitTypeRubles,
        UnitTypeRubPerSquareMetersPerMonth,
        UnitTypeRubPerYear,
        UnitTypeSquareMeters
    },
    props: {
        unitType: {
            type: String,
            default: unitTypes.NONE,
        }
    },
    computed: {
        unitComponentName() {
            return 'UnitType' + unitTypes[this.unitType]
        }
    }
};
</script>