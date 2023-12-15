<template>
    <p class="with-unit-type">
        <slot />
        <component :is="unitComponentName" />
    </p>
</template>

<script>
import { unitTypes } from '@/const/unitTypes.js';
import UnitTypeCelcius from '@/components/common/UnitTypes/UnitTypeCelcius.vue';
import UnitTypeCubicMetersPerHour from '@/components/common/UnitTypes/UnitTypeCubicMetersPerHour.vue';
import UnitTypeTonPerSquareMeters from '@/components/common/UnitTypes/UnitTypeTonPerSquareMeters.vue';
import UnitTypeFloors from '@/components/common/UnitTypes/UnitTypeFloors.vue';
import UnitTypeKilowatts from '@/components/common/UnitTypes/UnitTypeKilowatts.vue';
import UnitTypePalletPlace from '@/components/common/UnitTypes/UnitTypePalletPlace.vue';
import UnitTypePercents from '@/components/common/UnitTypes/UnitTypePercents.vue';
import UnitTypePerYear from '@/components/common/UnitTypes/UnitTypePerYear.vue';
import UnitTypeRubles from '@/components/common/UnitTypes/UnitTypeRubles.vue';
import UnitTypeRubPerMonth from '@/components/common/UnitTypes/UnitTypeRubPerMonth.vue';
import UnitTypeRubPerSquareMetersPerMonth from '@/components/common/UnitTypes/UnitTypeRubPerSquareMetersPerMonth.vue';
import UnitTypeRubPerSquareMetersPerYear from '@/components/common/UnitTypes/UnitTypeRubPerSquareMetersPerYear.vue';
import UnitTypeRubPerYear from '@/components/common/UnitTypes/UnitTypeRubPerYear.vue';
import UnitTypeSquareMeters from '@/components/common/UnitTypes/UnitTypeSquareMeters.vue';
import UnitTypeSquareMetersPerYear from '@/components/common/UnitTypes/UnitTypeSquareMetersPerYear.vue';
import UnitTypeMeters from '@/components/common/UnitTypes/UnitTypeMeters.vue';
import UnitTypePieces from '@/components/common/UnitTypes/UnitTypePieces.vue';
import UnitTypeTons from '@/components/common/UnitTypes/UnitTypeTons.vue';

export default {
    name: 'WithUnitType',
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
        UnitTypeSquareMeters,
        UnitTypePieces,
        UnitTypeMeters,
        UnitTypeTons
    },
    props: {
        unitType: {
            type: String,
            default: unitTypes.NONE
        }
    },
    computed: {
        unitComponentName() {
            return 'UnitType' + this.unitType;
        }
    }
};
</script>