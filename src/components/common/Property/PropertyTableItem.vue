<template>
    <div class="property-table__item">
        <span class="property-table__name">{{ property.name }}</span>
        <span class="property-table__value">
            <template v-if="property.value === null">-</template>
            <template v-else>
                <template v-if="property.value instanceof Array">
                    <span class="property-table__elements">
                        <span
                            v-for="(element, key) in property.value"
                            :key="key"
                            class="property-table__element"
                        >
                            <with-unit-type :unit-type="property.unitType">
                                {{ element.value }}
                            </with-unit-type>
                            <span>, {{ element.type }}</span>
                        </span>
                    </span>
                </template>
                <template v-else-if="property.unitType">
                    <with-unit-type :unit-type="property.unitType">
                        {{ $formatter.toCorrectValue(property.value) }}
                    </with-unit-type>
                </template>
                <template v-else>{{ property.value }} </template>
            </template>
        </span>
    </div>
</template>
<script>
import WithUnitType from '@/components/common/WithUnitType.vue';

export default {
    name: 'PropertyTableItem',
    components: { WithUnitType },
    props: {
        property: {
            type: Object,
            required: true
        }
    }
};
</script>
