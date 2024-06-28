<template>
    <div class="offer-table-item-price">
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
        <span v-if="offer.deal_type && offer.offer.tax_form" class="font-weight-bold">
            {{ taxForm }}
        </span>
        <div class="offer-table-item-price__additional">
            <p v-if="!!offer.offer.price_opex" class="offer-table-item-price__item">
                OPEX - {{ opex }}
            </p>
            <p v-if="!!offer.offer.public_services" class="offer-table-item-price__item">
                КУ - {{ publicServices }}
            </p>
        </div>
        <div v-if="offer.offer.built_to_suit === 1" class="offer-table-item-price__built">
            <p>
                <span>{{ builtToSuitType }}</span>
                <span v-if="offer.offer.built_to_suit_time">
                    / {{ offer.offer.built_to_suit_time }} мес.
                </span>
            </p>
        </div>
    </div>
</template>

<script>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { entityOptions } from '@/const/options/options.js';

export default {
    name: 'OfferTableItemPrice',
    components: {
        WithUnitType
    },
    props: {
        offer: {
            type: Object,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        taxForm() {
            return entityOptions.deal.tax[this.offer.offer.tax_form];
        },
        opex() {
            return entityOptions.deal.servicePrice[this.offer.offer.price_opex];
        },
        publicServices() {
            return entityOptions.deal.servicePrice[this.offer.offer.public_services];
        },
        builtToSuitType() {
            return this.offer.offer.deal_type === entityOptions.deal.typeStatement.SALE
                ? 'Built To Sale'
                : 'Built To Rent';
        }
    }
};
</script>
