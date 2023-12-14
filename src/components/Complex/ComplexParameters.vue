<template>
    <ul class="object-parameters">
        <li v-if="object.ceiling_height" class="object-parameters__item">
            <i class="fas fa-arrow-up"/>
            {{ $formatter.number(object.ceiling_height) }} <span>м</span>
        </li>
        <li v-if="object.floor_type" class="object-parameters__item">
            <i class="fas fa-arrow-down"/>
            {{ object.floor_type }}
        </li>
        <li v-if="object.gas" class="object-parameters__item">
            <i class="fas fa-fire"/>
            Газ в цеху
        </li>
        <li v-if="object.power" class="object-parameters__item">
            <i class="fas fa-bolt"/>
            <with-unit-type
                :unit-type="unitTypes.KILOWATT">
                {{ $formatter.number(object.power) }}
            </with-unit-type>
        </li>
        <li v-if="object.heating" class="object-parameters__item">
            <i class="fa fa-thermometer-full"/>
            Отопление
        </li>
        <li v-if="object.sewage" class="object-parameters__item">
            <i class="fas fa-shower"/>
            Канализация
        </li>
        <li v-if="object.water" class="object-parameters__item">
            <i class="fas fa-tint"></i>
            Водоснабжение
        </li>
        <li v-if="object.internet" class="object-parameters__item">
            <i class="fas fa-wifi"></i>
            Интернет, {{ object.internet_type }}
        </li>
    </ul>
</template>

<script>
import {unitTypes} from "@/const/unitTypes";
import WithUnitType from "@/components/common/WithUnitType.vue";

export default {
    name: "ComplexParameters",
    components: {
        WithUnitType
    },
    props: {
        object: {
            type: Object,
            required: true,
            default: () => {
            }
        }
    },
    data() {
        return {
            unitTypes,
        };
    },
    computed: {},
};
</script>
