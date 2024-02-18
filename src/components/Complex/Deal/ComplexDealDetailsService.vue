<template>
    <div class="additional-details-service">
        <div class="additional-details-service__header">
            <span>{{ title }}</span>
            <span :class="{ disabled: service.status === 2 }">{{ service.label }}</span>
        </div>
        <div v-if="service.status === 3" class="additional-details-service__item">
            <p class="additional-details-service__label">{{ service.name }}</p>
            <with-unit-type
                class="additional-details-service__value"
                :unitType="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
            >
                {{ service.value }}
            </with-unit-type>
        </div>
        <div v-else-if="service.status === 2" class="additional-details-service__elements">
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
</template>

<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';

export default {
    name: 'ComplexDealDetailsService',
    components: { WithUnitType },
    props: {
        title: {
            type: String,
            required: true
        },
        service: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {
        unitTypes() {
            return unitTypes;
        }
    }
};
</script>
