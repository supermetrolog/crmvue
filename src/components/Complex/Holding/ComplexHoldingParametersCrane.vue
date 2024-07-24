<template>
    <li class="object-equipment">
        <span v-if="crane.state && crane.state.id > 1" class="object-equipment__info"></span>
        <Tooltip>
            <template #trigger>
                <IconCrane class="object-equipment__icon" />
                <p v-if="crane.crane_type" class="object-equipment__header">
                    {{ crane.type.title }}
                </p>
                <p v-if="crane.crane_capacity" class="object-equipment__header">
                    {{ crane.crane_capacity }} тонн
                </p>
            </template>
            <template #content>
                <span v-if="status" class="object-equipment__status">{{ status }}</span>
                <p v-if="crane.crane_type" class="object-equipment__title">
                    {{ crane.type.title }}
                </p>
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
import Tooltip from '@/components/common/Tooltip.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import IconCrane from '@/components/common/Icons/IconCrane.vue';
import { entityProperties } from '@/const/properties/properties';
import { mapper } from '@/utils/mapper';
import { computed } from 'vue';

const props = defineProps({
    crane: {
        type: Object,
        required: true
    }
});
const properties = computed(() => {
    return mapper.propertiesToTableFormat(props.crane, entityProperties.crane.characteristics);
});
const status = computed(() => {
    if (props.crane.state && props.crane.state.id > 1) return props.crane.state.title;
    return null;
});
</script>
