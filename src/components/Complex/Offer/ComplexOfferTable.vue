<template>
    <div class="trade-offer-table">
        <p class="trade-offer-table__subtitle">{{ subtitle }}</p>
        <with-unit-type class="trade-offer-table__title" :unitType="titleUnitType">
            {{ title }}
        </with-unit-type>
        <ul class="trade-offer-table__list">
            <li v-for="(property, idx) in propertyList" :key="property.label + idx" class="trade-offer-table__item">
                <p class="trade-offer-table__text trade-offer-table__text_label">
                    {{ property.label }}
                </p>
                <with-unit-type class="trade-offer-table__text" :unitType="propertyUnitType">
                    {{ $formatter.numberOrRangeNew(property.valueMin, property.valueMax) }}
                </with-unit-type>
            </li>
        </ul>
    </div>
</template>

<script>
import WithUnitType from '@/components/common/WithUnitType.vue';

export default {
    name: 'ComplexOfferTable',
    components: { WithUnitType },
    props: {
        title: {
            type: String,
            required: true
        },
        titleUnitType: {
            type: String
        },
        propertyUnitType: {
            type: String
        },
        subtitle: {
            type: String,
            required: true
        },
        propertyList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {},
    methods: {}
};
</script>