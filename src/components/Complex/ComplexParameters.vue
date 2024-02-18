<template>
    <ul class="object-parameters">
        <li
            v-for="(parameter, index) in parameters.range"
            :key="'range-' + index"
            v-tippy="parameter.name"
            class="object-parameters__item"
        >
            <i v-if="parameter.icon" :class="parameter.icon" />
            <span class="object-parameters__text">
                <template v-if="!parameter.icon">{{ parameter.name }} - </template>
                <with-unit-type :unit-type="parameter.unitType">
                    {{ $formatter.numberOrRangeNew(parameter.valueMin, parameter.valueMax) }}
                </with-unit-type>
            </span>
        </li>
        <li
            v-for="(parameter, index) in parameters.count"
            :key="'count-' + index"
            v-tippy="parameter.name"
            class="object-parameters__item"
        >
            <i v-if="parameter.icon" :class="parameter.icon" />
            <span class="object-parameters__text">
                <template v-if="!parameter.icon">{{ parameter.name }} - </template>
                <with-unit-type :unit-type="parameter.unitType">
                    {{ parameter.value }}
                </with-unit-type>
            </span>
        </li>
        <li
            v-for="(parameter, index) in parameters.type"
            :key="'type-' + index"
            v-tippy="parameter.name"
            class="object-parameters__item"
        >
            <i v-if="parameter.icon" :class="parameter.icon" />
            <span v-if="parameter.withCount">
                <template v-if="!parameter.icon">{{ parameter.name }} - </template>
                {{ parameter.value[1] }} шт.
                <template v-if="parameter.types">
                    , {{ parameter.types[parameter.value[0]] }}
                </template>
            </span>
            <span v-if="parameter.valueCount">
                <with-unit-type v-if="parameter.unitType" :unit-type="parameter.unitType">
                    {{ parameter.valueCount }}
                </with-unit-type>
                <template v-else>
                    {{ parameter.valueCount }}
                </template>
            </span>
            <span v-else-if="parameter.types">
                <template v-if="!parameter.icon">{{ parameter.name }} - </template>
                <template v-if="parameter.multiple">
                    <span
                        v-for="(value, index) in parameter.value"
                        :key="parameter.name + index"
                        class="object-parameters__value"
                    >
                        {{ parameter.types[value] }}
                    </span>
                </template>
                <template v-else>
                    {{ parameter.types[parameter.value] }}
                </template>
            </span>
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
