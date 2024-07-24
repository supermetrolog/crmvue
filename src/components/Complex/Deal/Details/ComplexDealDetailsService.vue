<template>
    <li class="additional-details__item">
        <p class="additional-details__label">{{ title }}</p>
        <p v-if="service.label" class="additional-details__value">
            {{ service.label }}
        </p>
        <WithUnitType
            v-else-if="service.value"
            class="additional-details__value"
            :unitType="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
        >
            {{ service.value }}
        </WithUnitType>
        <div v-else-if="service.items" class="additional-details__elements">
            <p v-for="(item, key) in service.items" :key="key" class="additional-details__element">
                <i :class="item.icon" />
                <span>{{ item.name }}</span>
            </p>
        </div>
    </li>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';

defineProps({
    title: {
        type: String,
        required: true
    },
    service: {
        type: Object,
        required: true
    }
});
</script>
