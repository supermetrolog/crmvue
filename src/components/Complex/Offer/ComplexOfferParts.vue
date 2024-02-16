<template>
    <div class="trade-offer-parts">
        <div v-for="floor in filteredFloors" :key="floor.id" class="trade-offer-floor">
            <span class="trade-offer-floor__title">{{ floor.number.title }}</span>
            <ul class="trade-offer-floor__list">
                <li v-for="part in floor.parts" :key="part.id" class="trade-offer-floor__item">
                    <ComplexOfferPartsItem :class="{ disabled: !part.active }" :part="part" />
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import ComplexOfferPartsItem from '@/components/Complex/Offer/ComplexOfferPartsItem.vue';

export default {
    name: 'ComplexOfferParts',
    components: { ComplexOfferPartsItem },
    props: {
        floors: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        filteredFloors() {
            return this.floors.filter(floor => floor.parts.length);
        }
    }
};
</script>
