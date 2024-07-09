<template>
    <li class="object-equipment">
        <span v-if="hasBadStatus" class="object-equipment__info"></span>
        <Tooltip>
            <template #trigger>
                <IconElevator class="object-equipment__icon" />
                <p v-if="title" class="object-equipment__header">
                    {{ title }}
                </p>
                <p v-if="elevator.elevator_capacity" class="object-equipment__header">
                    {{ elevator.elevator_capacity }} тонн
                </p>
            </template>
            <template #content>
                <span v-if="hasBadStatus" class="object-equipment__status">{{ status }}</span>
                <p
                    v-for="(property, key) in properties"
                    :key="key"
                    class="object-equipment__element"
                >
                    <span class="object-equipment__category">{{ property.name }}:</span>
                    <with-unit-type v-if="property.unitType" :unit-type="property.unitType">
                        {{ property.value }}
                    </with-unit-type>
                    <span v-else>{{ property.value }}</span>
                </p>
            </template>
        </Tooltip>
    </li>
</template>

<script setup>
import { mapper } from '@/utils/mapper';
import { entityProperties } from '@/const/properties/properties';
import Tooltip from '@/components/common/Tooltip.vue';
import IconElevator from '@/components/common/Icons/IconElevator.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { entityOptions } from '@/const/options/options';
import { deleteObjectsWithEmptyProperties } from '@/utils/deleteObjectsWithEmptyProperties.js';
import { computed } from 'vue';

const props = defineProps({
    elevator: {
        type: Object,
        required: true
    }
});

const properties = computed(() => {
    const _properties = mapper.propertiesToTableFormat(
        props.elevator,
        entityProperties.elevator.characteristics
    );

    return deleteObjectsWithEmptyProperties(_properties, 'value', 0);
});
const hasBadStatus = computed(() => {
    return (
        props.elevator.elevator_condition ===
            entityOptions.elevator.conditionStatement.NEED_MAINTENANCE ||
        props.elevator.elevator_condition === entityOptions.elevator.conditionStatement.NEED_REPAIR
    );
});
const status = computed(() => entityOptions.elevator.condition[props.elevator.elevator_condition]);
const title = computed(() => entityOptions.elevator.type[props.elevator.elevator_type]);
</script>
