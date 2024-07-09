<template>
    <div v-if="service.status !== serviceStatement.INCLUDED" class="additional-details-service">
        <div class="additional-details-service__header">
            <span>{{ title }}</span>
            <span>{{ service.label }}</span>
        </div>
        <div
            v-if="service.status === serviceStatement.NOT_INCLUDED"
            class="additional-details-service__item"
        >
            <p class="additional-details-service__label">{{ service.name }}</p>
            <with-unit-type
                class="additional-details-service__value"
                :unitType="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
            >
                {{ service.value }}
            </with-unit-type>
        </div>
        <div
            v-else-if="service.status === serviceStatement.PARTLY"
            class="additional-details-service__elements"
        >
            <p
                v-for="(item, key) in service.items"
                :key="key"
                class="additional-details-service__element"
            >
                <i :class="item.icon" />
                <span>{{ item.name }}</span>
            </p>
        </div>
    </div>
    <p v-else class="additional-details__service">
        {{ titleAlt }}
    </p>
</template>

<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';
import { computed } from 'vue';

defineProps({
    title: {
        type: String,
        required: true
    },
    titleAlt: {
        type: String,
        required: true
    },
    service: {
        type: Object,
        required: true
    }
});

const serviceStatement = computed(() => entityOptions.deal.priceServiceStatement);
</script>
