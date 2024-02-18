<template>
    <div class="trade-offer-details-table">
        <ul class="trade-offer-details-table__column trade-offer-details-table__column--head">
            <li class="trade-offer-details-table__head trade-offer-details-table__head--grey">
                Этажи
            </li>
            <li class="trade-offer-details-table__head">№ блока:</li>
            <li
                v-for="parameter in Object.keys(floorPartCharacteristics)"
                :key="parameter"
                class="trade-offer-details-table__section"
            >
                <p class="trade-offer-details-table__subtitle">{{ parameterTypes[parameter] }}</p>
                <ul class="trade-offer-details-table__properties">
                    <li
                        v-for="subparameter in Object.keys(floorPartCharacteristics[parameter])"
                        :key="subparameter"
                        class="trade-offer-details-table__property"
                    >
                        {{ floorPartCharacteristics[parameter][subparameter].name }}
                    </li>
                </ul>
            </li>
        </ul>
        <div class="trade-offer-details-table__content">
            <div class="trade-offer-details-table__list">
                <ComplexOfferDetailsPart
                    v-for="part in parts"
                    :key="part.id"
                    :part="part"
                    :color="tableHeadColors[part.floor.id % 6]"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { OfferParametersMixin } from '@/components/Complex/Offer/mixins';
import ComplexOfferDetailsPart from '@/components/Complex/Offer/ComplexOfferDetailsPart.vue';
import { floorPartCharacteristics } from '@/const/properties';

const tableHeadColors = ['green', 'blue', 'cyan', 'orange', 'red', 'purple'];

export default {
    name: 'ComplexOfferDetails',
    components: { ComplexOfferDetailsPart },
    mixins: [OfferParametersMixin],
    props: {
        floors: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            tableHeadColors
        };
    },
    computed: {
        floorPartCharacteristics() {
            return floorPartCharacteristics;
        },
        parts() {
            return this.floors
                .reduce(
                    (acc, floor) => [
                        ...acc,
                        ...floor.parts.map(part => ({ ...part, floor: floor.number }))
                    ],
                    []
                )
                .filter(part => part.active);
        }
    }
};
</script>
