<template>
    <div class="messenger-quiz-question-template-offer__column">
        <p class="fs-2 text-grey font-weight-semi">Цены:</p>
        <div class="d-flex">
            <div class="font-weight-bold">
                <with-unit-type
                    v-if="offer.deal_type === 1 || offer.deal_type === 4"
                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
                >
                    {{ offer.calc_price_warehouse }}
                </with-unit-type>
                <with-unit-type
                    v-else-if="offer.deal_type === 2"
                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS"
                >
                    {{ offer.calc_price_sale }}
                </with-unit-type>
                <p v-else-if="offer.deal_type === 3">
                    {{ offer.calc_price_safe_pallet }} <small>руб за 1 п. м.</small>
                </p>
            </div>
            <span v-if="offer.deal_type && offer.offer.tax_form">, {{ taxForm }}</span>
        </div>
        <div class="offer-table-item-price__additional">
            <span v-if="!!offer.offer.price_opex" class="offer-table-item-price__item">
                OPEX - {{ opex }}
            </span>
            <span v-if="!!offer.offer.price_opex && !!offer.offer.public_services">; </span>
            <span v-if="!!offer.offer.public_services" class="offer-table-item-price__item">
                КУ - {{ publicServices }}
            </span>
        </div>
        <div v-if="offer.offer.built_to_suit === 1" class="offer-table-item-price__built">
            <span>{{ builtToSuitType }}</span>
            <span v-if="offer.offer.built_to_suit_time">
                / {{ offer.offer.built_to_suit_time }} мес.
            </span>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';

const props = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

const taxForm = computed(() => dealOptions.tax[props.offer.offer.tax_form]);

const opex = computed(() => dealOptions.servicePrice[props.offer.offer.price_opex]);

const publicServices = computed(() => dealOptions.servicePrice[props.offer.offer.public_services]);

const builtToSuitType = computed(() => {
    return props.offer.offer.deal_type === dealOptions.typeStatement.SALE
        ? 'Built To Sale'
        : 'Built To Rent';
});
</script>
