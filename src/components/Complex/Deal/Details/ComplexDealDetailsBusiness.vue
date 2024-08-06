<template>
    <div class="additional-details-business">
        <p class="additional-details-business__title">Арендный бизнес</p>
        <ul class="additional-details-business__list">
            <li
                v-for="(property, key) in properties"
                :key="key"
                class="additional-details-business__item"
            >
                <span class="additional-details-business__label">
                    {{ property.name }}
                </span>
                <with-unit-type
                    v-if="property.value"
                    class="additional-details-business__value"
                    :unit-type="property.unitType"
                >
                    {{ toNumberFormat(property.value) }}
                </with-unit-type>
                <span v-else>[не заполнено]</span>
            </li>
        </ul>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { toNumberFormat } from '@/utils/formatter.js';

defineProps({
    properties: {
        type: Array,
        required: true
    }
});
</script>
