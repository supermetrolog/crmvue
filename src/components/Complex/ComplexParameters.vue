<template>
    <ul class="complex-parameters">
        <li
            v-for="(parameter, index) in parameters"
            :key="'range-' + index"
            v-tippy="parameter.name"
            class="complex-parameters__item"
        >
            <i v-if="parameter.icon" :class="parameter.icon" />
            <span v-if="parameter.range" class="complex-parameters__text">
                <template v-if="!parameter.icon">{{ parameter.name }} - </template>
                <with-unit-type :unit-type="parameter.unitType">
                    {{ $formatter.numberOrRangeNew(parameter.valueMin, parameter.valueMax) }}
                </with-unit-type>
            </span>
            <span v-else-if="parameter.count" class="complex-parameters__text">
                <template v-if="!parameter.icon">{{ parameter.name }} - </template>
                <with-unit-type :unit-type="parameter.unitType">
                    {{ $formatter.toCorrectValue(parameter.value) }}
                </with-unit-type>
            </span>
            <span v-else-if="parameter.valueCount">
                <with-unit-type v-if="parameter.unitType" :unit-type="parameter.unitType">
                    {{ parameter.valueCount }}
                </with-unit-type>
                <template v-else>
                    {{ parameter.valueCount }}
                </template>
            </span>
            <template v-else-if="parameter.types">
                <span v-if="parameter.withCount">
                    <span v-if="!parameter.icon">{{ parameter.name }} - </span>
                    <span>{{ parameter.value[1] }} шт.</span>
                    <span v-if="parameter.types">, {{ parameter.types[parameter.value[0]] }}</span>
                </span>
                <span v-else>
                    <span v-if="!parameter.icon">{{ parameter.name }} - </span>
                    <template v-if="parameter.multiple">
                        <span
                            v-for="(value, index) in parameter.value"
                            :key="parameter.name + index"
                            class="complex-parameters__value"
                        >
                            {{ parameter.types[value] }}
                        </span>
                    </template>
                    <span v-else>
                        {{ parameter.types[parameter.value] }}
                    </span>
                </span>
            </template>
            <span v-else>{{ parameter.name }}</span>
        </li>
    </ul>
</template>

<script>
import { unitTypes } from '@/const/unitTypes';
import WithUnitType from '@/components/common/WithUnitType.vue';

export default {
    name: 'ComplexParameters',
    components: {
        WithUnitType
    },
    props: {
        parameters: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            unitTypes
        };
    }
};
</script>
