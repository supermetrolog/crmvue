<template>
    <div class="trade-offer-details-table">
        <ul class="trade-offer-details-table__column trade-offer-details-table__column--head">
            <li class="trade-offer-details-table__head trade-offer-details-table__head--grey">
                Этажи
            </li>
            <li class="trade-offer-details-table__head">№ блока:</li>
            <li
                v-for="(parameter, index) in floorPartCharacteristics"
                :key="index"
                class="trade-offer-details-table__section"
            >
                <p class="trade-offer-details-table__subtitle">{{ parameter.name }}</p>
                <ul class="trade-offer-details-table__properties">
                    <li
                        v-for="(subparameter, key) in Object.keys(parameter.properties)"
                        :key="key"
                        class="trade-offer-details-table__property"
                    >
                        {{ parameter.properties[subparameter].name }}
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
import ComplexOfferDetailsPart from '@/components/Complex/Offer/ComplexOfferDetailsPart.vue';
import { entityProperties } from '@/const/properties/properties';

const tableHeadColors = ['green', 'blue', 'cyan', 'orange', 'red', 'purple'];

export default {
    name: 'ComplexOfferDetails',
    components: { ComplexOfferDetailsPart },
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
            return entityProperties.part.characteristicsWithSections;
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
                .sort((first, second) => first.floor.order_row - second.floor.order_row);
        }
    }
};
</script>
